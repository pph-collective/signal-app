# SIGNAL Scripts

This directory contains utility scripts for the SIGNAL web app.

## Admin Setup

Requires Node 16+. To check, run the following command.
```bash
$ node -v
```


#### Set up Firebase
```bash
$ firebase login
```

### Create a Service Account
1. Navigate to the Firebase console to generate a private key (Settings > Service Accounts).
2. Click **Generate New Private Key** and save the JSON file as `serviceAccount.json`
3. Add that JSON file to the project root directory. This file is listed in the `.gitignore`. Do not share this private key.

## `upload-data`

Uploads the data for the SIGNAL project to Firestore.

The shape file zip and stats csv are converted to json. Then are compressed and uploaded to Firestore.

### Usage

Run

`node ./scripts/upload-data.js --id <dataset id> --date <date in yyyy-mm-dd> --geojson <path to shape file geojson> --statsfile <path to stats json> [--overwrite] [--newId]`

### Example

Example Run Command

`node ./scripts/upload-data.js --id vax_first_dose_coldspots --date 2022-03-15 --geojson ./data/vaccine_coldspot_polygons_03_15_2022.geojson --statsfile ./data/vaccine_coldspot_statistics_03_15_2022.json`

### Command Line Arguments
```
-h, --help            show this help message and exit
-i, --id ID           ID of dataset for the collection
-d, --date DATE       Date of dataset, formatted in yyyy-mm-dd
-g, --geojson         Path to geojson shape file
-s, --statsfile       Path to stats json file
-o, --overwrite       if files already exists, overwrite it
-n, --newId           if the collection id does not exist, creates a new collection
```
