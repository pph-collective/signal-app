<template>
  <DashboardCard width="full">
    <template #title>Exploration Map</template>
    <template #content>
      <div class="map-app-container">
        <DataCard />
        <BuoyMap />
        <DateSlider />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="full">
    <template #title>About</template>
    <template #subtitle
      >This map on domoic acid concentrations in Narragansett Bay (NB) was
      generated from a research project carried out at the University of Rhode
      Island by Co- Principal Investigators Drs. Matthew Bertin and Bethany
      Jenkins and their research teams. This work was funded by Rhode Island Sea
      Grant and the Rhode Island Consortium for Coastal Ecology Assessment,
      Innovation, and Modeling (RI C-AIM).</template
    >
    <template #content>
      <div class="content columns pl-2 mx-0">
        <div class="column pl-2">
          <h3>Background</h3>
          <p>
            The project monitored species of the diatom
            <i>Pseudo-nitzschia (P-n)</i> and their production of the neurotoxin
            domoic acid at selected sites in NB, Rhode Island. While
            <i>P-n</i> species have been present in NB for over 50 years, the
            first Rhode Island shellfish harvest closure due to high levels of
            domoic acid in the plankton was not until October 2016. This
            precautionary closure, another subsequent closure in March 2017 due
            to domoic acid exceeding action limits in shellfish meat, and the
            continued detection of low levels of domoic acid suggests that
            either <i>P-n</i> species composition has changed to new toxic-
            producing strains of <i>P-n</i> in NB, or NB environmental
            conditions have shifted in favor of making resident <i>P-n</i> more
            toxic. The 2016 and 2017 closures sparked interest in identifying
            environmental drivers that lead to increased domoic acid production
            as well as identifying <i>P-n</i> species composition in NB.
          </p>

          <h3>Methods</h3>
          <p>
            Over a two-year period from September 2017 – November 2019, our
            research group has sampled NB weekly, collecting samples to measure
            various environmental factors such as dissolved nutrients,
            chlorophyll a, temperature, and salinity from the surface seawater.
            Additionally, we have monitored <i>P-n</i> species (through genetic
            analysis of DNA sequences), and the cell-associated domoic acid from
            phytoplankton samples using liquid chromatography-tandem mass
            spectrometry (LC- MS/MS). Our genetic methods can distinguish
            between <i>P-n</i> species and our analytical methods are very
            sensitive and can detect very low levels of domoic acid (ng domoic
            acid/L of seawater).
          </p>
        </div>

        <div class="column">
          <h3>Results</h3>
          <p>
            We have found seasonal differences in <i>P-n</i> species in NB and
            we have found a seasonal pattern in increased cell-associated domoic
            acid concentrations. All toxin concentrations are at low levels, and
            no closures occurred during the sampling period. Cell-associated
            domoic acid rises in the fall (September and October) and the late
            spring/early summer (May and June), and highest concentrations were
            observed at the sites closest to the entrance of NB. We hypothesize
            that these seasonally distinct
            <i>P-n</i>
            communities are responsible for low-level domoic acid production
            which likely contributed to the 2016 precautionary closure, while it
            appears a species new to NB, Pseudo-nitzschia australis, likely
            contributed to the 2017 closure.
            <strong
              >This map shows how cell-associated domoic acid increases and
              decreases over the sampling period. Sampling sites are shown with
              the concentration of domoic acid recorded on specific
              dates.</strong
            >
          </p>

          <h3>Impact</h3>
          <p>
            We hope this information will aid Rhode Island stakeholders by
            providing data following the 2016 and 2017 closures on when, where,
            and what concentration of low- level cell-associated domoic acid is
            present. This is important as domoic acid can bioaccumulate in
            shellfish and cause illness in humans when consumed. While cooking
            does not destroy the toxin, live shellfish can naturally purge the
            toxin with time and become safe for consumption later. These domoic
            acid measurements and
            <i>P-n</i> species composition provide baseline data during a period
            of no closures for important context if additional closures were to
            occur in the future.
          </p>
        </div>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="half">
    <template #title>Acknowledgments</template>
    <template #content>
      <div class="content px-4">
        <p>
          Thanks to Dr. Tatiana Rynearson, Jacob Strock, Jessica Carney, Nina
          Santos, Captain Stephen Barber on the R/V <i>Cap’n Bert</i>, Dr.
          Harold “Bud” Vincent II on the R/V <i>Hope Hudner</i>, and Steve
          Granger on the R/V <i>Zostera</i> for assistance with sampling.
        </p>
        <br />
        <p>
          We thank graduate and undergraduate researchers and other research
          personnel Alexa Sterling, Riley Kirk, Katherine Bell, Dr. Laura
          Holland, Marissa Caponi, Meagan King, Emily McDermith, Erin Tully,
          Samantha Vaverka, Patrick Wilson, Stephanie Anderson, and Jorge
          Vazquez-Custodio for sampling assistance.
        </p>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="half" :height="1">
    <template #title>Learn More</template>
    <template #content>
      <div class="content px-4">
        <p>
          The full dataset used to power this app is available on
          <a
            href="https://pricaimcit.services.brown.edu/erddap/tabledap/da_4566_36f0_124a.html"
            >ERDDAP</a
          >. If using this data, please cite the ERDDAP dataset.
        </p>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/base/DashboardCard.vue";
import DataCard from "@/components/da/DataCard.vue";
import DateSlider from "@/components/da/DateSlider.vue";
import BuoyMap from "@/components/da/BuoyMap.vue";

import { useDAStore } from "../../../store/domoic-acid";
const store = useDAStore();
await store.fetchBaseData();
</script>

<style scoped>
.map-app-container {
  position: relative;
}
</style>
