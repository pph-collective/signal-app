<template>
  <DashboardLayout>
    <DashboardCard>
      <template #title>About This Project</template>
      <template #subtitle>
        <div class="content">
          <p>
            All Rhode Islanders have the right to live a healthy and happy life.
            We all want resources to help us and our families thrive at home,
            work, or school. But we don’t all get these same opportunities
            because of where we live. This means that some communities are
            affected by COVID-19 more than others.
          </p>
          <p>
            <b
              >At Project Signal, we use data to show how COVID-19 has impacted
              the hardest-hit neighborhoods. We make this data available to
              support policies that protect the most vulnerable Rhode
              Islanders.</b
            >
          </p>
        </div>
      </template>
    </DashboardCard>
    <DashboardCard>
      <template #title>About Our Team</template>
      <template #subtitle>
        <div class="content">
          <p>
            Project SIGNAL is a collaboration between the Rhode Island
            Department of Health and the People, Place, and Health Collective in
            the Department of Epidemiology at the
            <a href="https://www.brown.edu/academics/public-health/home"
              >Brown University School of Public Health.</a
            >
            The People, Place, and Health Collective conducts research to
            support public health policies and programs that are data-driven,
            people-centered, and place-oriented. Some of the People, Place, and
            Health Collective's other signature initiatives include
            <a href="https://www.preventoverdoseri.org/">PreventOverdoseRI</a>,
            <a href="https://profoundmodel.web.app/">PROFOUND</a>,
            <a href="http://provident.preventoverdoseri.org/">PROVIDENT</a>, and
            <a href="https://www.titanmodel.org/">TITAN</a>. For more about the
            People, Place, and Health Collective, visit our website
            <a href="https://medium.com/pphc">here</a>.
          </p>
          <p>
            <a style="padding-left: 20px" href="#"
              ><a href="https://github.com/pph-collective"
                ><i class="fab fa-github"></i></a
            ></a>
            <a style="padding-left: 25px" href="#"
              ><a href="https://twitter.com/pph_collective"
                ><i class="fab fa-twitter"></i></a
            ></a>
            <a style="padding-left: 25px" href="#"
              ><a href="https://www.instagram.com/pph_collective"
                ><i class="fab fa-instagram"></i></a
            ></a>
          </p>
        </div>
      </template>
    </DashboardCard>
    <DashboardCard>
      <template #title>Disclosures</template>
      <template #subtitle>
        <div class="content">
          <p>
            Project SIGNAL leverages the Rhode Island Department of Health's
            multi-component surveillance system for monitoring patterns in
            COVID-19 and related outcomes. Datasets used to create the contents
            of this web tool were obtained through an approved request to the
            Rhode Island Department of Health. This web tool was developed using
            funds from the Centers for Disease Control and Prevention's National
            Initiative to Address COVID-19 Health Disparities Among Populations
            at High-Risk and Underserved (OT21-2103) via the Rhode Island
            Department of Health. Any opinions, findings, conclusions or
            recommendations expressed in this material are those of the
            author(s) and do not necessarily reflect the views of the Centers
            for Disease Control and Prevention or the Rhode Island Department of
            Health.
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
