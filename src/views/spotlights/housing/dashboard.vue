<template>
  <DashboardCard width="full">
    <template #subtitle>
      <div class="content">
        <p>
          You can use this page to explore how housing affects COVID-19 outcomes
          in Rhode Island. Where someone lives impacts their chances of getting
          very sick with COVID-19. We found that people who lived in low-income
          housing had a high chance of going to the hospital with COVID-19. We
          also saw that these chances were especially high for older adults.
        </p>
        <h5>What kinds of housing exist in Rhode Island?</h5>
        <div class="table-container m-auto">
          <table class="table is-narrow is-bordered">
            <tbody>
              <tr>
                <!-- <tr bgcolor="#C7B3F9"> -->
                <th>Housing type</th>
                <th>What it is</th>
              </tr>
              <tr>
                <td>Public</td>
                <td>
                  Managed by government agencies to provide housing for low
                  income individuals and families
                </td>
              </tr>
              <tr>
                <td>Section VIII</td>
                <td>
                  Similar purpose as public housing, but housing is privately
                  owned and subsidized through government spending
                </td>
              </tr>

              <tr>
                <td style="white-space: pre">Non-Congregate</td>
                <td>
                  Privately owned or rented residence that is not subsidized
                  through government spending
                </td>
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
                  close proximity and/or sharing living facilities (e.g.,
                  assisted living residences, nursing homes, group homes,
                  college dormitories, correctional facilities)
                </td>
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
      <div v-if="caseControls.age.value === 'adjusted'">
        What is an age-adjusted rate? Age plays a big role in a person's risk
        for COVID-19. Different groups of people have different age
        distributions - meaning one group may have more old people, or one group
        may have more young people. Age adjusting makes it so we can compare
        between groups that have different age distributions.
      </div>
      <!-- TODO make these be the same size -->
      <div v-else-if="caseControls.age.value === 'specific'">
        Rates tell us how many people have tested positive for COVID-19 compared
        to a larger group taking into account the population size of that group.
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #title>COVID-19 cases may be influenced by housing type</template>
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
      <div v-if="controls.age.value === 'adjusted'">
        What is an age-adjusted rate? Age plays a big role in your risk for the
        virus. Different groups of people have different age distributions -
        meaning one group may have more old people, or one group may have more
        young people. Age adjusting makes it so we can compare between groups
        that have different age distributions.
      </div>
      <div v-else-if="caseControls.age.value === 'specific'">
        Rates tell us how many people have tested positive for COVID-19 compared
        to a larger group taking into account the population size of that group.
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #title> COVID-19 hospitalizations may depend on housing</template>
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
    <template #title
      >What can I do to reduce the spread of COVID-19 in homes?</template
    >
    <template #content>
      <div class="content">
        <ul>
          <li>
            Learn more about
            <ExternalLink
              href="https://nlihc.org/housing-needs-by-state/rhode-island"
              >needs for affordable housing</ExternalLink
            >
            in our state.
          </li>
          <li>
            Connect with
            <ExternalLink href="https://www.rihousing.com/"
              >Rhode Island Housing</ExternalLink
            >
            to help renters find affordable housing.
          </li>
          <li>
            Help tenants learn more about their
            <ExternalLink
              href="https://www.hud.gov/states/rhode_island/renting/tenantrights"
            >
              rights and responsibilities as renters</ExternalLink
            >.
          </li>
          <li>
            Help property owners learn more about
            <ExternalLink
              href="https://covid.ri.gov/covid-19-prevention/indoor-air-circulation"
              >learn more about ways to improve ventilation in their
              buildings</ExternalLink
            >.
          </li>
          <li>
            Encourage
            <ExternalLink href="https://covid.ri.gov/prevent/wearing-masks"
              >mask wearing</ExternalLink
            >.
          </li>
        </ul>
        <h5>
          I can make sure people know where to get help when isolating with
          COVID-19
        </h5>
        <ul>
          <li>
            Share
            <ExternalLink
              href="https://www.cdc.gov/coronavirus/2019-ncov/your-health/isolation.html?CDC_AA_refVal=https%3A%2F%2Fwww.cdc.gov%2Fcoronavirus%2F2019-ncov%2Fyour-health%2Fquarantine-isolation.html"
              >this calculator</ExternalLink
            >
            to figure out when to start and stop isolating with COVID-19.
          </li>
          <li>
            Get help with food delivery when isolating with COVID-19 from
            <ExternalLink href="https://ridelivers.ri.gov/"
              >RI Delivers</ExternalLink
            >.
          </li>
          <li>
            Call the RIDOH COVID-19 Hotline at
            <a href="tel:4012228022">(401) 222-8022</a> for help with housing,
            food, and more.
          </li>
        </ul>
        <h5>
          I can make sure people know where to get COVID-19 vaccines, tests, and
          treatments
        </h5>
        <ul>
          <li>
            Find out where people can
            <ExternalLink href="https://www.vaccines.gov/"
              >get a COVID-19 vaccine</ExternalLink
            >
            near them.
          </li>
          <li>
            Find out where people can
            <ExternalLink
              href="https://www.covid.gov/tests?fbclid=IwAR0eg7UQc7sc1fGjLZzTT2nSBODCyydqHh-tdK7QJEWXMTcy0q8Bp3SOuC8"
              >get tested for COVID-19</ExternalLink
            >
            near them.
          </li>
          <li>
            Find out where people can
            <ExternalLink
              href="https://covid-19-test-to-treat-locator-dhhs.hub.arcgis.com/"
              >get COVID-19 treatment</ExternalLink
            >
            near them.
          </li>
        </ul>
      </div>
    </template>
  </DashboardCard>
  <DashboardCard>
    <template #content>
      <p class="is-size-7">
        This web tool includes information about COVID-19 cases (reported from
        March 2020 to December 2021) and hospitalizations (reported from March
        2020 to August 2022) as reported to the Rhode Island Department of
        Health. Rhode Island residents with invalid or incomplete residential
        address information are excluded. Housing type was classified based on
        property owner information obtained from tax assessors' offices in Rhode
        Island's 39 cities and towns. Estimates of population size are sourced
        from the United States Census Bureau's
        <ExternalLink href="https://www.census.gov/programs-surveys/acs"
          >American Community Survey</ExternalLink
        >
        (2016-2020, 5-year estimates) and the United States Department of
        Housing and Urban Development's
        <ExternalLink
          href="https://www.hud.gov/program_offices/public_indian_housing/systems/pic/50058/rcr"
          >Resident Characteristics Report</ExternalLink
        >.
      </p>
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
    adjusted:
      "<p>For hospitalizations, rates were <strong>higher among residents of public and Section VIII housing</strong>. Residents of these types of housing were more likely to go to the hospital with COVID-19.</p>",
    specific:
      "<p>People of all ages have gone to the hospital with COVID-19. <strong>Older adults were more likely</strong> to go to the hospital with COVID-19. Older adults in public and Section VIII housing were the most likely to go to the hospital.</p>",
  },
  cases: {
    adjusted:
      "<p>For cases, rates were <strong>similar across all housing types</strong> in Rhode Island. This means that people were getting sick with COVID-19 regardless of where they were living.",
    specific:
      "<p>COVID-19 case rates were <strong>higher in younger adults</strong>. Younger adults in non-congregate housing had higher rates of COVID-19 than those who lived in other types of housing.</p><br><p>COVID-19 case rates were <strong>lower in older adults</strong>. Older adults in low-income housing had higher rates of COVID-19 than those who lived in other types of housing.</p>",
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
