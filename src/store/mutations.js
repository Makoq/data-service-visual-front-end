import Vue from 'vue';
import {
  SET_ACTIVE_COMPONENT_BY_INDEX,
  CHANGE_SCALE,
  ADD_COMPONENT,
  DELETE_COMPONENT,
  SET_DATA,
  CHANGE_COLOR,
  SET_COLOR_COUNT,
  MOVE_UP,
  MOVE_DOWN,
  CHANGE_SCREEN_BKG


} from './mutation-types';
import { stat } from 'fs';

export default {
  [SET_ACTIVE_COMPONENT_BY_INDEX](state, index) {
    Vue.set(state, 'currentElementIndex', index);
    // state.currentElementIndex = index; // 通过此种方式，store中的getter不会自动更新
    for (let i = 0; i < state.chartData.elements.length; i += 1) {
      const element = state.chartData.elements[i];
      if (index === i) {
        element.active = true;
      } else {
        element.active = false;
      }
    }
  },

  [CHANGE_SCALE](state, scale) {
    // state.scale = scale;
    Vue.set(state, 'scale', scale);
  },

  [ADD_COMPONENT](state, { data }) {
    state.chartData.elements.unshift(data); //  unshift() 往数组开头添加一个或多个元素，再返回数组的长度
  },

  [DELETE_COMPONENT](state, index) {
    if (index != -1 && state.chartData.elements.length > 0) {
      state.chartData.elements.splice(index, 1);
    }
  },
  [SET_DATA](state, data2) {
    state.chartData.elements[data2.ind].data=data2.data
  },
  [CHANGE_COLOR](state, data2) {
    state.colorNo=data2
  },
  [SET_COLOR_COUNT](state,data){
    state.colorCount=data
  },
  [MOVE_UP](state,data){
    state.chartData=data
  },
  [MOVE_DOWN](state,data){
    state.chartData=data
  },
  [CHANGE_SCREEN_BKG](state,data){
    state.chartData.bgimage=data
  }



};
