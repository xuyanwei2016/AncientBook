<template>
  <el-container class="ebook-container" style="width:100%;">
    <el-aside class="ebook-aside">
      <!-- <div class="resource-wrap" ref="transition">
        <ul class="resource-cat-ul">
          <li class="active" >
            <a href="javascript:void(0)">相关资源</a>
          </li>
        </ul>
        <v-none v-show="isNoData" />
      </div> -->
      <!-- <div class="semi-circle-right" @click.stop="hideAside" ref="asideBar"><span></span></div> -->
    </el-aside>
    <el-main style="padding:0;"  v-if="this.catalogueList.length>0">
      <div class="ebook-main" ref="ebookMain">
        <h3 class="title">《{{ `${ebookInfo.bookName}` }}》</h3>
        <!-- 电子书正文 -->
        <!-- <div class="ebook-main-content"
          v-html="bookHtml"
          ref="ebookContent"
          id="ebookContent"
          @mouseup="handleContentMouseUp"
          @click="handleImageClick"></div> -->
        <viewer :trigger="bookHtml">
          <div class="ebook-main-content"
            v-html="bookHtml"
            ref="ebookContent"
            id="ebookContent"
            @mouseup="handleContentMouseUp"></div>
        </viewer>
        <!-- 权限相关 -->
        <div class="auth-part">
          <!-- 0-未上架 -->
          <div v-if="messageCode===0" class="opt-con"><span class="tip">资源更新中，敬请期待</span></div>
          <!-- 1-资源为免费 -->
          <div v-else-if="messageCode===1" class="opt-con">
            <span v-if="!isLogin">试读结束，<a href="javascript:void(0)" class="login" @click="login">登录</a>后继续阅读全文</span>
            <a v-else class="buyVip" @click="buyVip">开题vip会员免费看</a>
          </div>
          <!-- 2-vip免费 -->
          <div v-else-if="messageCode===2" class="opt-con">
            <div v-if="isLogin">
              <span class="tip">试读结束，请先通过以下方式购买内容阅读权限</span>
              <a class="buyVip" @click="buyVip">开题vip会员免费看</a>
            </div>
            <span v-else class="for-login">已是会员或已购买，请<a href="javascript:void(0)" class="login" @click="login">登录</a>后阅读</span>
          </div>
          <!-- 3-单品购买 -->
          <div v-else-if="messageCode===3" class="opt-con">
            <span class="tip">试读结束，请先通过以下方式购买内容阅读权限</span>
            <a class="buyVip" @click="buyVip">开题vip会员免费看</a>
          </div>
          <!-- 4-机构账户无权限 -->
          <div v-else-if="messageCode===4" class="opt-con">
            <span class="tip">阅读全文请通过个人账户购买，或者联系管理员</span>
          </div>
        </div>
        <!-- 电子书目录 -->
        <div class="catalogue" ref="catalogue">
          <v-catalogue
          :content="catalogueContent"
          :list="catalogueList"
          @closeCat="handleCloseDynamicMask('catalogue')"
          @chapterChange="handleChapterChange" />
        </div>
        <!-- 电子书设置 -->
        <div class="setting" ref="setting">
          <v-setting @settingCallback="handleSettingCallback"></v-setting>
        </div>
        <!-- 笔记 -->
        <div class="note" ref="note">
          <v-note :content="note" @closeNote="handleCloseDynamicMask('note')"></v-note>
        </div>
      </div>
    </el-main>
    <el-main v-else  class="nodata" style="padding:0;">
      <img src="../../../../assets/img/null.png" alt="">
    </el-main>
    <el-aside class="ebook-aside">
      <ul class="ebook-opt">
        <li
          v-for="(item,index) in ebookOpt"
          :key="index"
          :class="[`opt-icon ${item.iClass}`, {'active': item.type==='collect' && isCollection === 1}]"
          @click="handleClick(item)"
          :ref="item.ref" 
          :style="{display: item.type === 'jiucuo' && userIsOrg? 'none':''}">
          <i></i>
        </li>
      </ul>
      <ul class="ebook-opt ebook-paging-opt">
        <li :class="['prev', {'disabled': !this.havePrev()}]" @click="handlePageChange('prev')"><i class="el-icon-arrow-left"></i></li>
        <li :class="['next', {'disabled': !this.haveNext()}]" @click="handlePageChange('next')"><i class="el-icon-arrow-right"></i></li>
      </ul>
    </el-aside>
    <!-- 登录弹窗 -->
    <!-- <div class="login-box">
      <el-dialog
        clsss="login-box-dialog"
        :visible.sync="logindialogShow"
        :show-close="false"
        :append-to-body="false" >
        <v-Login></v-Login>
      </el-dialog>
    </div> -->
    <!-- 开通vip 弹窗 -->
    <!-- <v-buyVip :visible="buyVipVisible" @childEvent="changeVisible"/> -->
    <!-- 纠错 -->
    <el-dialog
      title="纠错"
      :visible.sync="correctVisble"
      width="500px">
      <v-correct @closeCorrect="handleCorrectCallback"></v-correct>
    </el-dialog>
    <!-- 添加笔记动态操作button -->
    <div class="add-note-dy-button" ref="add-note-dy-button">
      <span class="up-triangle"></span>
      <a href="javascript:void(0)" @click="setNoteModalVidible">
        <i class="el-icon-edit-outline"></i>
        <span>添加笔记</span>
      </a>
    </div>
    <!-- 添加笔记弹窗 -->
    <div class="add-note-dy-modal" ref="add-note-dy-modal">
      <span class="up-triangle up-triangle-top"></span>
      <span class="up-triangle up-triangle-bottom"></span>
      <div class="note-textarea-con">
        <el-input
          type="textarea"
          :autosize="{ minRows: 9, maxRows: 9}"
          placeholder="请在此处填写笔记内容..."
          v-model="noteInpText"
          maxlength="300"
          @input="handleNoteInput" >
        </el-input>
        <span class="remnant">{{ noteInputLen }}/500</span>
      </div>
      <div class="bottom-opt">
        <a href="javascript:void(0)" class="btn submit" @click="submitNote">提交</a>
        <a href="javascript:void(0)" class="btn cancel" @click="closeNoteModal">取消</a>
      </div>
    </div>
    <!-- 图片查看大图 -->
    <!-- <el-dialog
      title=""
      class="artical-img-modal"
      :visible.sync="imgInArticalVisible" >
      <div class="artical-img-wraper">
        <img :src="imgSrc"/>
      </div>
    </el-dialog> -->
  </el-container>
</template>
<script>
  import '../../../../../static/css/ebook/index.scss'
  import {getChapterAPI,getRelationResourceDetailsAPI } from '@/api/resource/ebook'
  import { RESOURCETYPE_CODE } from '@/utils/code'
  import { isLogin, getUserLevelTypeCode, USERLEVELTYPE, getUserInfo } from '@/utils/auth'
  import { errorMessage, modifySuccess, warningMessage } from '@/utils/tip'
  import { getMousePos } from '@/utils/str'
  import { arr2tree, tree2Arr } from '@/utils/arr'
  // import None from '@/components/None/index'
  // import Login from '@/components/Login';
  // import BuyVip from '@/components/BuyVip/buyVipDialog'
  import EbookCatalogue from './catalogue'
  import EbookSetting from './setting'
  import EbookNote from './note'
  import EbookCorrect from './correct'
import { deflate } from 'zlib';

  export default {
    data() {
      return {
        ebookId: '',        // 图书ID
        markId: '',         // 章节ID
        orderNum: 0,        // 排序号
        orderMaxNum: '',    // 最大目录排序
        orderMinNum: 0,    // 最小目录排序
        
        ebookInfo: {},
        isCollection: 0,    // 0：未收藏；1：已收藏
        isLogin: isLogin() || false,
        logindialogShow: false,
        isNoData: false,
        activeCatId: RESOURCETYPE_CODE.rsWenku,


        ebookOpt: [
          // {
          //   type: 'home',
          //   iClass: 'home',
          // },
          {
            type: 'catalogue',
            iClass: 'catalogue',
          },
          // {
          //   type: 'setting',
          //   iClass: 'setting',
          // },
          // {
          //   type: 'note',
          //   iClass: 'note',
          //   // ref: '',
          // },
          // {
          //   type: 'collect',
          //   iClass: 'collect',
          //   ref: 'collect',
          // },
          // {
          //   type: 'reply',
          //   iClass: 'reply',
          // },
          // {
          //   type: 'jiucuo',
          //   iClass: 'jiucuo',
          // }
        ],

        catalogueContent: '电子书目录',
        catalogueList: [],
        catPermissionType: 'first', // whole-整章章节 first-第一章第一节等
        ids: [],
        flattenCatalogueList: [],
        note: '笔记',

        correctVisble: false,

        messageCode: '',
        message: '',

        bookHtml: '',

        // 添加笔记相关
        selectedText: '',
        noteInpText: '',
        noteInputLen: 0,

        imgSrc: '',
        imgInArticalVisible: false,

        buyVipVisible: false,
        form: {
          markId: '',
        },
        bookid:this.$route.query.bookid,
      }
    },
    components: {
      // 'v-none': None,
      'v-catalogue': EbookCatalogue,
      'v-setting': EbookSetting,
      'v-note': EbookNote,
      'v-correct': EbookCorrect,
      // 'v-Login': Login,
      // 'v-buyVip': BuyVip,
    },
    computed: {
      userIsOrg() { // 当前登录用户是否是机构用户
        return getUserLevelTypeCode() === USERLEVELTYPE.ORGANIZATION
      },
      
    },
    mounted () {
      this.getChapter()
      this.havePrev()
      this.haveNext()
    },
    methods: {
      // 是否有上一页
      havePrev() {
        return parseInt(this.orderNum,10) <= parseInt(this.orderMaxNum, 10) && parseInt(this.orderNum,10) > parseInt(this.orderMinNum,10)
      },
      // 是否有下一页
      haveNext() {             
        return !(parseInt(this.orderNum,10) >= parseInt(this.orderMaxNum, 10))
      },    
      login() {
        this.logindialogShow = true
      },
      handleCloseDynamicMask(refStr) {
        if (this.$refs[refStr].classList.contains('transition')) {
          this.$refs[refStr].classList.remove('transition')
        } else {
          ['catalogue','setting','note'].forEach(item => this.$refs[item].classList.remove('transition'));
          this.$refs[refStr].classList.add('transition')
        }
      },
      handleClick(record) {
        const type = record.type;
        switch (type) {
          case 'home':
            this.$router.push({ name: 'home'})
            break;
          case 'catalogue':
            this.handleCloseDynamicMask('catalogue')
            break;
          case 'setting':
            this.handleCloseDynamicMask('setting')
            break;
          case 'note':
            this.handleCloseDynamicMask('note')
            break;
          case 'reply': // 去往全部评论页
            const resourceId = this.ebookId; //  资源ID
            const resourceType = RESOURCETYPE_CODE.rsBook;   //  资源类型 0全部1图书 31文章 100资讯 等
            this.$router.push({ name: 'comments', query:{ id:resourceId, type:resourceType } })
            break;
          case 'collect':
            this.collectEbook()
            break;
          case 'jiucuo':
            this.handleErrorCorrect();
            break;
          default:
            break;
        }
      },
      // 收藏
      collectEbook() {
        if (!this.isLogin) {
          this.logindialogShow = true
          return
        }

        const { author, img:cover, synopsis:intro, id:objectId, goodsType:objectType, name:title } = this.ebookInfo
        const { isCollection } = this

        if (isCollection == 1){ // 取消收藏
          const cancelCollectData = {
            objectId,
            objectType,
            type: 1, // 1-税可知 2-走出去 3-视频课
          };
          this.$store.dispatch('CancelCollect', { ...cancelCollectData })
          .then( result =>{
            if (result.code == 0 && result.status) {
              this.isCollection = 0
              this.$refs['collect'][0].classList.remove('active')
              modifySuccess('取消收藏成功', 2)
            } else {
              warningMessage('请稍后再试', 2)
            }
          })
          return;
        }

        // 收藏
        const data = [{
          author,
          cover,
          intro,
          objectId,
          objectType,
          title,
          type: 1  // 1-税可知 2-走出去 3-视频课
        }]
        this.$store.dispatch('SaveCollect', data)
        .then( result =>{
          if (result.code === 0 && result.status) {
            this.isCollection = 1
            this.$refs['collect'][0].classList.add('active')
            modifySuccess('收藏成功', 2)
          } else {
            warningMessage('请稍后再试', 2)
          }
        })
      },

      handleErrorCorrect() {
        if (!this.isLogin) {
          this.logindialogShow = true
          return
        }
        this.correctVisble = true
      },

      // 电子书设置回调
      handleSettingCallback(callbackPrams) {
        const { close, data } = callbackPrams
        if (close) {
          this.handleCloseDynamicMask('setting')
        }

        Array.from(this.$refs['ebookContent'].classList).forEach(classItem => {
          this.$refs['ebookContent'].classList.remove(classItem)
        })
        this.$refs['ebookContent'].classList.add('ebook-main-content')

        if (!data) { return }
        // 字体
        if (data.fontFamily) {
          this.$refs['ebookContent'].classList.add(`fontfamily-${data.fontFamily}`)
        }
        // 字体大小
        if (data.fontSize) {
          this.$refs['ebookContent'].classList.add(`fontsize-${data.fontSize}`)
        }
        // 行间距
        if (data.lineHeight) {
          this.$refs['ebookContent'].classList.add(`lineHeight-${data.lineHeight}`)
        }
        
        // 主题
        Array.from(this.$refs['ebookMain'].classList).forEach(classItem => {
          this.$refs['ebookMain'].classList.remove(classItem)
        })
        this.$refs['ebookMain'].classList.add('ebook-main')
        if (data.topic) {
          this.$refs['ebookMain'].classList.add(`topic-${data.topic}`)
        }
      },

      // 笔记回调
      handleNoteCallback(callbackPrams) {
        if (callbackPrams.close) {
          this.handleCloseDynamicMask('setting')
        }
      },
      // 纠错回调
      handleCorrectCallback(callbackPrams) {
        const { close, data } = callbackPrams
        if (close) {
          this.correctVisble = false
        }
        if (data) {
          const userInfo = getUserInfo()
          const values = data
          const params = {
            commitTime: new Date(),   // 提交时间 
            content: values.content,  // 纠错内容 
            name: userInfo.nickName,  // 纠错人 
            resourceType: RESOURCETYPE_CODE.rsBook,     // 资源类型 
            status: this.ebookInfo.status,              // (默认0未审核)
            title: this.ebookInfo.name,                 // 资源标题 
          };
          this.$store.dispatch('ArticalErrorCorrect', { ...params })
          .then(result => {
            this.correctVisble = false
            if (result.code === 0) {
              modifySuccess('纠错信息已提交，感谢你呦！', 2)
            } else {
              errorMessage('提交失败，请稍后再试~', 2)
            }
          })
        } 
      },
      // 点击目录回调
      handleChapterChange(callbackPrams) {
        const { close, data } = callbackPrams
        this.form.markId=callbackPrams.data.markid
        this.orderNum=callbackPrams.data.orderNum
        if (close) {
          this.handleCloseDynamicMask('catalogue')
        }
        this.getRelationResourceDetails()

      },
       // 上一页、下一页
      handlePageChange(type) {

        const havePrev=this.havePrev();
        const haveNext=this.haveNext();
        if (type === 'prev' && !havePrev || type === 'next' && !haveNext) { return }
        this.orderNum=Number(this.orderNum);
        if(type==='next'){
          
          this.orderNum+=1;
          

        }else{
          this.orderNum-=1;
        }
        this.form.markId=this.catalogueList[this.orderNum].markid
        this.getRelationResourceDetails()
      },
      hideAside(event) {
        const target = event.target || event.srcElement
        if (target.classList.contains('transition')) {
          this.$refs.transition.classList.remove('transition')
          this.$refs.asideBar.classList.remove('transition')
        } else {
          this.$refs.transition.classList.add('transition')
          this.$refs.asideBar.classList.add('transition')
        }
      },
      //获取目录
      getChapter(){
        if(this.bookid){
          getChapterAPI(this.bookid).then( res => {
              if(res.data.code==0){
                if(res.data.data.length>0){
                  this.form.markId=res.data.data[0].markid;
                  
                  this.catalogueList=res.data.data

                  this.orderMaxNum=this.catalogueList.length-1
                  this.getRelationResourceDetails()
                }
                  

              }
          })
        }
      },
      // 获取详情
      getRelationResourceDetails() {
        getRelationResourceDetailsAPI(this.form).then(res => {
          if(res.data.code == 0) {
            this.ebookInfo = res.data.data
            this.bookHtml = res.data.data.text           
          }
        })
      },
      // 去往文章阅读页
      toArticalReadPage(record) {
        let pathName = 'htmlArticle'
        if (record.isPdf == '1'){ // pdf形式
          pathName = 'pdfArticle'
        }
        this.$router.push({ name: pathName, query: {id: record.resourceId} })
      },


      // getBookInfo() {
        
      // },

      /************************ 添加笔记相关 start ************************/
      handleContentMouseUp(event) {
        if (this.userIsOrg || !this.isLogin) { return }
        let selectedText;
        if (window.getSelection) {
          selectedText = window.getSelection().toString();
        } else if (document.selection && document.selection.createRange) {
          selectedText = document.selection.createRange().text;
        }
        this.selectedText = selectedText;

        if (selectedText && (!_.isEmpty(selectedText) || selectedText.length > 0)) {
          const xy = getMousePos(event);
          this.$refs['add-note-dy-button'].style.left = `${xy.x - 60}px`
          this.$refs['add-note-dy-button'].style.top = `${xy.y + 20}px`
          this.$refs['add-note-dy-button'].style.display = 'block'
        } else {
          this.$refs['add-note-dy-button'].style.display = 'none'
          this.$refs['add-note-dy-modal'].style.display = 'none'
        }
      },
      setNoteModalVidible(event) {
        this.$refs['add-note-dy-button'].style.display = 'none'
        const xy = getMousePos(event);
        this.$refs['add-note-dy-modal'].style.left = `${xy.x - 160}px`
        this.$refs['add-note-dy-modal'].style.top = `${xy.y - 20}px`
        this.$refs['add-note-dy-modal'].style.display = 'block'
      },
      handleNoteInput(){
        this.noteInputLen = this.noteInpText.length;
      },
      submitNote() {
        warningMessage('TODO')
      },
      closeNoteModal() {
        this.$refs['add-note-dy-modal'].style.display = 'none'
      },
      /************************ 添加笔记相关 end ************************/

      // 获取电子书内容
      getEbookContent(mId, oNum) {
        const params = {
          bookId: this.form.bookId,
        }
        mId && (params['markId'] = mId)
        oNum && (params['orderNum'] = oNum)
        this.getRelationResourceDetails({...params})
      },

     
      hasPermission(type, orderNum) {
        let _orderNum = orderNum
        type === 'prev' && _orderNum --
        type === 'next' && _orderNum ++
        const { catalogueList } = this
        const recordItem = this.getItemByOrderNum(catalogueList, _orderNum)
        return recordItem.hasPermission
      },
      /*getItemByOrderNum(list, orderNum) {
        for(let i =0; i<list.length; i+=1) {
          if (orderNum === list[i].orderNum) {
            return list[i]
          } else {
            if (list[i].children) {
              return list[i].children && this.getItemByOrderNum(list[i].children, orderNum)
            } else {
              continue;
            }
          }
        }
      },*/
      getItemByOrderNum(list, orderNum) {
        return _.find(this.flattenCatalogueList, item => item.orderNum === orderNum)
      },
      // 处理目录结构
      dealCatalogue(list) {
        list.forEach(listItem => listItem['hasPermission'] = true ) // 默认都具备阅读权限
        const result = arr2tree(list, {
          id: 'markid',
          key: 'markid',
          parent_id: 'pid',
          chapterName: 'chapterName',
          pid: 'pid',
          bookid: 'bookid',
          bookName: 'bookName',
          orderNum: 'orderNum',
          markid: 'markid',
          level: 'level',
          hasPermission: 'hasPermission',
        });
        // 根据messageCode处理目录的权限-无权限下只有第一章能点击
        const { messageCode, catPermissionType } = this
        this.ids = []
        if (!_.isNull(messageCode)) { // 无权限
          catPermissionType === 'first' && (this.getPremissionIdsFirst(_.cloneDeep(result)))
          catPermissionType === 'whole' && (this.getPremissionIdsWhole(_.cloneDeep(result[0])))
          this.setPermission(result, this.ids)
        }
        this.flattenCatalogueList = tree2Arr(_.cloneDeep(result))
        return result
      },
      // 递归查找第一个章节的id，以及其所属上级id
      getPremissionIdsFirst(catList) {
        if (_.isArray(catList) && _.isArray(catList[0].children)) {
          this.ids.push(catList[0].id) // 记录level1
          this.getPremissionIdsFirst(catList[0].children[0])
        } else if (_.isArray(catList.children)) {
          this.ids.push(catList.id) // 记录level2
          this.getPremissionIdsFirst(catList.children[0])
        } else {
          this.ids.push(catList.id)
        }
      },
      // 设置整一章的章节
      getPremissionIdsWhole(catList) {
        if (_.isArray(catList)) {
          catList.forEach(item => {
            this.ids.push(item.id)
            _.isArray(item.children) && this.getPremissionIdsWhole(item.children)
          })
        } else {
          this.ids.push(catList.id)
          _.isArray(catList.children) && this.getPremissionIdsWhole(catList.children)
        }
      },
      // 给目录数据结构设置hasPermission标记
      setPermission(list) {
        const ids = this.ids
        list.forEach(item => {
          if (ids.includes(item.id)) {
            item['hasPermission'] = true
          } else {
            item['hasPermission'] = false
          }
          item.children && this.setPermission(item.children)
        })
      },
      // 文中正文图片点击放大
      handleImageClick(event) {
        const target = event.target || event.srcElement
        if (target.nodeName.toLocaleLowerCase() === 'img' || target.tagName.toLocaleLowerCase() === 'img') {
          this.imgSrc = target.src
          this.imgInArticalVisible = true
        }
      },

      // 开通vip
      buyVip(){
        this.buyVipVisible = true
      },
      changeVisible(eventInfo){
        this.buyVipVisible = eventInfo.eventInfo
      },
    },
    created() {
      // if (this.$route.params.id) {
      //   this.ebookId = this.$route.params.id
      //   this.getBookInfo()          // 图书详情信息
      // }

      if (this.$route.params.id && this.$route.query.mid) {
        this.markId = this.$route.query.mid
        this.getEbookContent(this.markId)
      }
    },
  };
</script>
<style lang="scss" >
  @import 'index'
</style>
