/**
 * Upload Script for SIGNAL's data spotlights
 *
 * Command Line Arguments
 *  Run the script the -h help flag to see up to date descriptions for command line arguments
 *  node ./scripts/upload-spotlight.js -h
 *
 * Example Run
 * node ./scripts/upload-data.js --id housing-spotlight --doc outcomes --statsfile ./data/vaccine_coldspot_statistics_03_15_2022.json --barriersfile ./data/vaccine_coldspot_side_panel_percentages_03_15_2022.json --statebarriersfile ./data/statebarriers.json --locationsfile ./data/vaccine_coldspot_locations_03_15_2022.json
 */

/* eslint "@typescript-eslint/no-var-requires": "off" */
const fs = require("fs");
const path = require("path");
const { ArgumentParser } = require("argparse");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const warnAndExit = (warning) => {
  console.warn(warning);
  process.exit(1);
};

const getJson = (jsonFile) => {
  const rawdata = fs.readFileSync(jsonFile);
  return JSON.parse(rawdata);
};

const argparse = new ArgumentParser({
  description: "SIGNAL - upload spotlight data to Firestore",
  add_help: true,
});

argparse.add_argument("-i", "--id", {
  required: true,
  help: "ID of dataset for collection",
});

argparse.add_argument("-s", "--ageadjusted", {
  requires: false,
  help: "New data for the outcome stats",
});

argparse.add_argument("-a", "--agespecific", {
  required: false,
  help: "New data for the affordability outcomes",
});

argparse.add_argument("-n", "--newId", {
  action: "store_true",
  help: "if the collection id does not exist, creates a new collection",
});

const main = async () => {
  const { id, ageadjusted, agespecific, newId } = argparse.parse_args();

  const files = [
    {
      filePath: ageadjusted,
      extension: "json",
      field: "stats", // TO_REVIEW what is field?
      isArray: true,
      schema: [
        //TODO
        {
          name: "housing_type",
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
      extension: "json",
      field: "stats",
      isArray: true,
      schema: [
        {
          name: "hud_age_group",
          type: "string",
        },
        {
          name: "final_housing_type",
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

  // TO_REVIEW Do I need the const docPath stuff?
  // TO_REVIEW if local directory stuff?

  // read in the files to the data property on each file object
  files.forEach((file) => {
    const json = getJson(file.filePath);
    if (file.property) {
      file.data = json(file.property);
    } else {
      file.data = json;
    }

    // TO_REVIEW This is probably always an array? Writing it as if not though
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

  // local file stuff?
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