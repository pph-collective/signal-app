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

`node ./scripts/upload-data.js --id <dataset id> --date <date in yyyy-mm-dd> --zip <path to shape file zip> --csv <path to csv> [--overwrite] [--new]`

### Example

Example Run Command

`node ./scripts/upload-data.js --id vax_first_dose_coldspots --date 2022-01-17 --zip ./data/vax_first_dose_coldspots_01_17_2022.zip --csv ./data/vaccine_first_dose_coldspot_summaries_01_17_2022.csv`

### Command Line Arguments
```
-h, --help            show this help message and exit
-i ID, --id ID        ID of dataset for the collection
-d DATE, --date DATE  Date of dataset, formatted in yyyy-mm-dd
-z ZIP, --zip ZIP     Path to shape file zip
-c CSV, --csv CSV     Path to stats csv
-o, --overwrite       if files already exists, overwrite it
-n, --new             if the collection id does not exist, creates a new
                        collection
```
