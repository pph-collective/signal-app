/**
 * Upload Script for SIGNAL
 *
 * Command Line Arguments
 *  Run the script the -h help flag to see up to date descriptions for command line arguments
 *  node ./scripts/upload-data.js -h
 *
 * Example Run
 * node ./scripts/upload-data.js --id vax_first_dose_coldspots --date 2022-03-15 --geojson ./data/vaccine_coldspot_polygons_03_15_2022.geojson --statsfile ./data/vaccine_coldspot_statistics_03_15_2022.json --barriersfile ./data/vaccine_coldspot_side_panel_percentages_03_15_2022.json --statebarriersfile ./data/statebarriers.json --locationsfile ./data/vaccine_coldspot_locations_03_15_2022.json
 */

/* eslint "@typescript-eslint/no-var-requires": "off" */
const fs = require("fs");
const path = require("path");
const { ArgumentParser } = require("argparse");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { stringify } = require("zipson");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const warnAndExit = (warning) => {
  console.warn(warning);
  process.exit(1);
};

const getJson = (jsonFile) => {
  const rawdata = fs.readFileSync(jsonFile);
  return JSON.parse(rawdata);
};

const argparse = new ArgumentParser({
  description: "SIGNAL - upload data to Firestore",
  add_help: true,
});

argparse.add_argument("-i", "--id", {
  required: true,
  help: "ID of dataset for the collection",
});

argparse.add_argument("-d", "--date", {
  required: true,
  help: "Date of dataset, formatted in yyyy-mm-dd",
});

argparse.add_argument("-g", "--geojson", {
  required: true,
  help: "Path to geojson shape file",
});

argparse.add_argument("-s", "--statsfile", {
  required: true,
  help: "Path to stats json file",
});

argparse.add_argument("-b", "--barriersfile", {
  required: true,
  help: "Path to barriers json file",
});

argparse.add_argument("-r", "--statebarriersfile", {
  required: true,
  help: "Path to state barriers json file",
});

argparse.add_argument("-l", "--locationsfile", {
  required: false,
  help: "Path to locations json file",
});

argparse.add_argument("-o", "--overwrite", {
  action: "store_true",
  help: "if files already exists, overwrite it",
});

argparse.add_argument("-n", "--newId", {
  action: "store_true",
  help: "if the collection id does not exist, creates a new collection",
});

argparse.add_argument("-z", "--localDir", {
  help: "path to local folder to save downloaded files to",
});

const main = async () => {
  const {
    newId,
    overwrite,
    geojson,
    statsfile,
    barriersfile,
    statebarriersfile,
    locationsfile,
    id,
    date,
    localDir,
  } = argparse.parse_args();

  if (!dateRegex.test(date)) {
    warnAndExit(`ERROR! Incorrect date format. Use yyyy-mm-dd format: ${date}`);
  }

  const files = [
    {
      filePath: geojson,
      extension: "geojson",
      field: "geo",
      property: "features",
      isArray: true,
      schema: [
        {
          name: "geometry",
          type: "object",
        },
        {
          name: "properties",
          type: "object",
          schema: [
            {
              name: "cluster_id",
              type: "number",
            },
          ],
        },
        {
          name: "type",
          type: "string",
        },
      ],
    },
    {
      filePath: statsfile,
      extension: "json",
      field: "stats",
      isArray: true,
      schema: [
        {
          name: "cluster_id",
          type: "number",
        },
        {
          name: "name",
          type: "string",
        },
        {
          name: "observed_total",
          type: "number",
        },
        {
          name: "expected_total",
          type: "number",
        },
        {
          name: "population_total",
          type: "number",
        },
        {
          name: "observed_asian",
          type: "number",
        },
        {
          name: "expected_asian",
          type: "number",
        },
        {
          name: "population_asian",
          type: "number",
        },
        {
          name: "observed_black",
          type: "number",
        },
        {
          name: "expected_black",
          type: "number",
        },
        {
          name: "population_black",
          type: "number",
        },
        {
          name: "observed_latino",
          type: "number",
        },
        {
          name: "expected_latino",
          type: "number",
        },
        {
          name: "population_latino",
          type: "number",
        },
        {
          name: "observed_white",
          type: "number",
        },
        {
          name: "expected_white",
          type: "number",
        },
        {
          name: "population_white",
          type: "number",
        },
      ],
    },
    ,
  ];

  // vaccine and booster schemas
  if (["vaccine_first_dose_coldspots", "booster_coldspots"].includes(id)) {
    files.push({
      filePath: locationsfile,
      extension: "json",
      field: "locations",
      isArray: true,
      schema: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "street_address",
          type: "string",
        },
        {
          name: "city",
          type: "string",
        },
        {
          name: "state",
          type: "string",
        },
        {
          name: "zip_code",
          type: "string",
        },
        {
          name: "longitude",
          type: "number",
        },
        {
          name: "latitude",
          type: "number",
        },
        {
          name: "active_in_past_period",
          type: "boolean",
        },
      ],
    });

    files.push({
      filePath: barriersfile,
      extension: "json",
      field: "barriers",
      isArray: true,
      schema: [
        {
          name: "cluster_id",
          type: "number",
        },
        {
          name: "pct_w_no_vehicle",
          type: "number",
        },
        {
          name: "pct_w_no_english",
          type: "number",
        },
        {
          name: "pct_w_no_insurance",
          type: "number",
        },
        {
          name: "pct_w_no_internet",
          type: "number",
        },
      ],
    });

    files.push({
      filePath: statebarriersfile,
      extension: "json",
      field: "state_barriers",
      isArray: false,
      schema: [
        {
          name: "pct_w_no_vehicle",
          type: "number",
        },
        {
          name: "pct_w_no_english",
          type: "number",
        },
        {
          name: "pct_w_no_insurance",
          type: "number",
        },
        {
          name: "pct_w_no_internet",
          type: "number",
        },
      ],
    });
  }

  // barriers schemas for hospitalization hotspots
  if (id === "hospitalization_hotspots") {
    files.push({
      filePath: statebarriersfile,
      extension: "json",
      field: "state_barriers",
      isArray: false,
      schema: [
        {
          name: "pct_over_65",
          type: "number",
        },
        {
          name: "pct_w_no_english",
          type: "number",
        },
        {
          name: "pct_w_no_insurance",
          type: "number",
        },
        {
          name: "pct_w_no_internet",
          type: "number",
        },
      ],
    });

    files.push({
      filePath: barriersfile,
      extension: "json",
      field: "barriers",
      isArray: true,
      schema: [
        {
          name: "pct_over_65",
          type: "number",
        },
        {
          name: "pct_w_no_english",
          type: "number",
        },
        {
          name: "pct_w_no_insurance",
          type: "number",
        },
        {
          name: "pct_w_no_internet",
          type: "number",
        },
      ],
    });
  }

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

  // Check if the collection exists
  const collections = (await db.listCollections()).map((c) => c.id);
  if (!collections.includes(id)) {
    if (newId) {
      console.warn(
        `WARNING! id does not exist in firestore. This script will create the following collection: ${id}`
      );
    } else {
      warnAndExit(`ERROR! id must match an existing collection id: ${collections.join(
        ", "
      )}.
      Use the --newId flag to create a new collection id for "${id}"`);
    }
  }

  const docPath = `${id}/${date}`;
  const docRef = db.collection(id).doc(date);

  const dir = `${localDir}/${docPath}`;

  if (localDir) {
    // Check if directory exists locally
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
          `WARNING! Document exists in Firestore. Overwriting... ${docPath}`
        );
      } else {
        warnAndExit(
          `ERROR!: Document exists in Firestore. Use the overwrite flag if you wish to continue: ${docPath}`
        );
      }
    }
  }

  // read in the files to the data property on each file object
  files.forEach((file) => {
    const json = getJson(file.filePath);
    if (file.property) {
      file.data = json[file.property];
    } else {
      file.data = json;
    }

    // check the file isArray
    if (file.isArray !== Array.isArray(file.data)) {
      warnAndExit(
        `ERROR!: The file for ${file.field} at ${
          file.filePath
        } was expected to contain ${
          file.isArray ? "an array" : "an object"
        }, but is instead contained ${
          Array.isArray(file.data) ? "an array" : "a " + typeof file.data
        }.`
      );
    }

    // check the schema
    if (file.schema) {
      // Check data as an array of objects
      const data = file.isArray ? file.data : [file.data];

      data.forEach((row) => {
        checkSchema(file.schema, row, file.filePath);
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

        fs.writeFile(path, JSON.stringify(data), (err) => {
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
          [field]: stringify(data),
          ...previous,
        }),
        {}
      ),
      last_updated: Date.now(),
    });

    console.log(`SUCCESS! Created document in firestore: ${docPath}`);
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
      warnAndExit(
        `ERROR!: field ${col.name} in object ${JSON.stringify(
          row
        )} in ${filePath} has type ${typeof value}, but expected ${col.type}`
      );
    }

    // recurse on an object with a nested schema
    if (col.schema) {
      checkSchema(col.schema, value, filePath);
    }
  });
};

main();
