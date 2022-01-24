import { defineStore } from "pinia";

import {
  erddapGet,
  Summary,
  Variable,
  Coordinate,
  Dataset,
} from "../utils/erddap";

import { useColorMap } from "./colorMap";
import { localISODate } from "../utils/utils";

const MODEL_LINEWIDTH = 0.8;
const MEASUREMENT_LINEWIDTH = 1.8;

const CONFIG = {
  "ri-buoy": {
    name: "ri-buoy",
    route: "buoy",
    datasetId: "combined_e784_bee5_492e",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Historical",
  },
  osom: {
    name: "osom",
    route: "model",
    datasetId: "model_data_77bb_15c2_6ab3",
    lineWidth: MODEL_LINEWIDTH,
    title: "OSOM",
  },
  "ma-buoy": {
    name: "ma-buoy",
    route: "mabuoy",
    datasetId: "ma_buoy_data_a6c9_12eb_1ec5",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Historical",
  },
  plankton: {
    name: "plankton",
    route: "plankton",
    datasetId: "plankton_time_series_7615_c513_ef8e",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Plankton",
  },
};

interface BuoyConfig {
  name: string;
  route: string;
  datasetId: string;
  lineWidth: number;
  title: string;
}

interface BuoyState extends BuoyConfig {
  coordinates: Coordinate[];
  summary: Summary[];
  variables: Variable[];
  minDate: string;
  maxDate: string;
}

const createStore = (config: BuoyConfig) => {
  const route = config.route;
  const name = config.name;
  return defineStore(name, {
    state: (): BuoyState => {
      return {
        ...config,
        coordinates: [],
        summary: [],
        variables: [],
        minDate: localISODate(new Date(0)),
        maxDate: localISODate(new Date()),
      };
    },
    actions: {
      // fetch the summary for the heatmaps
      async fetchSummaryData() {
        // assign to intermediate variable for performance while updating date/time data
        const summary = await erddapGet(`/${route}/summary`);
        let minDate = new Date();
        let maxDate = new Date(0);
        summary.map((d) => {
          d.date = new Date(d.time);
          if (d.date < minDate) {
            minDate = d.date;
          }
          if (d.date > maxDate) {
            maxDate = d.date;
          }
          return d;
        });
        this.summary = summary;
        this.minDate = localISODate(minDate);
        this.maxDate = localISODate(maxDate);
      },

      // just fetch data, don't save anything
      async fetchBuoyData({ ids, variables, start, end }): Promise<Dataset> {
        const startDate = start || this.minDate;
        const endDate = end || this.maxDate;
        return await erddapGet(
          `/${route}/query?ids=${ids}&variables=${variables}&start=${startDate}&end=${endDate}`
        );
      },

      // fetch all of the buoy coordinates
      async fetchBuoyCoordinates() {
        const coordinates = await erddapGet(`/${route}/coordinates`);
        coordinates.forEach((c) => {
          c.fullName = `${c.station_name} (${c.buoyId})`;
        });
        this.coordinates = coordinates;
        const colorMap = useColorMap();
        colorMap.update({ ids: coordinates.map((v) => v.station_name) });
      },

      // fetch all of the buoy variables
      async fetchBuoyVariables(): Promise<void> {
        const variables = await erddapGet(`/${route}/variables`);
        variables.sort((a, b) =>
          a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
        );
        this.variables = variables;
      },

      // fetch the base data in one call if not already loaded
      async fetchBaseData(): Promise<void> {
        if (this.summary.length === 0) {
          await Promise.all([
            this.fetchSummaryData(),
            this.fetchBuoyCoordinates(),
            this.fetchBuoyVariables(),
          ]);
        }
      },
    },
  });
};

export type BuoyStore = ReturnType<ReturnType<typeof createStore>>;

export const buoyStores = {
  "ri-buoy": { useStore: createStore(CONFIG["ri-buoy"]) },
  "ma-buoy": { useStore: createStore(CONFIG["ma-buoy"]) },
  osom: { useStore: createStore(CONFIG["osom"]) },
  plankton: { useStore: createStore(CONFIG["plankton"]) },
};
