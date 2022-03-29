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
const { getFirestore } = require("firebase-admin/firestore");
const { stringify } = require("zipson");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const warnAndExit = (warning) => {
  console.warn(warning);
  process.exit(1);
};

const getJson = (jsonFile) => {
  const rawdata = fs.readFileSync(jsonFile);
  return JSON.parse(rawdata)
}

const getGeo = async (zipFile) => {
  const zipReader = fs
    .createReadStream(zipFile, { autoClose: true });
  const zipPipe = zipReader.pipe(unzipper.Parse({ forceStream: true }));

  const geo = [];
  let shpFile, dbfFile;

  for await (const entry of zipPipe) {
    const filename = entry.path;
    if (filename.endsWith(".shp")) {
      shpFile = await entry.buffer();
    } else if (filename.endsWith(".dbf")) {
      dbfFile = await entry.buffer();
    } else {
      // Dispose of entry's contents otherwise the stream will halt
      // Source: https://www.npmjs.com/package/unzipper
      entry.autodrain();
    }
  }

  if (shpFile) {
    const source = await shapefile.open(shpFile, dbfFile);
    await shpToGeo(source, geo);
  }

  zipReader.unpipe();
  return geo;
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
    cast: true,
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
  description: "SIGNAL - upload data to Firestore",
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

argparse.add_argument("-g", "--geojson", {
  required: true,
  help: "Path to geojson shape file"
})

argparse.add_argument("-s", "--statsfile", {
  required: true,
  help: "Path to stats csv",
});

argparse.add_argument("-o", "--overwrite", {
  action: "store_true",
  help: "if files already exists, overwrite it",
});

argparse.add_argument("-n", "--newId", {
  action: "store_true",
  help: "if the collection id does not exist, creates a new collection"
});

argparse.add_argument("-l", "--localDir", {
  help: "path to local folder to save downloaded files to"
})

const main = async () => {
  const { newId, overwrite, geojson, statsfile, id, date, localDir } = argparse.parse_args();

  if (!dateRegex.test(date)) {
    warnAndExit(`ERROR! Incorrect date format. Use yyyy-mm-dd format: ${date}`);
  }

  if (!fs.existsSync(geojson)) {
    warnAndExit(`ERROR! File does not exist: ${geojson}`);
  }

  const geoExt = path.extname(geojson).toUpperCase();
  if (![".GEOJSON", ".ZIP"].includes(geoExt)){
    warnAndExit(`ERROR! Expected a geojson file: ${geojson}`);
  }

  if (!fs.existsSync(statsfile)) {
    warnAndExit(`ERROR! File does not exist: ${statsfile}`);
  }

  const statsExt = path.extname(statsfile).toUpperCase();
  if (![".JSON", ".CSV"].includes(statsExt)) {
    warnAndExit(`ERROR! Expected a stats file to be JSON or CSV: ${statsfile}`);
  }

  process.env.GOOGLE_APPLICATION_CREDENTIALS = "serviceAccount.json";
  const app = initializeApp();
  const db = getFirestore(app);

  // Check if the collection exists
  const collections = (await db.listCollections()).map((c) => c.id);
  if (!collections.includes(id)) {
    if (newId) {
      console.warn(`WARNING! id does not exist in firestore. This script will create the following collection: ${id}`);
    } else {
      warnAndExit(`ERROR! id must match an existing collection id: ${collections.join(", ")}.
      Use the --newId flag to create a new collection id for "${id}"`);
    }
  }

  const docPath = `${id}/${date}`;
  const docRef = db.collection(id).doc(date);

  const dir = ` ${localDir}/${docPath}`;

  if (localDir) {
    // Check if directory exists locally
    if (fs.existsSync(dir)) {
      if (overwrite) {
        console.warn(`WARNING! Directory exists locally. Overwriting... ${dir}`);
      } else {
        warnAndExit(`ERROR!: Directory exists locally. Use the overwrite flag if you wish to continue: ${dir}`);
      }
    }
  } else {
    // Check if the document exists
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      if (overwrite) {
        console.warn(`WARNING! Document exists in Firestore. Overwriting... ${docPath}`);
      } else {
        warnAndExit(`ERROR!: Document exists in Firestore. Use the overwrite flag if you wish to continue: ${docPath}`);
      }
    }
  }

  // Convert data
  const geo = geoExt === ".GEOJSON" ? getJson(geojson) : await getGeo(geojson);
  const stats = statsExt === ".JSON" ? getJson(statsfile) : await getStats(statsfile);

  if (localDir) {
    // Make directory, no harm done if already exists
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        warnAndExit(err);
      }

      const geoPath = `${dir}/geo.json`;
      const statsPath = `${dir}/stats.json`;

      fs.writeFile(geoPath, JSON.stringify(geo), (err) => {
        if (err) {
          warnAndExit(err);
        }
        console.log(`SUCCESS! Created file: ${geoPath}`);
      });

      fs.writeFile(statsPath, JSON.stringify(stats), (err) => {
        if (err) {
          warnAndExit(err);
        }
        console.log(`SUCCESS! Created file: ${statsPath}`);
      });
    });
  } else {
    await docRef.set({
      geo: stringify(geo),
      stats: stringify(stats),
      last_updated: Date.now()
    });

    console.log(`SUCCESS! Created document in firestore: ${docPath}`);
  }
};

main();
