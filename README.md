# [SIGNAL](https://signal-ri.org/)

## About
All Rhode Islanders have the right to live a healthy and happy life. We all need resources to help us and our families 
thrive at home, work, or school. But we don't all get these same opportunities because of where we live. This means that
some communities are affected by COVID-19 more than others.

At Project SIGNAL, we use data to show how COVID-19 has impacted the hardest-hit neighborhoods. We make this data 
available to support policies that protect the most vulnerable Rhode Islanders.

## Technical Details

This is a web-based project built on the [Vue Framework](https://vuejs.org/), a progressive javascript framework. It is
hosted on [Firebase](https://firebase.google.com/), Google's mobile and web app development platform. It uses 
[Firestore](https://firebase.google.com/docs/firestore), a flexible and scalable NoSQL cloud database build on Google
Cloud infrastructure, to store and sync data.

We use [Mapbox](https://www.mapbox.com/), customizable maps, along side [Vega](https://vega.github.io/vega/), a 
visualization grammar, to visualize data on our dashboard maps.

## Getting Started with SIGNAL

:exclamation: For in depth details on project set up, navigate to the `README.md` in the `scripts` folder.

### Requirements

Node version: 18+

For the map to work, you'll need a `.env` file in your project root directory with the following key for a 
[mapbox access token](https://docs.mapbox.com/help/getting-started/access-tokens/).

```
VITE_MAPBOX_ACCESS_TOKEN=
```

### Installation

```bash
# install dependencies
$ npm install
```

### Compiles and hot-reloads for development
```bash
# serve with hot reload at localhost:5173
$ npm run dev
```

### Linting
```bash
$ npm run lint # report and fix linting errors
```

### build for production and launch server
```bash
$ npm run build
$ npm run serve
```

### Admin Setup

In order to upload data, see the `README.md` file in the `scripts` folder for more detailed instructions on setup and 
required scripts.
