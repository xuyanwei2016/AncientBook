<template>
  <!--图书印刷-->
  <el-container class="project-plan printing submitBtn">
    <el-main>
      <div class="buttons">
        <el-button type="primary" v-if="authBtns.filter(i => i.idName=='submitAudit').length>0" @click="submitAudit">
          <i class="add"></i>提交审核
        </el-button>
        <el-button
          type="primary"
          @click="bookPrinting"
          v-if="authBtns.filter(i => i.idName=='bookPrinting').length>0"
        >
          <i class="submitIcon"></i>图书加印
        </el-button>
      </div>

      <div class="formlist">
        <el-form ref="form" :model="bookForm" label-width="82px">
          <el-form-item label="书名">
            <el-input v-model="bookForm.bookName"></el-input>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="timeLimit"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="ISBN">
            <el-input v-model="bookForm.isbn"></el-input>
          </el-form-item>
          <el-form-item label="状态:" class="width360">
            <el-select v-model="bookForm.status" placeholder="请选择">
              <el-option
                v-for="(item,ind1) in statusList"
                :key="ind1"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width90">
            <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button>
            <el-button type="primary" plain @click="onReset">
              <i class></i>重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="tablelist">
        <template>
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="新书" name="1"></el-tab-pane>
            <el-tab-pane label="图书加印" name="3"></el-tab-pane>
            <el-tab-pane label="再版图书" name="2"></el-tab-pane>
          </el-tabs>
        </template>
        <div class="table_outer_wrap iconCss">
          <el-table
            :key="tableKey"
            stripe
            :data="listData"
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            border
            highlight-current-row
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            @sort-change="sortChanged"
          >
            <el-table-column type="index" align="center" label="序号"></el-table-column>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="图书名称" align="center" prop="bookName">
            </el-table-column>
            <el-table-column label="ISBN" align="center" prop="isbn">
              <template slot-scope="scope">{{ scope.row.isbn ||'———'}}</template>
            </el-table-column>
            <el-table-column label="版印次" align="center" prop="editionTimes">
              <template slot-scope="scope">{{ scope.row.editionTimes ||'———'}}</template>
            </el-table-column>
            <el-table-column label="操作时间" align="center" prop="dealTime" sortable>
              <template slot-scope="scope">{{ scope.row.dealTime ||'———'}}</template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status">
              <template slot-scope="scope">{{ statusList.filter(item=>{return item.code==scope.row.status})[0].name
                ||'———'}}
              </template>
            </el-table-column>
            <el-table-column label="是否结算" align="center" prop="settlementStatus">
              <template slot-scope="scope">{{ settlementStatus[scope.row.settlementStatus] ||'———'}}</template>
            </el-table-column>

            <el-table-column label="印制流程" align="center">
              <template slot-scope="scope">
                <span v-if="bookForm.bookType!=2">{{stage[scope.row.stage] ||'———'}}</span>
                <span v-else>{{scope.row.stage=='7-1'?'图书再版':stage[scope.row.stage] ||'———'}}</span>
              </template>

            </el-table-column>
            <el-table-column label="印厂" align="center" prop="printingHouse">
              <template slot-scope="scope">{{ scope.row.printingHouse ||'———'}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <i class="edit distance" title="编辑" @click="looktoRecord(0,scope.row.id,'editId')"
                   v-if="scope.row.status==0&&(scope.row.stage=='7-1'||scope.row.stage == '7-4')"></i>
                <i class="search distance" title="查看" @click="looktoRecord(1,scope.row.id,'lookId')"></i>
                <!--<i class="copy" title="审核1"
                   v-if="(scope.row.status==1||(scope.row.stage!='7-1'&&scope.row.status!=2))&&scope.row.settlementStatus!='3-1'&&bookForm.bookType!=3"
                   @click="looktoRecord(2,scope.row.id,'examineId')"></i>
                <i class="copy" title="审核2"
                   v-if="scope.row.status!=2&&scope.row.settlementStatus!='3-1'&&bookForm.bookType==3"
                   @click="looktoRecord(2,scope.row.id,'examineId')"></i>-->
                <!--新书 图书再版-->
                <i class="copy" title="审核" v-if="
                activeName!=3
                &&((scope.row.status==1&&scope.row.stage=='7-1')||(scope.row.status==0&&scope.row.stage=='7-3')||(scope.row.status==1&&scope.row.stage=='7-2'))
                &&scope.row.settlementStatus!='3-1'"
                   @click="looktoRecord(2,scope.row.id,'examineId')"></i>

                <!--图书加印-->

                <i class="copy" title="审核"
                   v-if="activeName==3&&((scope.row.status==1&&scope.row.stage=='7-4')||(scope.row.status==0&&scope.row.stage=='7-3'))&&scope.row.settlementStatus!='3-1'"
                   @click="looktoRecord(2,scope.row.id,'examineId')"></i>


              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"
                        :page-size="bookForm.pageSize"
                        :current-page="bookForm.pageNum"></pagination>
          </div>
        </div>
      </div>


      <v-alert :alertModelOptions="alertOptions"></v-alert>
    </el-main>
  </el-container>
</template>

<script>
  import {getMultipleSelectionIDs} from "@/filters/getIds";
  import store from "@/store";
  import pagination from "../../../views/resource/components/pagination";
  import {getListAPI, updateStatusAPI, bookAdditionAPI,printCheckAPI} from '@/api/newBook/printing.js';
  import {confirm} from "../../../utils/publicFunctions";
  export default {
    data() {
      return {
        alertOptions: {},
        authBtns: [],
        bookForm: {
          pageNum: 1,
          pageSize: 50,
          bookType: '1',
        },
        statusList: [
          {name: '未提交', code: 0},
          {name: '待审核', code: 1},
          {name: '已完成', code: 2},
        ],
        timeLimit: [],
        activeName: '1',
        listData: [],
        listLoading: false,
        tableKey: 0,
        batchList: [],
        ids: [],
        total: 1,
        settlementStatus: {
          '3-1': '未结算',
          '3-2': '部分结算',
          '3-3': '已结算',
        },
        stage: {
          '7-1': '新书付型',
          '7-2': '审核毛书',
          '7-3': '图书入库',
          '7-4': '图书加印',
        },
        routerLink:'',
      }
    },
    components: {
      pagination
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    },
    mounted() {
      if(this.$store.state.user.fromRouter=='overprint'){
        this.bookForm.bookType=3;
        this.activeName='3';
      }else if(this.$store.state.user.fromRouter=='secondEdition'){
        this.bookForm.bookType=2;
        this.activeName='2';
      }
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getListAPI(this.bookForm).then(res => {
          this.listData = res.data.list;
          this.total = res.data.total;
          this.listLoading = false;
        })

      },
      /*勾选列表*/
      handleSelectionChange(val) {
        this.batchList = val;
        this.batchList.length > 0
          ? (this.ids = getMultipleSelectionIDs(this.batchList, "id"))
          : this.ids = [];
      },
      /*提交审核*/
      submitAudit() {
        let self = this;
        if (this.batchList.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        if(this.activeName!=3){
          let isbnS='';
          let stampV = this.batchList.every((item) => {
            return item.stamp !=''  && item.stamp!=null;
          })

          if(!stampV){
            this.$message.warning(`请先完善信息，再提交审核`);
            return
          }
        }else{
          let isbnS='';
          let stampV = this.batchList.every((item) => {
            return item.lastPrice !=''  && item.lastPrice!=null;
          })

          if(!stampV){
            this.$message.warning(`请先完善信息，再提交审核`);
            return
          }
        }


        if (this.bookForm.bookType == 1) {
          let boo = this.batchList.every((item) => {
            return item.status == 0 && (item.stage == '7-1' || item.stage == '7-4') && item.settlementStatus != '3-1';
          })

          if (!boo) {
            this.$message.warning(`只有新书付型下结算的未提交的数据才能进行操作`);
            return
          }
        } else if (this.bookForm.bookType == 3) {
          let boo = this.batchList.every((item) => {
            return item.status == 0 && item.stage == '7-4';
          })
          if (!boo) {
            this.$message.warning(`只有图书加印下结算的数据才能进行操作`);
            return
          }
        }else{
          let boo = this.batchList.every((item) => {
            return item.status == 0 && (item.stage == '7-1' || item.stage == '7-4') && item.settlementStatus != '3-1';
          })
          if (!boo) {
            this.$message.warning(`只有图书再版下结算的未提交的数据才能进行操作`);
            return
          }
        }

        updateStatusAPI(this.ids).then(res => {
          if (res.data.status) {
            this.alertOptions = {
              show: true,
              btn: 1,
              msg: '操作成功！',
              sureText: '确定',
              showClose: true,
              width: 450,
              sure() {
                self.alertOptions.show = false;
                self.getList();
              },
              cancel() {
                self.alertOptions.show = false;
                self.getList();
              }
            };
          } else {
            this.$message.error(res.data.msg);
          }
        })

      },
      /*图书是不是能加印*/
      bookAddition(){
        let self=this;
        return new Promise(function(resolve, reject) {
          printCheckAPI({ids:self.ids}).then(res=>{
            if (res.data.code==0){
              resolve(res.data.data);
            } else {
              this.$message.error(res.data.msg);
              reject(error);
            }
          })
        });

      },
      /*图书加印*/
      async bookPrinting() {
        let self = this;
        if (this.batchList.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        let boo = this.batchList.every((item) => {
          return this.bookForm.bookType==1&&item.stage == '7-3' && item.settlementStatus != '3-1' && item.status == 2;
        })
        if (!boo) {
          this.$message.warning('只有印制流程为图书入库下的已结算下的已完成数据才能进行操作');
          return
        }
        let aBoo= await this.bookAddition();
        if(!aBoo){
          this.$message.warning('图书不能重复加印');
          return;
        }
        confirm.apply(this,['确定要进行图书加印操作吗？']).then(() => {
          bookAdditionAPI({ids:this.ids}).then(res => {
            if (res.data.status) {
              this.alertOptions = {
                show: true,
                btn: 1,
                msg: '操作成功！',
                sureText: '确定',
                showClose: true,
                width: 450,
                sure() {
                  self.alertOptions.show = false;
                  self.getList();
                },
                cancel() {
                  self.alertOptions.show = false;
                  self.getList();
                }
              };
            } else {
              this.$message.error(res.data.msg);
            }
          })
        })


      },
      /*检索*/
      onSubmit() {
        this.bookForm.pageNum = 1;
        if (this.timeLimit && this.timeLimit.length > 0) {
          this.bookForm.dealStartTime = this.timeLimit[0];
          this.bookForm.dealEndTime = this.timeLimit[1];
        } else {
          this.bookForm.dealStartTime = null;
          this.bookForm.dealEndTime = null;
        }
        this.getList();
      },
      /*重置*/
      onReset() {
        this.bookForm = {
          pageNum: 1,
          pageSize: this.bookForm.pageSize,
          bookType: this.bookForm.bookType,
          orderBy: this.bookForm.orderBy
        };
        this.timeLimit = [];
        this.getList();
      },
      /*点击切换*/
      handleClick(tab, event) {
        this.bookForm.bookType = tab.name;
        this.getList();
      },

      //排序
      sortChanged({column, prop, order}) {
        if (order) {
          this.bookForm.orderBy = `${prop} ${order.substring(0, order.length - 6)}`
        } else {
          this.bookForm.orderBy = null
        }
        this.getList();
      },
      // 翻页
      pagesizeFun(val) {
        this.bookForm.pageNum = 1;
        this.bookForm.pageSize = val;
        this.getList();
      },
      currentPageFun(val) {
        this.bookForm.pageNum = val;
        this.getList();
      },
      /*编辑查看审核*/
      looktoRecord(num, id, type) {
        //新书 1 图书加印 3 再版图书 2
        let obj = [
          {name: '新书', link: `/newBook/printing/look?${type}=${id}`},
          {name: '再版图书', link: `/newBook/printing/secondEdition?${type}=${id}`},
          {name: '图书加印', link: `/newBook/printing/overprint?${type}=${id}`},
        ];
        let link = obj[Number(this.activeName) - 1].link;
        this.$router.push(link);
      },
    },

  }
</script>

<style scoped lang="less">
  .tablelist .search {
    display: inline-block;
    width: 17px;
    height: 19px;
    background: url("../../../assets/img/search.png") no-repeat;
  }
  .tablelist .edit {
    display: inline-block;
    width: 17px;
    height: 19px;
    background: url("../../../assets/img/edit.png") no-repeat;
  }
  .tablelist .imdel {
    display: inline-block;
    width: 21px;
    height: 21px;
    background: url("../../../assets/img/del1.png") no-repeat;
  }
  .tablelist .copy {
    display: inline-block;
    width: 21px;
    height: 21px;
    background: url("../../../assets/img/copy.png") no-repeat;
  }
</style>
