// node ./scripts/test.js -e --zip ./data/vax_first_dose_coldspots_01_17_2022.zip

const fs = require("fs");
const path = require("path");
const shapefile = require("shapefile");
const unzipper = require("unzipper");
const {ArgumentParser} = require("argparse");

const warnAndExit = (warning) => {
  console.warn(warning);
  process.exit(1);
};

const getGeo = async (file) => {
  const zipReader = fs
    .createReadStream(file, { autoClose: true });
  const zipPipe = zipReader.pipe(unzipper.Parse({ forceStream: true }));

  for await (const entry of zipPipe) {
    const filename = entry.path;

    if (filename.endsWith(".shp")) {
      const content = await entry.buffer();

      const geo = [];
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

const parser = new ArgumentParser({
  description: "SIGNAL - import data",
  add_help: true,
});

parser.add_argument("-e", "--emulator", {
  action: "store_true",
  help: "upload form to the emulator instead of production DB",
});
parser.add_argument("-o", "--overwrite", {
  action: "store_true",
  help: "if the form already exists, overwrite it",
});
parser.add_argument("-z", "--zip", {
  required: true,
  help: "Path to data file",
});
// parser.add_argument("-c", "--csv", {
//   required: true,
//   help: "ID of the form",
// });

const main = async () => {
  const {emulator, overwrite, zip, csv} = parser.parse_args();

  if (!fs.existsSync(zip)) {
    warnAndExit(`ERROR! File does not exist: ${zip}`);
  }

  if (path.extname(zip).toUpperCase() !== ".ZIP") {
    warnAndExit(`ERROR! Expected a zip file: ${zip}`);
  }

  // if (path.extname(csv).toUpperCase() !== ".CSV") {
  //   warnAndExit(`ERROR! Expected a csv file: ${csv}`);
  // }

  const geo = await getGeo(zip);
  console.log(geo);
};

main();
