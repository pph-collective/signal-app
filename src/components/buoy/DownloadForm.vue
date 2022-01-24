<template>
  <BaseForm>
    <template #inputs>
      <div class="control-item">
        <label for="file-format" class="label">File Format</label>
        <multiselect
          id="file-format"
          v-model="fileFormat"
          class="multiselect"
          :options="FILE_FORMATS"
          :preselect-first="true"
          :allow-empty="false"
        />
      </div>

      <div class="control-item">
        <label for="buoy-id" class="label">Buoys</label>
        <multiselect
          id="buoy-id"
          v-model="downloadBuoys"
          class="multiselect"
          :options="store.coordinates"
          :custom-label="formatCoordinate"
          track-by="station_name"
          :multiple="true"
        />
      </div>

      <div class="control-item">
        <label for="variable-select-download" class="label">Variables</label>
        <multiselect
          id="variable-select-download"
          v-model="downloadVariables"
          class="multiselect"
          :options="store.variables"
          :custom-label="formatVariable"
          track-by="name"
          :multiple="true"
        />
      </div>
    </template>

    <template #buttons>
      <a :href="downloadUrl"
        ><button
          class="button is-primary control-item-button"
          :disabled="
            downloadBuoys.length === 0 ||
            downloadVariables.length === 0 ||
            !fileFormat
          "
        >
          Download Data
        </button></a
      >
    </template>
  </BaseForm>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";

import Multiselect from "vue-multiselect";

import BaseForm from "@/components/base/BaseForm.vue";

import { formatVariable, formatCoordinate } from "../../utils/utils";
import { useErddapDownload } from "../../composables/useErddapDownload";
import { BuoyStore } from "../../store/buoy";

const store = inject("store") as BuoyStore;

const fileFormat = ref("json");
const downloadBuoys = ref([]);
const downloadVariables = ref([]);

const { FILE_FORMATS, downloadUrl } = useErddapDownload({
  datasetId: store.datasetId,
  variables: downloadVariables,
  coordinates: downloadBuoys,
  fileFormat,
});
</script>
