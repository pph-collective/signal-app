// node ./scripts/test.js -e --id vax_first_dose_coldspots --date 2022-01-17 --zip ./data/vax_first_dose_coldspots_01_17_2022.zip --csv ./data/vaccine_first_dose_coldspot_summaries_01_17_2022.csv

const fs = require("fs");
const path = require("path");
const shapefile = require("shapefile");
const unzipper = require("unzipper");
const { ArgumentParser } = require("argparse");
const { parse } = require("csv-parse");

const admin = require("firebase-admin");
const firebaseJSON = require("../firebase.json");

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

      // Source: https://www.npmjs.com/package/shapefile
      await shapefile.open(content)
        .then(source => source.read()
          .then(function log(result) {
            if (result.done) return;
            geo.push(result.value);
            return source.read().then(log);
          }))
        .catch(error => console.error(error.stack));

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

const argparse = new ArgumentParser({
  description: "SIGNAL - import data",
  add_help: true,
});

argparse.add_argument("-e", "--emulator", {
  action: "store_true",
  help: "upload form to the emulator instead of production DB",
});
argparse.add_argument("-o", "--overwrite", {
  action: "store_true",
  help: "if the form already exists, overwrite it",
});
argparse.add_argument("-z", "--zip", {
  required: true,
  help: "Path to shape file zip",
});

argparse.add_argument("-c", "--csv", {
  required: true,
  help: "ID of the form",
});

argparse.add_argument("-i", "--id", {
  required: true,
  help: "ID of dataset for the collection"
})

argparse.add_argument("-d", "--date", {
  required: true,
  help: "Date of dataset, formatted in yyyy-mm-dd"
})

const main = async () => {
  const {emulator, overwrite, zip, csv, id, date} = argparse.parse_args();

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

  if (emulator) {
    console.log("using emulator");
    process.env.FIRESTORE_EMULATOR_HOST = `localhost:${firebaseJSON.emulators.firestore.port}`
  }
  process.env.GOOGLE_APPLICATION_CREDENTIALS = "serviceAccount.json";

  if (path.extname(csv).toUpperCase() !== ".CSV") {
    warnAndExit(`ERROR! Expected a csv file: ${csv}`);
  }

  const app = admin.initializeApp();
  const db = app.firestore();

  const document = db.collection(id).doc(date);


  await document.get().then((doc) => {
    if (doc.exists && !overwrite) {
      warnAndExit(`ERROR! Data already exists in firebase for id: ${id}, date: ${date}. Use the overwrite flag if you wish to continue`);
    }
  })

  // const geo = await getGeo(zip);
  const stats = await getStats(csv);

  await document.set({
    // geo
    stats,
    last_updated: Date.now()
  });

  console.log("FINISHED");
};

main();
