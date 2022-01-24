<template>
  <BaseForm>
    <template #inputs>
      <div class="control-item">
        <label for="species-select" class="label">Select Species</label>
        <multiselect
          id="species-select"
          v-model="selectedSpecies"
          class="multiselect"
          :options="store.species"
        ></multiselect>
      </div>
    </template>
    <template #buttons>
      <router-link
        class="button is-primary"
        :to="`/dataset/fish/dashboard?species=${selectedSpecies}`"
        >Explore</router-link
      >
    </template>
  </BaseForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Multiselect from "vue-multiselect";

import BaseForm from "@/components/base/BaseForm.vue";

const selectedSpecies = ref("");

import { useFishStore } from "../../store/fish";
const store = useFishStore();
</script>
