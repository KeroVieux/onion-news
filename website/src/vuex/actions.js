/**
 * @module vuex/actions
 */
export default {
  /**
   * Mutate the temporary data to a new object
   * @param commit
   * @param {object} newSet
   * @example store.dispatch('temporaryData',object)
   */
  currentUserInfo({ commit }, newSet) {
    commit('currentUserInfo', newSet)
  },
  temporaryData({ commit }, newSet) {
    commit('temporaryData', newSet)
  },
  allChartData({ commit }, newSet) {
    commit('allChartData', newSet)
  },
  categoryData({ commit }, newSet) {
    commit('categoryData', newSet)
  },
  postsData({ commit }, newSet) {
    commit('postsData', newSet)
  },
}
