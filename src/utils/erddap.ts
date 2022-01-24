import axios from "axios";

const erddapAxios = axios.create({
  baseURL:
    (import.meta.env.VITE_RIDDC_API_BASEURL as string | false) ||
    "https://api.riddc.brown.edu/erddap",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const erddapGet = async (path: string) => {
  const response = await erddapAxios.get(path);
  if (response.status !== 200) {
    throw new Error(`Error fetching data from ERDDAP: ${path}`);
  }

  return response.data;
};

export interface Data {
  variable: string;
  value: number;
  station_name: string;
  time: string;
  units: string | null;
}

export interface Dataset {
  data: Data[];
  downsampled: boolean;
}

export interface Coordinate {
  station_name: string;
  buoyId: string;
  fullName: string;
  latitude: number;
  longitude: number;
}

interface SummaryStatic {
  station_name: string;
  time: string;
  date: Date;
}

interface SummaryDynamic {
  [key: string]: number;
}

export type Summary = SummaryStatic & SummaryDynamic;

export interface Variable {
  name: string;
  units: string | null;
}
