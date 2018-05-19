import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {
    tokenid: '',
    username: ''
  },
//  projectId: ''
}

const mutations = {
  doLogin (state, user_input) {
    state.user.tokenid = user_input.tokenid;
    state.user.username = user_input.username;
  },
  // setProjectId (state, projectId_input) {
  //   state.projectId = projectId_input;
  // },
  setToken(state, token){
    state.user.tokenid = token;
  },
  setUsername(state,account){
    state.user.username = account;
  },
  reset(){
    state.tokenid = '';
  }
}


export default new Vuex.Store({
  state,
  mutations
})
