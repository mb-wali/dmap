<template>
  <div>
    <v-combobox v-model="researchDataTags"
                label="Create tags to logically group your research data into datasets"
                multiple chips deletable-chips clearable
    >
    </v-combobox>
    <p>Estimate type, volume and format of your research data manually</p>
    <v-layout row wrap>
      <v-flex xs6>
        <v-select
          v-model="editedDataEstimation.estimatedType"
          :items="researchDataTypeItems"
          label="Estimated type"
          class="px-0"
        >
        </v-select>
      </v-flex>
      <v-flex xs2>
        <v-select
          v-model="editedDataEstimation.estimatedSize"
          :items="sizeItems"
          label="Estimated size"
          class="px-0"
        >
        </v-select>
      </v-flex>
      <v-flex xs4>
        <v-select
          v-model="editedDataEstimation.selectedTag"
          :items="researchDataTags"
          label="Dataset tag"
          clearable
        >
        </v-select>
      </v-flex>
      <v-flex x12 text-xs-right>
        <v-btn @click="addItem(editedDataEstimation)" small>
          <v-icon small>add_circle</v-icon><span class="add-btn">Add</span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="getDataEstimations"
    >
      <template v-slot:items="props">
        <td>{{ props.item.estimatedType }}</td>
        <td class="text-xs-right">{{ props.item.estimatedSize }}</td>
        <td class="text-xs-center">{{ props.item.selectedTag }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ResearchDataEstimator',
  data () {
    return {
      researchDataTags: [],
      editedDataEstimation: {
        estimatedType: '',
        estimatedSize: '',
        selectedTag: ''
      },
      researchDataTypeItems: [
        'Text documents (doc, odf, pdf, txt, etc.)',
        'Graphics/Images (jpeg, svg, png, gif, tiff, etc.)',
        'Spreadsheets (xls, ods, csv, sas, stata, spss, etc.)',
        'Structured text (html, json, tex, xml, etc.)',
        'Video/Film (mpeg, avi, wmv, mp4, etc.)',
        'Databases (MS Access, MySQL, Oracle, etc.)',
        'Software applications source code (css, JavaScript, Java, etc.)',
        'Audio (mp3, wav, aiff, ogg, etc.)',
        'Software applications',
        'Configuration data (ini, conf, etc.)',
        'Other'
      ],
      sizeItems: [
        '< 100 MB',
        '100 - 1000 MB',
        '1 - 5 GB',
        '5 - 20 GB',
        '20 - 50 GB',
        '50 - 100 GB',
        '100 - 500 GB',
        '500 - 1000 GB',
        '1 - 5 TB',
        '5 - 10 TB',
        '10 - 100 TB',
        '> 100 TB',
        'Don\'t know'
      ],
      headers: [
        { text: 'Estimated type', value: 'estimatedType', align: 'left' },
        { text: 'Estimated size', value: 'estimatedSize', align: 'right' },
        { text: 'Dataset tag', value: 'selectedTag', align: 'center' },
        { text: 'Actions', value: 'estimatedType', align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters('data', ['getDataEstimations'])
  },
  methods: {
    ...mapActions('data', ['addDataEstimation', 'removeDataEstimation']),
    addItem (estimationItem) {
      this.addDataEstimation(estimationItem)
      this.clearItem(estimationItem)
    },
    editItem (estimationItem) {
      console.log('edit')
    },
    deleteItem (estimationItem) {
      this.removeDataEstimation(estimationItem)
    },
    clearItem (estimationItem) {
      estimationItem.estimatedType = ''
      estimationItem.estimatedSize = ''
      estimationItem.selectedTag = ''
    }
  }
}
</script>

<style scoped>
.add-btn{
  margin-left: 6px;
}
</style>