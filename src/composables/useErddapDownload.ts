import { Ref, computed } from "vue";

import { Coordinate, Variable } from "../utils/erddap";

interface DownloadParams {
  variables: Ref<Variable[]>;
  coordinates: Ref<Coordinate[]>;
  fileFormat: Ref<string>;
  datasetId: string;
  startDate?: Ref<string>;
  endDate?: Ref<string>;
}

export function useErddapDownload({
  datasetId,
  variables,
  coordinates,
  fileFormat,
  startDate,
  endDate,
}: DownloadParams) {
  const FILE_FORMATS = [
    "htmlTable",
    "csv",
    "json",
    "nc",
    "geoJson",
    "mat",
    "xhtml",
    "graph",
    "tsv",
    "html",
    "dataTable",
  ];
  const ERDDAP_BASE_URL = "https://pricaimcit.services.brown.edu/erddap";

  const downloadUrl = computed(() => {
    const ids = coordinates.value.map((c) => c.buoyId).join("|");
    return `${ERDDAP_BASE_URL}/tabledap/${datasetId}.${
      fileFormat.value
    }?${variables.value
      .map((v) => v.name)
      .join(
        ","
      )},time,latitude,longitude,station_name&station_name=~"(${ids})"${
      startDate?.value ? "&time>=" + startDate.value : ""
    }${endDate?.value ? "&time<=" + endDate.value : ""}`;
  });

  return {
    FILE_FORMATS,
    downloadUrl,
  };
}
