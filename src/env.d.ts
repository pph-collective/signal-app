/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Cluster {
  cluster_id: number;
  name: string;
}

interface Barrier {
  cluster_id: number;
  pct_w_no_vehicle: number;
  pct_w_no_insurance: number;
  pct_w_no_internet: number;
  pct_w_no_english: number;
}

interface Geo {
  properties: {
    cluster_id: number;
  };
}

interface Stat {
  cluster_id: number;
  name: string;
  expected_total: number;
  population_total: number;
}

interface FocusStat {
  name: string;
  value: "total" | "white" | "black" | "latino" | "asian";
}

// TODO: what other fields go here?
interface Location {
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  longitude: number;
  latitude: number;
}
