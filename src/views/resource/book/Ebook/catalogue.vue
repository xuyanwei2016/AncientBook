<!-- 电子书目录 -->
<template>
  <div class="cat-wrap">
    <span class="close-cat" @click="close"><i class="el-icon-close "></i></span>
    <h3 class="tip">目录</h3>
    <!-- list结构 -->
    <div class="cat-content for-list" v-if="type==='list'">
      <ul>
        <!-- 一级 -->
        <li v-for="(item,index) in list" :key="`level-${item.level}-${index}`">
          <div class="level-1">
            <a href="javascript:void(0)"
              @click="hanldeClickChapter(item)"
              :class="['name']">
              {{ item.chapterName }}
            </a>
            <span class="line"></span>
            <!-- <span :class="['page', {'disabled': !item.hasPermission }]">
              {{ item.hasPermission?item.orderNum:"未购买" }}
            </span> -->
          </div>
          <ul v-if="item.children && item.children.length > 0">
            <!-- 二级 -->
            <li v-for="(level2Item, index) in item.children" :key="`level-${level2Item.level}-${index}`">
              <div class="level-2">
                <a href="javascript:void(0)"
                  @click="hanldeClickChapter(level2Item)"
                  :class="['name']">
                  {{ level2Item.chapterName }}
                </a>
                <span class="line"></span>
                <!-- <span :class="['page', {'disabled': !level2Item.hasPermission }]">
                  {{ level2Item.hasPermission?level2Item.orderNum:"未购买" }}
                </span> -->
              </div>
              <ul v-if="level2Item.children && level2Item.children.length > 0">
                <!-- 三级 -->
                <li v-for="(level3Item, index) in level2Item.children" :key="`level-${level3Item.level}-${index}`">
                  <div class="level-3">
                    <a href="javascript:void(0)"
                      @click="hanldeClickChapter(level3Item)"
                      :class="['name']">
                      {{ level3Item.chapterName }}
                    </a>
                    <span class="line"></span>
                    <!-- <span :class="['page', {'disabled': !level3Item.hasPermission }]">
                      {{ level3Item.hasPermission?level3Item.orderNum:"未购买" }}
                    </span> -->
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- html形式 -->
    <div class="cat-content for-html" v-html="content" v-else></div>
  </div>
</template>
<script >
  import { warningMessage } from '@/utils/tip'
  export default {
    props: ['content', 'list'],
    data() {
      return {

      }
    },
    computed: {
      // 目录展现形式 - 目录列表优先判断‘chapterList’来渲染数据，再判断‘bookCatalog’来渲染数据
      type() {
        if (this.list.length > 0) {
          return 'list'
        } else if (this.content) {
          return 'html'
        }
      },
    },
    methods: {
      close() {
        this.$emit('closeCat', {close: true})
      },
      hanldeClickChapter(record) {
        this.$emit('chapterChange', {close: true, data: record})
      },
    }
  }
</script>
<style lang="scss">
  .cat-wrap{
    padding: 30px;
    height: 100%;
    .close-cat{
      width: 100%;
      display: block;
      font-size: 20px;
      i:hover{ opacity: 0.5; }
    }
    .tip{
      width: 100%;
      text-align: center;
      font-size:20px;
      margin-bottom: 20px;
      font-family:MicrosoftYaHei-Bold;
      font-weight:bold;
      color: #46515A;
    }
    .cat-content{
      height: 90%;
      overflow-y: auto;
    }
    .for-html{}
    .for-list{
      font-size: 14px;
      color: #46515A;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      .level-1,
      .level-2,
      .level-3{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        a.name{
          text-align: left;
          color: #46515A;
        }
        a.name:hover{ color: #0089EE; }
        span.line{
          flex-grow: 1;
          display: inline-block;
          height: 1px;
          border: 1px solid #BBBBBB;
          margin: 0 10px;
        }
        span.page{
          text-align: right;
        }
        a.name.disabled,span.page.disabled{
          color: #A0A9B1;
          cursor: default;
        }
        a:hover{ color: #0089EE; }
      }
      .level-2{
        padding-left: 50px;
      }
      .level-3{
        padding-left: 100px;
      }
    }
  }
</style>