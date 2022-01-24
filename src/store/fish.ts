import { defineStore } from "pinia";

import { erddapGet } from "../utils/erddap";
import { useColorMap } from "./colorMap";

type StationName = "Fox Island" | "Whale Rock";

interface Coordinate {
  station_name: StationName;
  latitude: number;
  longitude: number;
}

interface Sample {
  species: string;
  title: string;
  station: StationName;
  year: number;
  abun: number;
  animal?: string;
}

interface Temperature {
  Station: StationName;
  year_month: string;
  level: "Surface" | "Bottom";
  month: number;
  mean_temp: number;
  monthly_mean: number;
  delta: number;
}

export interface Info {
  href?: string;
  name?: string;
  sciName?: string;
  photoUrl?: string;
  sectionData?: {
    Classification?: {
      Classification?: string;
    };
    IUCN?: string;
  };
}

interface State {
  name: string;
  route: string;
  coordinates: Coordinate[];
  samples: Sample[];
  temps: Temperature[];
}

export const useFishStore = defineStore("fish", {
  state: (): State => {
    return {
      name: "fish",
      route: "fish",
      coordinates: [],
      samples: [],
      temps: [],
    };
  },
  actions: {
    async fetchCoordinates() {
      this.coordinates = (await erddapGet("/fish/coordinates")) as Coordinate[];
      const colorMap = useColorMap();
      colorMap.update({ ids: this.stations, unique: false });
    },
    async fetchSamples() {
      const samples = (await erddapGet("/fish/species")) as Sample[];

      this.samples = samples.map((d) => {
        if (d.species.includes("crab")) {
          d.animal = "crab";
        } else if (d.species.toLowerCase().includes("lobster")) {
          d.animal = "lobster";
        } else if (d.species.toLowerCase().includes("squid")) {
          d.animal = "squid";
        } else if (d.species.toLowerCase().includes("sea_star")) {
          d.animal = "starfish";
        } else {
          d.animal = "fish";
        }
        return d;
      });
    },
    async fetchTemps() {
      this.temps = await erddapGet("/fish/temps");
    },
    async fetchInfo(species: string) {
      return (await erddapGet(`/fish/info/${species}`)) as Info;
    },
    async fetchBaseData(): Promise<void> {
      if (this.coordinates.length === 0) {
        await Promise.all([
          this.fetchCoordinates(),
          this.fetchSamples(),
          this.fetchTemps(),
        ]);
      }
    },
  },
  getters: {
    stations(): string[] {
      return this.coordinates.map(({ station_name }) => station_name).sort();
    },
    species(): string[] {
      // unique species in alphabetical order
      return this.samples
        .map(({ title }) => title)
        .sort()
        .filter((v, i, a) => a.indexOf(v) === i);
    },
  },
});

export type FishStore = ReturnType<typeof useFishStore>;
