<template>
  <DashboardCard width="full">
    <template #subtitle>
      <div class="content">
        <p>
          Did you know where a person lives can impact their chance of getting
          very sick from COVID-19? Rhode Islanders who live in low-income
          housing have a higher chance of going to the hospital with COVID-19.
          These chances are especially high for older adults. Use this page to
          explore how housing affects COVID-19 outcomes in Rhode Island.
        </p>
        <h5>What kinds of housing exist in Rhode Island?</h5>
        <div class="table-container m-auto">
          <table class="table is-narrow is-bordered">
            <tbody>
              <tr>
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
                  Similar purpose to public housing, but housing is privately
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
                  college dormitories, correctional facilities, etc.)
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
        :drop-downs="dropDown"
        :init-value="caseControls"
        @selected="updateCaseControls"
      />
      <div>
        {{
          caseControls.age.value === "adjusted"
            ? text.age.adjusted
            : text.age.specific
        }}
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
        :legend-title="'Housing Type'"
      />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <ControlPanel
        :drop-downs="dropDown"
        :init-value="hospControls"
        @selected="updateHospControls"
      />
      <div>
        {{
          hospControls.age.value === "adjusted"
            ? text.age.adjusted
            : text.age.specific
        }}
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #title>
      COVID-19 hospitalizations may be influenced by housing type
    </template>
    <template #content>
      <!-- add in outcomeData properly below -->
      <DataSpotlight
        :metric="hospFocus"
        :age="hospControls.age"
        :data="data"
        :text="text"
        :legend-title="'Housing Type'"
      />
    </template>
  </DashboardCard>
  <DashboardCard>
    <template #title
      >What can I do to reduce the spread of COVID-19 in homes?</template
    >
    <template #content>
      <div class="content px-4">
        <h5>Learn more about creating healthy and affordable housing</h5>
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
              >ways to improve ventilation in their buildings</ExternalLink
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
          Make sure people know where to get help when isolating with COVID-19
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
            <a href="tel:4012228022"
              >(401) 222-8022 <i class="fas fa-solid fa-phone"></i
            ></a>
            for help with housing, food, and more.
          </li>
        </ul>
        <h5>
          Make sure people know where to get COVID-19 vaccines, tests, and
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
      "<p>For hospitalizations, rates were <strong>higher among residents of Section VIII housing</strong>. Residents of this type of housing were more likely to go to the hospital with COVID-19.</p>",
    specific:
      "<p>People of all ages have gone to the hospital with COVID-19. <strong>Older adults were more likely</strong> to go to the hospital with COVID-19. Older adults in <strong>Section VIII</strong> housing were the most likely to go to the hospital.</p>",
  },
  cases: {
    adjusted:
      "<p>For cases, rates were <strong>similar across all housing types</strong> in Rhode Island. This means that people were getting sick with COVID-19 regardless of where they were living.",
    specific:
      "<p>COVID-19 case rates were <strong>higher in younger adults</strong>. Younger adults in <strong>non-congregate</strong> and <strong>public</strong> housing had higher rates of COVID-19 than those who lived in Section VIII housing.</p><br><p>COVID-19 case rates were <strong>lower in older adults</strong>. Older adults in <strong>Section VIII housing</strong> had higher rates of COVID-19 than those who lived in other types of housing.</p>",
  },
  age: {
    adjusted:
      "What is an age-adjusted rate? Age plays a big role in a person's risk for COVID-19. Different groups of people have different age distributions - meaning one group may have more old people, or one group may have more young people. Age adjusting makes it so we can compare between groups that have different age distributions.",
    specific:
      "Rates tell us how many people have tested positive for COVID-19 compared to a larger group taking into account the population size of that group.",
  },
};

const data = await fetchSpotlightData(props.datasetName);

const dropDown = {
  age: {
    icon: "fas fa-poll",
    label: "What measure do you want to look at?",
    values: [
      { name: "Age Adjusted Rates", value: "adjusted" },
      { name: "Rate by Age", value: "specific" },
    ],
  },
};

const caseFocus = { name: "Cases", value: "cases" };
const hospFocus = { name: "Hospitalizations", value: "hospitalizations" };

const caseControls = ref({
  age: dropDown.age.values[0],
});
const hospControls = ref({
  age: dropDown.age.values[0],
});

useQueryParam({
  param: "caseage",
  ref: caseControls,
  refField: "age",
  valid: (p) => dropDown.age.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) => dropDown.age.values.find((v) => p === v.value),
});

useQueryParam({
  param: "hospage",
  ref: hospControls,
  refField: "age",
  valid: (p) => dropDown.age.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) => dropDown.age.values.find((v) => p === v.value),
});

const updateHospControls = (newControls) => {
  for (const [k, v] of Object.entries(newControls)) {
    hospControls.value[k] = v;
  }
};

const updateCaseControls = (newControls) => {
  for (const [k, v] of Object.entries(newControls)) {
    caseControls.value[k] = v;
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
