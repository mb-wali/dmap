import axios from 'axios'
import qs from 'qs'
import store from '@/store/store'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

const repoClient = axios.create({
  baseURL: 'https://invenio-test.tugraz.at/api',
  //baseURL: 'https://localhost:5000/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
  },
  timeout: 10000
})

apiClient.interceptors.request.use(config => {
  store.dispatch('loading/startLoading')
  return config
}, error => {
  store.dispatch('loading/finishLoading')
  return Promise.reject(error)
})

apiClient.interceptors.response.use(response => {
  store.dispatch('loading/finishLoading')
  return response
}, error => {
  store.dispatch('loading/finishLoading')
  return Promise.reject(error)
})

const cancellableGetFactory = () => {
  let call
  return (url, config) => {
    if (call) {
      call.cancel('One request only allowed at a time.')
    }
    call = axios.CancelToken.source()
    config.cancelToken = call.token
    return apiClient.get(url, config)
  }
}

const repositorySuggestionCall = cancellableGetFactory()

export default {
  sendToRepository(dmp) {
    console.log('sending...')
    console.log("dmp is ", dmp)
    return repoClient.post('/records/', dmp)
  },
  getDmps () {
    return apiClient.get('/dmp')
  },
  getDmp (id) {
    return apiClient.get('/dmp/' + id)
  },
  createNewDmp (dmp) {
    return apiClient.post('/dmp', dmp)
  },
  getProjectSuggestions (user) {
    return apiClient.post('/pdb/suggest-projects', user)
  },
  getProjectDetails (projectId) {
    return apiClient.get('/pdb/project/' + projectId)
  },
  getProjectStaff (projectId) {
    return apiClient.get('/pdb/project/' + projectId + '/staff')
  },
  getRepositorySuggestions (params) {
    return repositorySuggestionCall('/repository-registry/search', {
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'brackets' })
      }
    }).catch(error => {
      if (axios.isCancel(error)) {
        console.log('Previous repository suggestion request cancelled: ' + error.message)
      } else {
        throw error
      }
    })
  },
  getRepositoryDetails (repositoryId) {
    return apiClient.get('/repository-registry/repository/' + repositoryId)
  }
}
