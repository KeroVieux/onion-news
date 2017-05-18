<template>
  <div class="navigator_bar pos-rel">
    <div class="container">
      <ul class="m-0 p-0">
        <li class="dib"><router-link to="/" class="c-white fz-16 p-l-15 p-r-15"><Icon type="ios-home"></Icon> 主页</router-link></li>
        <li class="dib"><router-link to="/articles/list/all" class="c-white fz-16 p-l-15 p-r-15"><Icon type="planet"></Icon> 文章</router-link></li>
        <li class="dib"><router-link to="/articles/list/591bb201da2f60005d0d5190" class="c-white fz-16 p-l-15 p-r-15"><Icon type="code"></Icon> 案例</router-link></li>
        <li class="dib"><router-link to="/about" class="c-white fz-16 p-l-15 p-r-15"><Icon type="ios-body"></Icon> 关于我</router-link></li>
      </ul>
    </div>
  </div>
</template>
<script>
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    data() {
      return {
        navList: [],
      }
    },
    created() {
      const Category = this.queryCategory()
      Category.find().then((res) => {
        this.navList = _.map(res, (item) => {
          return item.toJSON()
        })
      })
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
