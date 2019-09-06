import uuid from '@/utils/uuid'

function calculateTotalSize (estimations) {
  let sizeMin = 0
  let sizeMax = 0
  estimations.forEach(est => {
    sizeMin += est.estimatedSize.min
    sizeMax += est.estimatedSize.max
  })
  return Object.assign({}, {
    totalSizeMin: sizeMin,
    totalSizeMax: sizeMax,
    dataEstimations: estimations
  })
}

export const namespaced = true

export const state = {
  datasetNames: [],
  dataEstimations: [],
  editedDataEstimationIndex: -1,
  editedDataEstimationItem: {
    estimatedType: {},
    estimatedSize: {},
    selectedDataset: '',
    comment: ''
  },
  furtherDataDescription: ''
}

export const mutations = {
  SET_DATASET_NAMES (state, names) {
    state.datasetNames = names
  },
  UPDATE_DATASET_NAMES_ON_DATA_ESTIMATIONS (state) {
    state.dataEstimations.forEach(est => {
      if (!state.datasetNames.includes(est.selectedDataset)) {
        est.selectedDataset = ''
      }
    })
  },
  SAVE_DATA_ESTIMATION (state) {
    if (state.editedDataEstimationIndex > -1) {
      Object.assign(state.dataEstimations[state.editedDataEstimationIndex], state.editedDataEstimationItem)
    } else {
      state.dataEstimations.push(
        Object.assign({}, {
          id: uuid.uuidv4(),
          ...state.editedDataEstimationItem })
      )
    }
  },
  REMOVE_DATA_ESTIMATION (state, estimation) {
    const index = state.dataEstimations.indexOf(estimation)
    if (index > -1) {
      state.dataEstimations.splice(index, 1)
    }
  },
  SET_EDITED_DATA_ESTIMATION_ITEM (state, estimation) {
    state.editedDataEstimationIndex = state.dataEstimations.indexOf(estimation)
    state.editedDataEstimationItem = Object.assign({}, estimation)
  },
  SET_FURTHER_DATA_DESCRIPTION (state, description) {
    state.furtherDataDescription = description
  }
}

export const actions = {
  setDatasetNames ({ commit }, names) {
    commit('SET_DATASET_NAMES', names)
    commit('UPDATE_DATASET_NAMES_ON_DATA_ESTIMATIONS')
  },
  saveDataEstimation ({ commit }) {
    commit('SAVE_DATA_ESTIMATION')
  },
  removeDataEstimation ({ commit }, estimation) {
    commit('REMOVE_DATA_ESTIMATION', estimation)
  },
  setEditedDataEstimationItem ({ commit }, estimation) {
    commit('SET_EDITED_DATA_ESTIMATION_ITEM', estimation)
  },
  resetEditedDataEstimationItem ({ commit }) {
    commit('SET_EDITED_DATA_ESTIMATION_ITEM', {
      estimatedType: {},
      estimatedSize: {},
      selectedDataset: '',
      comment: ''
    })
  },
  setFurtherDataDescription ({ commit }, description) {
    commit('SET_FURTHER_DATA_DESCRIPTION', description)
  }
}

export const getters = {
  getDatasetNames: state => {
    return state.datasetNames
  },
  getDataEstimations: state => {
    return state.dataEstimations
  },
  getEditedDataEstimationItem: state => {
    return state.editedDataEstimationItem
  },
  beingEdited: state => {
    return state.editedDataEstimationIndex > -1
  },
  getDataEstimationsCount: state => {
    return state.dataEstimations.length
  },
  getDatasetSummaries: state => {
    let datasetSummaries = []
    state.datasetNames.forEach(name => {
      let estimationsPerName = state.dataEstimations.filter(estimation => estimation.selectedDataset === name)
      if (estimationsPerName.length > 0) {
        datasetSummaries.push(Object.assign({}, {
          datasetName: name,
          ...calculateTotalSize(estimationsPerName)
        }))
      }
    })
    return datasetSummaries
  },
  getUnassignedDatasetSummary: state => {
    return Object.assign({}, {
      datasetName: 'Unassigned data',
      ...calculateTotalSize(state.dataEstimations.filter(
        estimation => !state.datasetNames.includes(estimation.selectedDataset)))
    })
  },
  getFurtherDataDescription: state => {
    return state.furtherDataDescription
  }
}
