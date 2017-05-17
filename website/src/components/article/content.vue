<template>
  <div class="p-20">
    <div class="ivu-article" v-if="post">
      <h2>{{post.title}}</h2>
      <p><small>{{post.createdAt | dateFormat('L')}}</small></p>
      <div class="p-t-15">
        <div v-html="post.content"></div>
      </div>
      <div class="p-t-30 p-b-30">
        <img src="../../assets/images/line.svg" alt="" class="w-100">
      </div>
      <Row :gutter="16">
        <Col :xs="24" :sm="8" :md="6" :lg="6" v-for="(pic,index) in post.pic" :key="index" class="m-b-10">
        <Card>
          <img :src="pic" alt="" class="w-100">
        </Card>
        </Col>
      </Row>
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
          this.post.content = converter.makeHtml(this.post.content)
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
