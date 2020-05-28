<template>
  <div>
    <p>Congratulations, you successfully created an initial DMP!
      Now you can select an export type and download the DMP or send it directly to your funder.
    </p>
    <v-card flat>
      <v-card-actions class="pl-0">
        <v-select
          v-model="selectedExportType"
          :items="exportTypes"
          label="Select export type"
          item-text="name"
          return-object
          class="mr-3"
        >
          <template slot="selection" slot-scope="data">
            <v-list-tile-content>
              <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
              <v-list-tile-sub-title v-if="data.item.format">({{ data.item.format }})</v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
          <template slot="item" slot-scope="data">
            <v-list-tile-content>
              <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
              <v-list-tile-sub-title v-if="data.item.format">({{ data.item.format }})</v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
        </v-select>

        <v-btn
          small
          @click="saveDmp"
        >
          <v-icon small>arrow_downward</v-icon><span class="ml-1">Download DMP</span>
        </v-btn>
        <v-btn
          small
          @click="pushDmptoRepository"
        >
          <v-icon small>arrow_upward</v-icon><span class="ml-1">Upload to Invenio</span>
        </v-btn>
        <v-btn
          small
          @click="submitToFunder"
          :loading="sending"
          :disabled="sending"
        >
          <v-icon small>send</v-icon><span class="ml-1">Submit DMP to funder</span>
        </v-btn>
      </v-card-actions>
    </v-card>
    <span
      v-if="latestSubmissionTime"
    >
      Latest submission: {{ latestSubmissionTime | formatDateTime }}
    </span>

    <v-snackbar
      v-model="showSuccessMessage"
      bottom right
      color="success"
    >
      DMP successfully submitted to funder!
      <v-btn
        flat
        @click="showSuccessMessage = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import { mapActions } from 'vuex'
import BackendService from '@/services/BackendService.js'

export default {
  name: 'End',
  data () {
    return {
      showSuccessMessage: false,
      sending: false,
      latestSubmissionTime: '',
      selectedExportType: undefined,
      exportTypes: [
        {
          key: 'rda-dmp-common',
          name: 'RDA DMP Common Standard',
          format: 'JSON'
        }
      ]
    }
  },
  methods: {
    ...mapActions('rda', ['constructRdaDmpCommonStandard']),
    saveDmp () {
      if (this.selectedExportType.key === 'rda-dmp-common') {
        this.constructRdaDmpCommonStandard().then(dmp => {
          let blob = new Blob([JSON.stringify(dmp, null, 2)], { type: 'application/json;charset=utf-8' })
          saveAs(blob, 'rda-common-dmp.json')
        })
      }
    },
    pushDmptoRepository() {
      //Pushing the DMP to repository
      if(confirm('Do you want to push the record to the repository?')) {
        console.log('confirmed action')
        if (this.selectedExportType.key === 'rda-dmp-common') {
        this.constructRdaDmpCommonStandard().then(dmp => {
          console.log(dmp.dmp)
          let theJson = {
                      "_access": {
                          "metadata_restricted": false,
                          "files_restricted": false
                      },
                      "_owners": [1],
                      "_created_by": 1,
                      "access_right": "open",
                      "resource_type": {
                          "type": "publication",
                          "subtype": "publication-datamanagementplan"
                      },
                      "identifiers": {
                          "DOI": "10.9999/rdm.9999999",
                          "arXiv": "9999.99999",
                          "dmp_id": dmp.dmp.dmp_id.identifier
                      },
                      "creators": [	
                          {
                              "name": "Julio Cesar",	
                              "type": "Personal",
                              "given_name": "Julio",
                              "family_name": "Cesar",
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
                              "title": dmp.dmp.title, 
                              "type": "Other",		
                              "lang": "eng"
                          }
                      ],
                      "descriptions": [
                          {
                              "description": dmp.dmp.description, 
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
                              "license": dmp.dmp.dataset[0].distribution[0].license[0].name,
                              "uri": dmp.dmp.dataset[0].distribution[0].license[0].license_ref,
                              "identifier": dmp.dmp.dataset[0].distribution[0].license[0].name,
                              "scheme": dmp.dmp.dataset[0].distribution[0].license[0].name
                          }
                      ]
                  }

                  console.log(theJson)
                  BackendService.sendToRepository(theJson)
                  .then(response => {
                      console.log(response)
                  })
                  .catch(error => {
                      console.log(error)
                  })
        })
      }
      }
    },
    submitToFunder () {
      // Dummy send to nowhere for demo
      if (confirm('Are you sure you want to submit the DMP to your funder?')) {
        this.sending = true
        setTimeout(() => {
          this.sending = false
          this.showSuccessMessage = true
          this.latestSubmissionTime = new Date().toISOString()
        }, 2000)
      }
    }
  },
  mounted: function () {
    // by default set the export type to RDA DMP Common Standard
    this.selectedExportType = this.exportTypes.find(t => {
      return t.key === 'rda-dmp-common'
    })
  }
}
</script>

<style scoped>

</style>
