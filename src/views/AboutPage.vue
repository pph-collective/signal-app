<template>
  <DashboardLayout>
    <DashboardCard>
      <template #title>Project Signal</template>
      <template #subtitle>
        <div class="content">
          <p>
            All Rhode Islanders deserve the same opportunity to live a healthy
            and happy life. However, all communities do not have the same
            resources at home, school, and work to do this. These differences
            mean that some communities have been more likely to suffer from
            COVID-19 than others. At Project Signal, we use data to show how
            COVID-19 has impacted the hardest-hit neighborhoods. We make these
            data available so we can make policies that protect the most
            vulnerable Rhode Islanders.
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
