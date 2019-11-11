import {
  SET_ACTIVE_COMPONENT_BY_INDEX,
  CHANGE_SCALE,
  ADD_COMPONENT,
  DELETE_COMPONENT,
  SET_DATA,
  CHANGE_COLOR,
  SET_COLOR_COUNT
} from './mutation-types';

export default {
  setActiveComponentByIndex({ commit }, index) {
    commit(SET_ACTIVE_COMPONENT_BY_INDEX, index);
  },

  changeScale({ commit }, scale) {
    commit(CHANGE_SCALE, scale);
  },

  addComponent({ commit }, data) {
    commit(ADD_COMPONENT, { data });
  },

  deleteComponent({ commit }, index) {
    commit(DELETE_COMPONENT, index);
  },

  setComponentData({ commit }, data){
    commit(SET_DATA, data);
  },

  changeColor({ commit }, data){
    commit(CHANGE_COLOR, data);
  },
  setColorCount({commit},data){
    commit(SET_COLOR_COUNT,data)
  }


};
