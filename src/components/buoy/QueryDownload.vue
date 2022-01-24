<template>
  <DashboardCard width="one-third" :height="2">
    <template #title>Download Selected Data</template>
    <template #subtitle>
      Selected data includes
      {{ variables.map(formatVariable).join(", ") }} from
      {{ startDate.slice(0, 10) }} to {{ endDate.slice(0, 10) }}
    </template>
    <template #content>
      <BaseForm>
        <template #inputs>
          <div class="control-item">
            <label for="file-format" class="label">File format</label>
            <multiselect
              id="file-format"
              v-model="fileFormat"
              class="multiselect"
              :options="FILE_FORMATS"
            />
          </div>
        </template>

        <template #buttons>
          <a
            role="button"
            class="button is-primary control-item-button mr-2 my-2"
            :href="downloadUrl"
            >Download Data</a
          >
        </template>
      </BaseForm>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { inject, ref, toRefs } from "vue";
import Multiselect from "vue-multiselect";

import DashboardCard from "@/components/base/DashboardCard.vue";
import BaseForm from "@/components/base/BaseForm.vue";

import { formatVariable } from "../../utils/utils";
import { Variable, Coordinate } from "../../utils/erddap";
import { useErddapDownload } from "../../composables/useErddapDownload";

import { BuoyStore } from "../../store/buoy";
const store = inject("store") as BuoyStore;

const props = defineProps<{
  variables: Variable[];
  coordinates: Coordinate[];
  startDate: string;
  endDate: string;
}>();

const { coordinates, variables, startDate, endDate } = toRefs(props);

const fileFormat = ref("json");

const { FILE_FORMATS, downloadUrl } = useErddapDownload({
  datasetId: store.datasetId,
  coordinates,
  variables,
  startDate,
  endDate,
  fileFormat,
});
</script>
