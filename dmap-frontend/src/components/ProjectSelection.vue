<template>
  <div>
    <p>Please select the project(s) you want to create a DMP for.</p>
    <v-expansion-panel expand>
      <v-expansion-panel-content v-for="(project, i) in project.projects" :key="i">
        <div slot="header" @click="getProjectDetails(project.projectId)">
          <ProjectOverviewCard :project="project"></ProjectOverviewCard>
        </div>
        <ProjectDetailsCard :project-id="project.projectId"></ProjectDetailsCard>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <div class="text-xs-center">
      <v-pagination v-model="page" :length="5">
      </v-pagination>
    </div>
    <div class="search-div">
      <p>Not in the list? Try to find it with the search function.
      <span><v-text-field
        v-model="projectSearchTerm"
        append-icon="search"
        label="Search projects..."
        single-line
        hide-details
        ></v-text-field></span>
      </p>
    </div>
  </div>
</template>

<script>
import ProjectOverviewCard from './ProjectOverviewCard'
import ProjectDetailsCard from './ProjectDetailsCard'
import store from '@/store/store'
import { mapState } from 'vuex'

function getProjectSuggestions () {
  store.dispatch('project/fetchProjectSuggestions')
}

export default {
  name: 'ProjectSelection',
  components: { ProjectOverviewCard, ProjectDetailsCard },
  computed: {
    ...mapState(['project'])
  },
  data () {
    return {
      projectSearchTerm: '',
      page: 1
    }
  },
  methods: {
    getProjectDetails (projectId) {
      store.dispatch('project/fetchProjectDetails', projectId)
    }
  },
  created () {
    getProjectSuggestions()
  }
}

</script>

<style scoped>
.search-div{
  padding-top: 20px;
  float: left;
}

.search-field{
  float: right;
}
</style>