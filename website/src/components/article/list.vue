<template>
  <div class="p-20">
    <div class="ivu-article">
      <div v-if="posts">
        <div v-if="posts.length">
          <CardArticle :posts="posts"></CardArticle>
          <div class="tc" v-if="posts.length !== count">
            <Button type="success" @click="addMorePosts">查看更多</Button>
          </div>
        </div>
        <div class="tc" v-else>
          <Alert type="error">没有文章</Alert>
        </div>
      </div>
      <div class="spin-auto auto p-t-20" v-else>
        <Spin fix></Spin>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'
  import CardArticle from '../common/card_article'

  export default{
    components: {
      CardArticle,
    },
    data() {
      return {
        count: null,
        posts: null,
        categoryId: null,
        pageSize: 2,
      }
    },
    methods: {
      addMorePosts() {
        const posts = this.queryPosts()
        const createdBy = AV.Object.createWithoutData('_User', currentEnv.belongTo)
        const skip = this.posts.length || 0
        if (this.categoryId === 'all') {
          posts.equalTo('createdBy', createdBy).descending('updatedAt').limit(this.pageSize).skip(skip)
          .find()
          .then((res) => {
            const finalRes = _.map(res, (item) => {
              const obj = item.toJSON()
              obj.categoryObj = item.get('category').toJSON()
              return obj
            })
            this.posts = this.posts.concat(finalRes)
          })
        } else {
          const category = AV.Object.createWithoutData('Category', this.categoryId)
          posts.equalTo('category', category)
          .equalTo('createdBy', createdBy)
          .descending('updatedAt')
          .limit(this.pageSize)
          .skip(skip)
          .find()
          .then((res) => {
            const finalRes = _.map(res, (item) => {
              const obj = item.toJSON()
              obj.categoryObj = item.get('category').toJSON()
              return obj
            })
            this.posts = this.posts.concat(finalRes)
          })
        }
      },
      setUpPosts() {
        this.categoryId = this.$route.params.categoryId
        this.posts = null
        const posts = this.queryPosts()
        const createdBy = AV.Object.createWithoutData('_User', currentEnv.belongTo)
        if (this.categoryId === 'all') {
          posts.equalTo('createdBy', createdBy).descending('updatedAt').limit(this.pageSize).find()
          .then((res) => {
            this.posts = _.map(res, (item) => {
              return item.toJSON()
            })
          })
          posts.count().then((res) => {
            this.count = res
          })
        } else {
          const category = AV.Object.createWithoutData('Category', this.categoryId)
          posts.equalTo('category', category)
          .equalTo('createdBy', createdBy)
          .descending('updatedAt')
          .limit(this.pageSize)
          .find()
          .then((res) => {
            this.posts = _.map(res, (item) => {
              const obj = item.toJSON()
              obj.categoryObj = item.get('category').toJSON()
              return obj
            })
          })
          posts.count().then((res) => {
            this.count = res
          })
        }
      },
    },
    watch: {
      $route() {
        this.setUpPosts()
      },
    },
    created() {
      this.setUpPosts()
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
