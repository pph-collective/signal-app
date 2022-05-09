import { format } from "d3-format";
import * as topology from "topojson-server";
import * as tc from "topojson-client";
import * as ts from "topojson-simplify";
const topojson = { ...ts, ...tc };

export const geoToTopo = (features, sphericalArea = 1e-9) => {
  const collection = {
    blocks: { type: "FeatureCollection", features },
  };

  let topo = topology.topology(collection, 1e5);

  // simplify/smooth out the geometry a bit
  topo = topojson.presimplify(topo, topojson.sphericalTriangleArea);
  topo = topojson.simplify(topo, sphericalArea);
  topo = topojson.filter(
    topo,
    topojson.filterAttachedWeight(
      topo,
      sphericalArea,
      topojson.sphericalRingArea
    )
  );

  return topo;
};

// 2022-03-15 => March 15, 2022
export const prettyDate = (date: string): string => {
  // Support for ISO 8601  differs in that date-only strings (e.g. "1970-01-01") are treated as UTC, not local.
  // This hack, sets the time to the start of the day such that we get back the day we specified in the yyyy-mm-dd
  // https://stackoverflow.com/questions/48351987/create-javascript-date-object-from-string-yyyy-mm-dd-in-local-timezone
  return new Date(`${date} 00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatPct = format(".0%");

export const sortByProperty = (property) => (a, b) => {
  let valA = a[property];
  let valB = b[property];

  // if strings, ignore upper and lowercase
  if (typeof valA === "string" && typeof valB === "string") {
    valA = valA.toUpperCase();
    valB = valB.toUpperCase();
  }

  if (valA < valB) {
    return -1;
  }
  if (valA > valB) {
    return 1;
  }

  // values must be equal
  return 0;
};
