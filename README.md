# SIGNAL

A dashboard for COVID-19 data in RI

## Project Setup

Node version: 16+

```bash
# install dependencies
$ npm install
```

### Compiles and hot-reloads for development
```bash
# serve with hot reload at localhost:3000
$ npm run dev
```

### Linting
```bash
$ npm run lint # report and fix linting errors
$ npm run tscheck # check for type errors
```

### build for production and launch server
```bash
$ npm run build
$ npm run serve
```

### Admin Setup

*Needed to upload files*

#### Set up Firebase
```
$ firebase login
```

#### Create a Service Account

1. Navigate to the Firebase console to generate a private key (Settings > Service Accounts).
2. Click **Generate New Private Key** and save the JSON file as `serviceAccount.json`
3. Add that JSON file to the project root directory. This file is listed in the `.gitignore`. Do not share this private key.

## Recommended IDE Setup (very optional)

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
