<template>
  <div class="p-20">
    <Modal
      v-model="editing"
      :loading="saving"
      @on-cancel="htmlOverFlowAuto"
      @on-ok="handleSubmit('editingForm')"
      title="编辑">
      <div class="fix p-l-10 p-r-10">
        <div class="upload-preview tc m-b-20 l">
          <figure>
            <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`"
                 class="rounded bd-blue m-r-5"
                 v-for="thumbnail in thumbnails"/>
          </figure>
        </div>
        <QiniuUpload :multiple="true" @complete="uploadComplete" ref="qiniuUpload" class="l">
          <a></a>
        </QiniuUpload>
      </div>
      <div class="m-b-20"></div>
      <Form :model="editingArticle" ref="editingForm" :label-width="80" :rules="editingRules">
        <Form-item label="状态">
          <Input v-model="editingArticle.status" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="置顶">
          <Input v-model="editingArticle.onTop" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="类目" prop="select">
          <Select v-model="editingArticle.categoryId">
            <Option v-for="item in categoryList" :value="item.objectId" :key="item.objectId">{{ item.title }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="标题" prop="title">
          <Input v-model="editingArticle.title" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item label="摘要" prop="summary">
          <Input v-model="editingArticle.summary" placeholder="请输入..." type="textarea" :rows="4">
          </Input>
        </Form-item>
        <Form-item label="备注">
          <Input v-model="editingArticle.remark" placeholder="请输入..." type="textarea" :rows="4">
          </Input>
        </Form-item>
        <h3 class="c-g9 m-b-5 p-l-5">内容</h3>
        <markdown-editor v-model="editingArticle.content" ref="markdownContent"></markdown-editor>
      </Form>
    </Modal>
    <div class="tr m-b-15">
      <Button type="primary" @click="add">新增</Button>
    </div>
    <Table height="600" border :columns="columns2" :data="posts" class="w-100 m-b-15"></Table>
    <div class="fix">
      <Page :total="count" :page-size="pageSize" @on-change="changePage" class="r"></Page>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'
  import CardArticle from '../common/card_article'
  import QiniuUpload from '../common/qiniuUpload'

  export default{
    components: {
      CardArticle, QiniuUpload,
    },
    data() {
      return {
        editing: false,
        saving: false,
        editingArticle: {},
        thumbnails: [],
        editingRules: {
          summary: { required: true, max: 300, message: '必填，且最多300个文字', trigger: 'blur' },
          title: { required: true, max: 80, message: '必填，且最多80个文字', trigger: 'blur' },
        },
        posts: [],
        categoryList: [],
        categoryId: null,
        pageSize: 10,
        count: null,
        columns2: [
          {
            title: 'objectId',
            key: 'objectId',
            width: 200,
            fixed: 'left',
          },
          {
            title: '类别',
            key: 'categoryTitle',
            width: 200,
            sortable: true,
          },
          {
            title: '标题',
            key: 'title',
            width: 250,
              /* filters: [
               {
               label: '大于25岁',
               value: 1
               },
               {
               label: '小于25岁',
               value: 2
               },
               ],
               filterMultiple: false,
               filterMethod(value, row) {
               if (value === 1) {
               return row.title === '设计'
               } else if (value === 2) {
               return row.title === '摄影'
               }
               },*/
          },
          {
            title: '作者',
            key: 'createdByName',
            width: 150,
          },
          {
            title: '最后更新',
            key: 'formatUpdatedAt',
            width: 150,
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            render(row, column, index) {
              return `<i-button type="text" size="small" @click="edit(${index})">编辑</i-button>`
            },
          },
        ],
      }
    },
    methods: {
      changePage(page) {
        console.log(page)
      },
      add() {
        this.htmlOverFlowHidden()
        this.thumbnails = []
        this.editing = true
        this.editingArticle = {
          content: '',
          status: '1',
          onTop: '0',
          title: '',
          category: '',
          remark: '',
        }
      },
      uploadComplete(status, result) {
        if (status === 200) {
          this.thumbnails.push(`http://img.hidoge.cn/${result.key}`)
        } else {
          console.log('出错', status)
        }
      },
      edit(index) {
        this.htmlOverFlowHidden()
        this.editing = true
        this.editingArticle = this.posts[index]
        this.editingArticle.categoryId = this.editingArticle.category.objectId
        this.thumbnails = this.posts[index].pic
        console.log('this', this.posts[index])
      },
      handleSubmit(name) {
        this.htmlOverFlowAuto()
        const user = this.currentUser()
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.editingArticle && this.editingArticle.objectId) {
              this.saving = true
              const modelPost = this.modelUpdate('Posts', this.editingArticle.objectId)
              modelPost.save({
                status: _.toNumber(this.editingArticle.status),
                onTop: _.toNumber(this.editingArticle.onTop),
                title: this.editingArticle.title,
                content: this.editingArticle.content,
                remark: this.editingArticle.remark,
                summary: this.editingArticle.summary,
                pic: this.thumbnails,
                createdBy: AV.Object.createWithoutData('_User', user.objectId),
                category: AV.Object.createWithoutData('Category', this.editingArticle.categoryId),
              }).then((res) => {
                console.log(res.id)
                const post = this.queryPosts()
                post.include(['category', 'createdBy']).get(res.id).then((getRes) => {
                  const obj = getRes.toJSON()
                  console.log('修改', obj)
                  this.$Message.success('操作成功')
                  this.editing = false
                  this.saving = false
                  obj.createdByName = obj.createdBy ? getRes.get('createdBy').toJSON().username : '无'
                  obj.categoryTitle = obj.category ? getRes.get('category').toJSON().title : '无'
                  obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
                  this.posts = _.map(this.posts, (item) => {
                    if (item.objectId === obj.objectId) {
                      item = obj
                    }
                    return item
                  })
                })
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            } else {
              this.saving = true
              const modelPost = this.modelPosts()
              modelPost.save({
                status: _.toNumber(this.editingArticle.status),
                onTop: _.toNumber(this.editingArticle.onTop),
                title: this.editingArticle.title,
                content: this.editingArticle.content,
                remark: this.editingArticle.remark,
                summary: this.editingArticle.summary,
                pic: this.thumbnails,
                createdBy: AV.Object.createWithoutData('_User', user.objectId),
                category: AV.Object.createWithoutData('Category', this.editingArticle.categoryId),
              }).then((res) => {
                const post = this.queryPosts()
                console.log(res.id)
                post.include(['category', 'createdBy']).get(res.id).then((getRes) => {
                  const obj = getRes.toJSON()
                  console.log('新增', obj)
                  this.editing = false
                  this.saving = false
                  obj.createdByName = obj.createdBy ? getRes.get('createdBy').toJSON().username : '无'
                  obj.categoryTitle = obj.category ? getRes.get('category').toJSON().title : '无'
                  obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
                  this.posts = [obj, ...this.posts]
                  this.$Message.success('操作成功')
                })
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            }
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
    },
    created() {
      this.posts = []
      const posts = this.queryPosts()
      posts.count().then((res) => {
        this.count = res
        console.log('this.count', this.count)
      })
      posts.include(['category', 'createdBy']).descending('createdAt').limit(this.pageSize).find()
        .then((res) => {
          this.posts = _.map(res, (item) => {
            const obj = item.toJSON()
            obj.createdByName = obj.createdBy ? item.get('createdBy').toJSON().username : '无'
            obj.categoryTitle = obj.category ? item.get('category').toJSON().title : '无'
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            obj.categoryId = obj.category.objectId
            console.log('id', obj.category.objectId)
            return obj
          })
        })
        .catch((err) => {
          console.log('err', err)
        })
      const category = this.queryCategory()
      category.find().then((res) => {
        this.categoryList = _.map(res, (item) => {
          const obj = item.toJSON()
          obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
          return obj
        })
      })
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
