/**
 * Created by PetitKero on 30/9/2016.
 */
const mutations = {
  currentUserInfo(state, newSet) {
    _.assign(state, {
      currentUserInfo: newSet,
    })
  },
  temporaryData(state, newSet) {
    _.assign(state, {
      temporaryData: newSet,
    })
  },
  allChartData(state, newSet) {
    _.assign(state, {
      allChartData: newSet,
    })
  },
  categoryData(state, newSet) {
    _.assign(state, {
      categoryData: newSet,
    })
  },
  postsData(state, newSet) {
    _.assign(state, {
      postsData: newSet,
    })
  },
}

export default mutations
