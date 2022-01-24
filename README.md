# [Narragansett Bay Data Explorer](https://data-explorer.riddc.brown.edu)

[![DOI](https://zenodo.org/badge/271652303.svg)](https://zenodo.org/badge/latestdoi/271652303)

> Explore data from the [RI Data Discovery Center](https://ridatadiscovery.org) about the Narragansett Bay.

A web app to explore data about the Narragansett bay.  Built using Vue 3 + Typescript.  Uses the buoy-api as a backend.

## Build Setup

For the map in the domoic acid page to work, you'll need a .env file with the following keys:
```
VITE_MAPBOX_ACCESS_TOKEN=
```
The mapbox token can be found by logging in as ccv-bot on mapbox (credentials in lastpass).

Node version: 14+

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev # connect to production api
$ npm run dev:local # connect to locally running api

# linting
$ npm run lint # report and fix linting errors
$ npm run tscheck # check for type errors

# build for production and launch server
$ npm run build
$ npm run serve
```

## Recommended IDE Setup (very optional)

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
