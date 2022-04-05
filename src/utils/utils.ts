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
