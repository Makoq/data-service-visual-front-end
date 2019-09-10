export default {
  currentElement(state) {
    if (state.currentElementIndex >= 0) {
      return state.chartData.elements[state.currentElementIndex];
    }
    return {};
  },
};
