<template>
  <div class="page_header bg-white box_shadow">
    <div class="container">
      <Row>
        <Col span="4" class="p-t-15 p-b-15">
        <router-link to="/"><img src="http://img.hidoge.cn/logo/logo-300x300.jpg" alt="" height="45px"></router-link>
        </Col>
        <Col span="20">
        <Menu mode="horizontal" theme="light" active-name="1" class="r">
          <Menu-item name="2" @click.native="goToLink(`/articles/list/all`)">
            <Icon type="ios-paper"></Icon>
            文章
          </Menu-item>
          <Menu-item name="3" @click.native="goToLink(`/articles/list/591090eb44d904007bf44efe`)">
            <Icon type="social-github"></Icon>
            案例
          </Menu-item>
          <Menu-item name="4" @click.native="goToLink(`/about`)">
            <Icon type="ios-body"></Icon>
            关于
          </Menu-item>
        </Menu>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script type="text/babel">
  import FnMixins from '../../assets/js/fn-mixins'

  export default{
    mixins: [FnMixins],
  }
</script>
