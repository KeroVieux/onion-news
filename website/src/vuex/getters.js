/**
 * @module vuex/getters
 */
export default {
  /**
   * Get the state for temporary data what you had store
   * @param state - from vuex/state
   * @example let state = store.getters.temporaryData
   */
  temporaryData: (state) => { return state.temporaryData },
  currentUserInfo: (state) => { return state.currentUserInfo },
  allChartData: (state) => { return state.allChartData },
  categoryData: (state) => { return state.categoryData },
  postsData: (state) => { return state.postsData },

}
