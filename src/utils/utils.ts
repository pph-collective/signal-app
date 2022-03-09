import * as topology from "topojson-server";
import * as tc from "topojson-client";
import * as ts from "topojson-simplify";
const topojson = { ...ts, ...tc };

export const formatVariable = ({
  name,
  units,
}: {
  name: string;
  units: string;
}) => {
  if (units) {
    return `${name} (${units})`;
  } else {
    return name;
  }
};

export const formatCoordinate = ({
  station_name,
  buoyId,
}: {
  station_name: string;
  buoyId: string;
}) => {
  return `${station_name} (${buoyId})`;
};

export const localISODate = (d: Date) => new Date(d).toLocaleDateString("sv");
export const localISODateToUTC = (d: string) =>
  new Date(
    parseInt(d.slice(0, 4)),
    parseInt(d.slice(5, 7)) - 1,
    parseInt(d.slice(8, 10))
  );

export const geoToTopo = (features, sphericalArea = undefined) => {
  const collection = {
    blocks: { type: "FeatureCollection", features },
  };

  let topo = topology.topology(collection);

  if (sphericalArea) {
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
  }

  return topo;
};
