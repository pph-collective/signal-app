<template>
  <div class="is-flex-column">
    <div class="control-item control-item-first">
      <label for="variable" class="label">Variable</label>
      <multiselect
        id="variable"
        v-model="variable"
        class="multiselect"
        :options="variables"
        :custom-label="formatVariable"
        track-by="name"
      />
    </div>
    <HeatMap
      v-if="!(summary.length === 0)"
      id="heatmap"
      :dataset="summary"
      :min-width="400"
      :height="250"
      x="date"
      y="station_name"
      :variable="variable.name"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Multiselect from "vue-multiselect";

import HeatMap from "@/components/charts/HeatMap.vue";

import { formatVariable } from "../../utils/utils";
import { Summary, Variable } from "../../utils/erddap";

const props = defineProps<{
  summary: Summary[];
  variables: Variable[];
}>();

const variable = ref(
  props.variables[0] ?? { name: "WaterTempSurface", units: "°C" }
);
</script>
