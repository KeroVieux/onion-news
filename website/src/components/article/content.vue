<template>
  <div class="p-20">
    <div class="ivu-article" v-if="post">
      <h2>{{post.title}}</h2>
      <p><small>{{post.createdAt | dateFormat('L')}}</small></p>
      <div class="p-t-15">
        <p class="ti2">{{post.content | truncate(30)}}</p>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'

  export default{
    data() {
      return {
        posts: [],
        post: null,
        contentId: null,
      }
    },
    methods: {
      setUpPost() {
        this.contentId = this.$route.params.contentId
        this.posts = []
        const posts = this.queryPosts()
        posts.get(this.contentId)
        .then((res) => {
          this.post = res.toJSON()
          this.post.categoryObj = res.get('category').toJSON()
          console.log('this.post', this.post)
        })
      },
    },
    created() {
      this.setUpPost()
    },
    watch: {
      $route() {
        this.setUpPost()
      },
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
