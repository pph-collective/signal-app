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
  pct_w_no_vehicle: number;
  pct_w_no_insurance: number;
  pct_w_no_internet: number;
  pct_w_no_english: number;
  pct_over_60: number;
  pct_w_no_insurance: number;
}

interface ClusterBarrier extends Barrier {
  cluster_id: number;
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

interface SpotlightFocus {
  name: string;
  value: "adjusted" | "specific";
}

interface SpotlightStat {
  category: string;
  age_adjusted_rate: number;
  outcome_type: string;
}

interface AgeSpecificStat {
  category: string;
  hud_age_group: string;
  age_specific_rate: number;
  outcome_type: string;
  age_lower_bound: number;
}

interface SpotlightStats {
  age_adjusted: SpotlightStat[];
  age_specific: AgeSpecificStat[];
}

interface Location {
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  longitude: number;
  latitude: number;
}

interface SpotlightText {
  cases: AgeText;
  hospitalizations: AgeText;
}

interface AgeText {
  adjusted: Paragraphs;
  specific: Paragraphs;
}

interface Paragraphs {
  p1?: string;
  p2?: string;
  [propName: string]: string;
}
