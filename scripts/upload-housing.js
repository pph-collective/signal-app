/**
 * Upload Script for SIGNAL's data spotlights
 *
 * Command Line Arguments
 *  Run the script the -h help flag to see up to date descriptions for command line arguments
 *  node ./scripts/upload-spotlight.js -h
 *
 * Example Run
 * node ./scripts/upload-housing.js --ageadjusted ./data/age_adjusted.csv --agespecific ./data/age_specific.csv --id housing
 */

/* eslint "@typescript-eslint/no-var-requires": "off" */
const fs = require("fs");
const { parse } = require("csv-parse/sync");
const path = require("path");
const { ArgumentParser } = require("argparse");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const warnAndExit = (warning) => {
  console.warn(warning);
  process.exit(1);
};

const getCsv = (csvFile) => {
  const rawdata = fs.readFileSync(csvFile, "utf-8");
  return parse(rawdata, { columns: true, skip_empty_lines: true });
};

const argparse = new ArgumentParser({
  description: "SIGNAL - upload spotlight data to Firestore",
  add_help: true,
});

argparse.add_argument("-a", "--ageadjusted", {
  required: true,
  help: "New data for the outcome stats",
});

argparse.add_argument("-s", "--agespecific", {
  required: true,
  help: "New data for the affordability outcomes",
});

argparse.add_argument("-o", "--overwrite", {
  action: "store_true",
  help: "if files already exist, overwrite them",
});

argparse.add_argument("-z", "--localDir", {
  help: "path to local folder to save download files to",
});

argparse.add_argument("-i", "--id", {
  help: "the spotlight to upload",
});

argparse.add_argument("-n", "--newId", {
  action: "store_true",
  help: "if the collection id does not exist, creates a new collection",
});

const main = async () => {
  const { ageadjusted, agespecific, overwrite, localDir, id, newId } =
    argparse.parse_args();

  const files = [
    {
      filePath: ageadjusted,
      extension: "csv",
      field: "age_adjusted",
      isArray: true,
      schema: [
        {
          name: "category",
          type: "string",
        },
        {
          name: "age_adjusted_rate",
          type: "number",
        },
        {
          name: "outcome_type",
          type: "string",
        },
      ],
    },
    {
      filePath: agespecific,
      extension: "csv",
      field: "age_specific",
      isArray: true,
      schema: [
        {
          name: "hud_age_group",
          type: "string",
        },
        {
          name: "category",
          type: "string",
        },
        {
          name: "age_specific_rate",
          type: "number",
        },
        {
          name: "outcome_type",
          type: "string",
        },
        {
          name: "age_lower_bound",
          type: "number",
        },
      ],
    },
  ];

  files.forEach(({ filePath, extension }) => {
    if (!fs.existsSync(filePath)) {
      warnAndExit(`ERROR! File does not exist: ${filePath}`);
    }

    if (path.extname(filePath).toLowerCase() !== `.${extension}`) {
      warnAndExit(`ERROR! Expected a .${extension} file: ${filePath}`);
    }
  });

  process.env.GOOGLE_APPLICATION_CREDENTIALS = "serviceAccount.json";
  const app = initializeApp();
  const db = getFirestore(app);

  // Check if the spotlight collection exists
  const docRef = db.collection("spotlights").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    // check if document exists. If not, require --newId flag
    if (newId) {
      console.warn(
        `WARNING! id does not exist in firestore. This script will create the following collection: ${id}`
      );
    } else {
      warnAndExit(`ERROR! id must match an existing collection id.
      Use the --newId flag to create a new collection id for "${id}"`);
    }
  }

  const dir = `${localDir}/spotlights/${id}`;

  if (localDir) {
    if (fs.existsSync(dir)) {
      if (overwrite) {
        console.warn(
          `WARNING! Directory exists locally. Overwriting... ${dir}`
        );
      } else {
        warnAndExit(
          `ERROR!: Directory exists locally. Use the overwrite flag if you wish to continue: ${dir}`
        );
      }
    }
  } else {
    // Check if the document exists
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      if (overwrite) {
        console.warn(
          `WARNING! Document exists in Firestore. Overwriting... ${id}`
        );
      } else {
        warnAndExit(
          `ERROR!: Document exists in Firestore. Use the overwrite flag if you wish to continue: ${id}`
        );
      }
    }
  }

  const l = [];
  // read in the files to the data property on each file object
  files.forEach((file) => {
    const csv = getCsv(file.filePath, file.field, docRef, db);
    file.data = csv;
    l.push(csv);
    // check the file isArray
    if (file.isArray !== Array.isArray(file.data)) {
      warnAndExit(
        `ERROR!: The file for ${file.field} at ${
          file.filePath
        } was expected to contain ${
          file.isArray ? "an array" : "an object"
        }, but it instead contained ${
          Array.isArray(file.data) ? "an array" : "a " + typeof file.data
        }.`
      );
    }

    // check the schema
    if (file.schema) {
      // Check data as an array of objects
      const data = file.isArray ? file.data : [file.data];

      data.forEach((row) => {
        checkSchema(file.schema, row, file.filepath);
      });
    }
  });

  if (localDir) {
    // Make directory, no harm done if already exists
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        warnAndExit(err);
      }

      files.forEach(({ field, data }) => {
        const path = `${dir}/${field}.json`;

        fs.writeFile(path, data, (err) => {
          if (err) {
            warnAndExit(err);
          }
          console.log(`SUCCESS! Created file: ${path}`);
        });
      });
    });
  } else {
    await docRef.set({
      ...files.reduce(
        (previous, { data, field }) => ({
          [field]: data,
          ...previous,
        }),
        {}
      ),
      last_updated: Date.now(),
    });
    console.log(`SUCCESS! Created document in firestore: spotlights/${id}`);
  }
};

const checkSchema = (schema, row, filePath) => {
  schema.forEach((col) => {
    const value = row[col.name];
    if (value === undefined) {
      warnAndExit(
        `ERROR!: object ${JSON.stringify(
          row
        )} in ${filePath} is missing field ${col.name}`
      );
    }
    if (typeof value !== col.type) {
      if (col.type === "number") {
        try {
          row[col.name] = Number(value);
        } catch (e) {
          warnAndExit(`Could not convert field ${col.name} to number!`);
        }
      } else {
        warnAndExit(
          `ERROR!: field ${col.name} in object ${JSON.stringify(
            row
          )} in ${filePath} has type ${typeof value}, but expected ${col.type}`
        );
      }
    }
  });
  return row;
};

main();
