# SIGNAL Scripts

This directory contains utility scripts for the SIGNAL web app.

## Table of Contents
1. [Tools Setup](#tools-setup)
2. [Setup Signal](#setup-signal)
3. [Set up for running the admin scripts](#set-up-for-running-the-admin-scripts)
4. [Run the upload script](#upload-data)

## Tools Setup
1. [Download Visual Studio Code](https://code.visualstudio.com/) or use whichever code editor you'd prefer.
2. [Download Node version 16+](https://nodejs.org/en/download/)
    - To check if you have node installed, open a terminal window and run the following command.
    ```bash
    node -v
    ```
3. For MacOS, install xcode command line tools
   - Check if you have it already installed. In your terminal run the following command.
     ```
     xcode-select -p
     ```
     If you see an error, the package has not been installed otherwise you're good to go.
   - To install xcode command line tools run the following command.
     ```
     xcode-select --install
     ```
4. Install Firebase Tools
   - Run the following command in terminal
     ```
     sudo npm install -g firebase-tools
     ```
     
## Setup Signal
1. In terminal, navigate to the folder you want to put the `signal-app` project into.
    - [Terminal for beginners tutorial!](https://medium.com/@grace.m.nolan/terminal-for-beginners-e492ba10902a)
        - Only really need `ls`, `cd`, `pwd`
        - Use `ls` command to see the folder you're in, and then `cd` to navigate.
            - `ls` lists files in current directory
            - `cd` change directory
        - Mine is at `/Users/ellen/Documents/Projects` so I could do `cd /Users/ellen/Documents/Projects`. 
          Which is the absolute path to my project directory.
2. Go to the [signal-app repository](https://github.com/pph-collective/signal-app)
3. Clone the repository. 
  - On the page you'll see a green "Code" button, click it and copy the https `https://github.com/pph-collective/signal-app.git`
  - In the terminal, run `git clone` with the https you just copied. The full command is as follows:
    ```
    git clone https://github.com/pph-collective/signal-app.git
    ```
    This will create the directory `signal-app`.
4. Open VSCode and open the folder `signal-app`
5. Create a new file in the root folder (`signal-app`) and name it `.env`. It'll be a text file.
   - In this file, it will have an environment variable key `VITE_MAPBOX_ACCESS_TOKEN` which allows us to use mapbox and 
     show our map in the app when run locally.
   - :exclamation: Ask another team member for what go into this file and do not share it publicly.
6. Open a terminal in VSCode. This will open a terminal at the project folder root.
7. Install dependencies. In the terminal you just opened run the following command:
   ```
   npm install
   ```
8. Run the app! 
   ```
   npm run dev
   ```
   And then the project should be running on a local server!
9. To stop the server press `ctrl + c` instead of the terminal

## Set up for running the admin scripts
1. In a new terminal, run the following command. It should force you to log into your gmail.
   ```
   firebase login
   ```

### Create a Service Account
1. Navigate to the Firebase console to generate a private key (Settings > Service Accounts).
2. Click **Generate New Private Key** and save the JSON file as `serviceAccount.json`
3. Add that JSON file to the project root directory (`signal-app`). This file is listed in the `.gitignore`. Do not share this private key.

## upload-data

Uploads the data for the SIGNAL project to Firestore.

### Usage

Run

`node ./scripts/upload-data.js --id <dataset id> --date <date in yyyy-mm-dd> --geojson <path to cluster geojson> --statsfile <path to stats json> --barriersfile <path to barriers json> --statebarriersfile <path to state barriers json> --locationsfile <path to locations file> [--overwrite] [--newId]`

### Example

Example Run Command

`node ./scripts/upload-data.js --id vax_first_dose_coldspots --date 2022-03-15 --geojson ./data/vaccine_coldspot_polygons_03_15_2022.geojson --statsfile ./data/vaccine_coldspot_statistics_03_15_2022.json --barriersfile ./data/vaccine_coldspot_side_panel_percentages_03_15_2022.json --statebarriersfile ./data/statebarriers.json --locationsfile ./data/vaccine_coldspot_locations_03_15_2022.json`

### Command Line Arguments
```
-h, --help                show this help message and exit
-i, --id ID               ID of dataset for the collection
-d, --date DATE           Date of dataset, formatted in yyyy-mm-dd
-g, --geojson             Path to geojson shape file
-s, --statsfile           Path to stats json file
-b, --barriersfile        Path to barriers json file
-r, --statebarriersfile   Path to state barriers json file
-l, --locationsfile       Path to locations json file
-o, --overwrite           if files already exists, overwrite it
-n, --newId               if the collection id does not exist, creates a new collection
```
