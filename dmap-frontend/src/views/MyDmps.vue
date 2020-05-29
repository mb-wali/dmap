<template>
  <div class="nice-padding">
    <p>
      <v-btn color="primary" :to="{ name: 'dmp-create'}">Create new DMP</v-btn>
    </p>
    <v-card>
      <v-card-title>
        MyDMPs
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search DMPs..."
          single-line
          hide-details
          outline
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="dmp.dmps"
        :expand="expand"
        :search="search"
        >
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded" class="text-xs-left">
            <td><router-link :to="{ name: 'dmp-show', params: { id: props.item.id }}">{{ props.item.id }}</router-link></td>
            <td>{{ props.item.researchProjects.length }}</td>
            <td><a :href="'mailto:' + props.item.contactPerson.email">
              {{ props.item.contactPerson.firstName }}  {{ props.item.contactPerson.lastName }}</a>
            </td>
            <td>{{ props.item.created | formatDateTime }}</td>
            <td>{{ props.item.lastUpdate | formatDateTime }}</td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <ProjectPreview v-for="project in props.item.researchProjects" :key="project.id" :project="project"/>
              <v-btn small @click="pushtorep(props)">
              <v-icon small>arrow_upward</v-icon><span class="ml-1">Save to repository</span>
              </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import store from '@/store/store'
import { mapState } from 'vuex'
import ProjectPreview from '@/components/ProjectPreview.vue'
import BackendService from '@/services/BackendService.js'

function getDmps (routeTo, next) {
  store.dispatch('dmp/fetchDmps')
    .then(() => {
      next()
    })
}

export default {
  name: 'MyDmps',
  components: { ProjectPreview },
  data () {
    return {
      search: '',
      expand: true,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Projects', value: '' },
        { text: 'Contact', value: 'contactPerson.lastName' },
        { text: 'Created', value: 'created' },
        { text: 'Last Update', value: 'lastUpdate' }
      ]
    }
  },
  methods: {
    pushtorep(props) {
      let obj = props.item
      let theJson = {
                      "_access": {
                          "metadata_restricted": false,
                          "files_restricted": false
                      },
                      "_owners": [obj.contactPerson.id],
                      "_created_by": obj.contactPerson.id,
                      "access_right": "open",
                      "resource_type": {
                          "type": "publication",
                          "subtype": "publication-datamanagementplan"
                      },
                      "identifiers": {
                          "DOI": "10.9999/rdm.9999999",
                          "arXiv": "9999.99999",
                          "dmp_id": obj.id
                      },
                      "creators": [	
                          {
                              "name": obj.contactPerson.firstName + " " + obj.contactPerson.lastName,	
                              "type": "Personal",
                              "given_name": obj.contactPerson.firstName,
                              "family_name": obj.contactPerson.lastName,
                              "identifiers": {
                                  "Orcid": "9999-9999-9999-9999"
                              },
                              "affiliations": [
                                  {
                                      "name": "Entity One",
                                      "identifier": "entity-one",
                                      "scheme": "entity-id-scheme"
                                  }
                              ]
                          }
                      ],
                      "titles": [			
                          {
                              "title": obj.researchProjects[0].title, 
                              "type": "Other",		
                              "lang": "eng"
                          }
                      ],
                      "descriptions": [
                          {
                              "description": obj.researchProjects[0].description, 
                              "type": "Abstract",
                              "lang": "eng"
                          }
                      ],
                      "community": {	
                          "primary": "Maincom",
                          "secondary": ["Subcom One", "Subcom Two"]
                      },
                      "licenses": [
                        {
                          "license": "Berkeley Software Distribution 3",
                          "uri": "https://opensource.org/licenses/BSD-3-Clause",
                          "identifier": "BSD-3",
                          "scheme": "BSD-3"
                        }
                      ]
                  }
                  BackendService.sendToRepository(theJson)
                  .then(response => {
                      console.log(response)
                  })
                  .catch(error => {
                      console.log(error)
                  })

    }
  },

  beforeRouteEnter (routeTo, routeFrom, next) {
    getDmps(routeTo, next)
  },
  beforeRouteUpdate (routeTo, routeFrom, next) {
    getDmps(routeTo, next)
  },
  computed: {
    ...mapState(['dmp'])
  }
}


</script>

<style scoped>
.nice-padding{
  padding: 20px;
}

</style>
