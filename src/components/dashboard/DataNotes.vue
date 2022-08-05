<template>
  <p class="is-size-7">
    This web tool includes information on vaccines administered to Rhode Island
    residents as recorded in the
    <ExternalLink href="https://health.ri.gov/programs/detail.php?pgm_id=156681"
      >Rhode Island Child and Adult Immunization Registry</ExternalLink
    >
    at the Rhode Island Department of Health. Rhode Island residents with
    invalid or incomplete residential address information are excluded. Data for
    Rhode Island residents who were vaccinated at federal facilities or in most
    other states are not included unless they have submitted a copy of their
    vaccination record to the Rhode Island Department of Health. Data are
    included for residents vaccinated in MA and CT.
  </p>

  <p class="is-size-7">
    Estimates of population size are sourced from the United States Census
    Bureau's
    <ExternalLink href="https://www.census.gov/programs-surveys/acs"
      >American Community Survey</ExternalLink
    >
    (2015-2019, 5-year estimates). There is statistical uncertainty associated
    with these estimates, particularly for small populations in small geographic
    areas, resulting in estimates of vaccine coverage that are unreliable. Some
    estimates may be suppressed in line with the Rhode Island Department of
    <ExternalLink
      href="https://health.ri.gov/publications/policies/SmallNumbersReporting.pdf"
      >Health's Small Numbers Reporting Policy</ExternalLink
    >. All vaccine coverage estimates are capped at 99%.
  </p>
</template>

<script setup lang="ts">
import ExternalLink from "@/components/base/ExternalLink.vue";
</script>
