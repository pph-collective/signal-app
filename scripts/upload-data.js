/**
 * Upload Script for SIGNAL
 *
 * Command Line Arguments
 *  Run the script the -h help flag to see up to date descriptions for command line arguments
 *  node ./scripts/upload-data.js -h
 *
 * Example Run
 * node ./scripts/upload-data.js --id vax_first_dose_coldspots --date 2022-01-17 --zip ./data/vax_first_dose_coldspots_01_17_2022.zip --csv ./data/vaccine_first_dose_coldspot_summaries_01_17_2022.csv
 */

const fs = require("fs");
const path = require("path");
const shapefile = require("shapefile");
const unzipper = require("unzipper");
const { ArgumentParser } = require("argparse");
const { parse } = require("csv-parse");
const { initializeApp } = require("firebase-admin/app");
const { getStorage } = require('firebase-admin/storage');

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const warnAndExit = (warning) => {
  console.warn(warning);
  process.exit(1);
};

const getGeo = async (zipFile) => {
  const zipReader = fs
    .createReadStream(zipFile, { autoClose: true });
  const zipPipe = zipReader.pipe(unzipper.Parse({ forceStream: true }));

  for await (const entry of zipPipe) {
    const filename = entry.path;

    if (filename.endsWith(".shp")) {
      const geo = [];
      const content = await entry.buffer();
      const source = await shapefile.open(content);

      await shpToGeo(source, geo);

      // Close reader
      zipReader.unpipe();

      return geo
    } else {
      // Dispose of entry's contents otherwise the stream will halt
      // Source: https://www.npmjs.com/package/unzipper
      entry.autodrain();
    }
  }
};

// Source: https://www.npmjs.com/package/shapefile
const shpToGeo = async (source, geo) => {
  const result = await source.read();
  if (result.done) {
    return;
  }

  geo.push(result.value);
  return shpToGeo(source, geo);
}

const getStats = async (csvFile) => {
  const fileContents = fs.readFileSync(csvFile, "utf8");
  const parser = parse(fileContents, {
    columns: true,
    skip_empty_lines: true
  });

  const records = [];
  for await (const record of parser) {
    records.push(record)
  }

  return records
}

const uploadToStorage = async (filePath, convertFn, bucket, storagePath, overwrite) => {
  const storageFile = bucket.file(storagePath);

  // Check Storage File
  if ((await storageFile.exists())[0]) {
    if (overwrite) {
      console.log(`WARNING! File exists in storage. Overwriting... ${storagePath}`);
    } else {
      warnAndExit(`ERROR!: File exists in storage. Use the overwrite flag if you wish to continue: ${storagePath}`);
    }
  }

  console.log("WHY AM I HERE?");

  // Convert Data
  const data = await convertFn(filePath);

  await storageFile.save(JSON.stringify(data));
  console.log(`SUCCESS! Uploaded file to storage: ${storagePath}`);
}

const argparse = new ArgumentParser({
  description: "SIGNAL - import data to storage",
  add_help: true,
});

argparse.add_argument("-i", "--id", {
  required: true,
  help: "ID of dataset for the collection"
});

argparse.add_argument("-d", "--date", {
  required: true,
  help: "Date of dataset, formatted in yyyy-mm-dd"
});

argparse.add_argument("-z", "--zip", {
  required: true,
  help: "Path to shape file zip",
});

argparse.add_argument("-c", "--csv", {
  required: true,
  help: "Path to stats csv",
});

argparse.add_argument("-o", "--overwrite", {
  action: "store_true",
  help: "if files already exists, overwrite it",
});

const main = async () => {
  const {overwrite, zip, csv, id, date} = argparse.parse_args();

  // Check Command Line Arguments
  if (!fs.existsSync(zip)) {
    warnAndExit(`ERROR! File does not exist: ${zip}`);
  }

  if (path.extname(zip).toUpperCase() !== ".ZIP") {
    warnAndExit(`ERROR! Expected a zip file: ${zip}`);
  }

  if (!dateRegex.test(date)) {
    warnAndExit(`ERROR! Incorrect date format. Use yyyy-mm-dd format: ${date}`);
  }

  if (path.extname(csv).toUpperCase() !== ".CSV") {
    warnAndExit(`ERROR! Expected a csv file: ${csv}`);
  }

  process.env.GOOGLE_APPLICATION_CREDENTIALS = "serviceAccount.json";
  initializeApp({ projectId: "signal-ri" });
  const bucket = getStorage().bucket("signal-ri.appspot.com");
  const directory = `${id}/${date}`;

  await uploadToStorage(zip, getGeo, bucket,`${directory}/geo.json`, overwrite);
  await uploadToStorage(csv, getStats, bucket,`${directory}/stats.json`, overwrite);
};

main();
