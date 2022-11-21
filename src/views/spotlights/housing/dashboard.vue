<template>
  <DashboardCard width="full">
    <template #subtitle>
      <div class="content">
        <p>
          You can use this page to explore how housing affects COVID-19 outcomes
          in Rhode Island. Where someone lives impacts their chances of getting
          very sick with COVID-19. We found that people who lived in low-income
          housing had a high chance of going to the hospital with COVID-19. We
          also saw that these rates were especially high for older adults.
        </p>
        <div class="table-container m-auto">
          <table class="table is-narrow is-bordered">
            <tbody>
              <tr>
                <!-- <tr bgcolor="#C7B3F9"> -->
                <th>Housing type</th>
                <th>What that means</th>
                <th>Examples</th>
              </tr>
              <tr>
                <td>Public</td>
                <td>
                  Managed by government agencies to provide housing for low
                  income individuals and families
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Section VIII</td>
                <td>
                  Similar purpose to public housing, but housing is privately
                  owned/operated and subsidized through government spending
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Congregate
                  <p style="font-size: 1rem">
                    <em>*not included in this analysis</em>
                  </p>
                </td>
                <td>
                  Individuals typically not related to each other living in
                  close proximity and/or sharing living facilities
                </td>
                <td>
                  Assisted living, nursing home, group home, college/university
                  campus, or correctional facility
                </td>
              </tr>
              <tr>
                <td style="white-space: pre">Non-Congregate</td>
                <td>Privately owned or rented residence</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <ControlPanel
        :drop-downs="caseDropDown"
        :init-value="caseControls"
        @selected="updateCaseControls"
      />
      <div :class="{ invisible: caseControls.age.value === 'specific' }">
        What is an age-adjusted rate? Age plays a big role in a person's risk
        for COVID-19. Different groups of people have different age
        distributions - meaning one group may have more old people, or one group
        may have more young people. Age adjusting makes it so we can compare
        between groups that have different age distributions.
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #title>COVID-19 Cases May Be Influenced By Housing</template>
    <template #content>
      <DataSpotlight
        :metric="caseFocus"
        :age="caseControls.age"
        :data="data"
        :text="text"
      />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <ControlPanel
        :drop-downs="dropDowns"
        :init-value="controls"
        @selected="updateControls"
      />
      <div :class="{ invisible: controls.age.value === 'specific' }">
        What is an age-adjusted rate? Age plays a big role in your risk for the
        virus. Different groups of people have different age distributions -
        meaning one group may have more old people, or one group may have more
        young people. Age adjusting makes it so we can compare between groups
        that have different age distributions.
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #title>
      COVID-19 {{ hospFocus.name }} May Depend on Housing</template
    >
    <template #content>
      <!-- add in outcomeData properly below -->
      <DataSpotlight
        :metric="hospFocus"
        :age="controls.age"
        :data="data"
        :text="text"
      />
    </template>
  </DashboardCard>
  <DashboardCard>
    <template #content>
      <div class="content">
        <h5>I can do something with housing:</h5>
        <ul>
          <li>
            Go to <ExternalLink href="https://google.com">Google</ExternalLink>
          </li>
        </ul>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DataSpotlight from "@/components/dashboard/DataSpotlight.vue";
import ControlPanel from "../../../components/dashboard/ControlPanel.vue";

import { useQueryParam } from "../../../composables/useQueryParam";
import { fetchSpotlightData } from "../../../utils/firebase";
import ExternalLink from "../../../components/base/ExternalLink.vue";

const props = defineProps<{
  datasetName: string;
}>();

const text = {
  hospitalizations: {
    adjusted: {
      p1: "For hospitalizations, rates were higher among residents of public and Section VIII housing. Residents of these types of housing were more likely to go to the hospital with COVID-19.",
    },
    specific: {
      p1: "People of all ages have gone to the hospital with COVID-19. Older adults were more likely to go to the hospital with COVID-19. Older adults in public and Section VIII housing were the most likely to go to the hospital.",
    },
  },
  cases: {
    adjusted: {
      p1: "For cases, rates were similar across all housing types in Rhode Island. This means that people were getting sick with COVID-19 regardless of where they were living.",
    },
    specific: {
      p1: "COVID-19  rates were higher in younger adults. Younger adults in non-congregate housing had higher rates of COVID-19 than those who lived in other types of housing.",
      p2: "COVID-19 rates were lower in older adults. Older adults in low-income housing had higher rates of COVID-19 than those who lived in other types of housing.",
    },
  },
};

const data = await fetchSpotlightData(props.datasetName);

const caseDropDown = {
  age: {
    icon: "fas fa-poll",
    label: "What measure do you want to look at?",
    values: [
      { name: "Age Adjusted Rates", value: "adjusted" },
      { name: "Rate By Age", value: "specific" },
    ],
  },
};

const caseFocus = { name: "Cases", value: "cases" };

const caseControls = ref({
  age: caseDropDown.age.values[0],
});

useQueryParam({
  param: "cases",
  ref: caseControls,
  refField: "age",
  valid: (p) => caseDropDown.age.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) => caseDropDown.age.values.find((v) => p === v.value),
});

const updateCaseControls = (newControls) => {
  for (const [k, v] of Object.entries(newControls)) {
    caseControls.value[k] = v;
  }
};

const dropDowns = {
  age: {
    icon: "fas fa-poll",
    label: "What measure do you want to look at?",
    values: [
      { name: "Age Adjusted Rates", value: "adjusted" },
      { name: "Rate By Age", value: "specific" },
    ],
  },
};

const hospFocus = { name: "Hospitalizations", value: "hospitalizations" };

const controls = ref({
  age: dropDowns.age.values[0],
});

useQueryParam({
  param: "age",
  ref: controls,
  refField: "age",
  valid: (p) => dropDowns.age.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) => dropDowns.age.values.find((v) => p === v.value),
});

const updateControls = (newControls) => {
  for (const [k, v] of Object.entries(newControls)) {
    controls.value[k] = v;
  }
};
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}

.invisible {
  visibility: hidden;
}
</style>
