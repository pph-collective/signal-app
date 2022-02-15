<template>
  <DashboardLayout>
    <DashboardCard>
      <template #title>Project Signal</template>
      <template #subtitle>
        <div class="content">
          <p>
            The National Science Foundation in 2017 awarded the University of
            Rhode Island with a grant to establish a statewide research
            consortium — the RI Consortium for Coastal Ecology Assessment,
            Innovation, and Modeling (RI C-AIM) — to study the effects of
            climate variability on coastal ecosystems. The RI Data Discovery
            Center is one of the efforts of RI C-AIM consortium. The goal of the
            RI Data Discovery Center is to become the national and international
            go-to-source for data on the Narragansett Bay ecosystem. For C-AIM
            investigators pursuing the research goals of the Integrated Bay
            Observatory, Predicting Ecosystem Response and Visualization &
            Imaging, RI Data Discovery Center will become the site where they
            will store their data, share their data internally with other C-AIM
            investigators and share their data externally with investigators
            around the world. In addition to new data collected by C-AIM
            investigators, RI Data Discovery Center will also collect and share
            historical data on the Narragansett Bay ecosystem. In addition to
            sharing data with scientists, RIDDC will also become the
            go-to-source where decision makers, land-use managers, relevant
            industries, citizen scientists and students can find data on the
            Narragansett Bay ecosystem.
          </p>
        </div>
      </template>
    </DashboardCard>
    <DashboardCard>
      <template #title>Credits</template>
      <template #subtitle>
        <div class="content">
          <p>
            The historical data available for lookup on this site has been
            compiled from quality controlled data from Narragansett Bay Fixed
            Site Monitoring Network (NBFSMN). The RI DEM Office of Water
            Resources (RIDEM-OWR) has been leading the effort of coordinating
            this multi-agency collaboration. Folllowing agencies contributed to
            the network of fixed-site monitoring stations:
          </p>
          <ul class="list">
            <li>
              Rhode Island Department of Environmental Management- Office of
              Water Resources (RIDEM-OWR)
            </li>
            <li>
              University of Rhode Island, Graduate School of Oceanography
              (URI-GSO)
            </li>
            <li>Narragansett Bay Commission (NBC)</li>
            <li>
              Narragansett Bay National Estuarine Research Reserve (NBNERR)
            </li>
            <li>Roger Williams University (RWU)</li>
            <li>
              Narragansett Bay Estuary Program (NBNEP), and URI Coastal
              Institute
            </li>
          </ul>
          <p>
            If you use any of these historical data in any publication,
            presentation, poster, media production or similar, please remember
            that you need to cite the data sources listed on RI DEM Fixed-Site
            Monitoring Stations Network Data (look under Citation for Data
            users)
          </p>

          <p>
            For more information about the RI DEM Fixed-Site Monitoring Stations
            please refer to RI DEM Fixed-Site Monitoring Stations and Data in
            Narragansett Bay
          </p>
        </div>
      </template>
    </DashboardCard>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
</script>
