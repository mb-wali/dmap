import Vue from 'vue'
import Vuex from 'vuex'
import * as dmp from '@/store/modules/dmp.js'
import * as loading from '@/store/modules/loading.js'
import * as project from '@/store/modules/project.js'
import * as people from '@/store/modules/people.js'
import * as data from '@/store/modules/data.js'
import * as legal from '@/store/modules/legal.js'
import * as user from '@/store/modules/user.js'
import * as repository from '@/store/modules/repository.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dmp,
    loading,
    project,
    people,
    data,
    legal,
    user,
    repository
  }
})
