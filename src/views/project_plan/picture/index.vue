<template>
  <div class="project-plan">
    <div class="plan-container">
      <div class="planLeft">
        <el-tree
          :data="datatree"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
        ></el-tree>
      </div>
      <div class="planright">
        <div class="buttons">
          <el-button type="primary">
            <i class="imBook"></i>导入图片
          </el-button>
          <el-button type="primary">
            <i class="add"></i>添加
          </el-button>
        </div>
        <div class="formlist">
          <el-form ref="form" :model="querylist" label-width="82px">
            <el-form-item label="资源名称" >
              <el-input v-model="querylist.name"></el-input>
            </el-form-item>
            <el-form-item label="所属图书">
              <el-input v-model="querylist.bookName"></el-input>
            </el-form-item>
            <el-form-item label="数据来源"  style="margin-right:20px">
              <el-select v-model="querylist.source" placeholder="请选择数据来源">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="本版" value="本版"></el-option>
                <el-option label="外版" value="外版"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传时间" class="widthBig" v-show="hideFlag">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="querylist.beginTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">至</el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择时间"
                  value-format="yyyy-MM-dd"
                  v-model="querylist.endTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <div>
              <el-form-item class="width90" style="margin-right:20px;">
                <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button>
              </el-form-item>
              <el-form-item class="width90" style="margin-right:20px;">
                <el-button type="primary" plain @click="onReset">
                  <i class></i>重置
                </el-button>
              </el-form-item>
              <el-form-item class="width90" style="margin-right:20px;">
                <el-button type="text" @click="onHide" class="btntext">
                  <template v-if="!hideFlag">
                  更多条件
                  <i class="el-icon-arrow-down"></i>
                  </template>
                  <template v-else>
                  简洁
                  <i class="el-icon-arrow-up"></i>
                  </template>
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="tablelist">
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="所有图片" name="first">
              <el-table
               border
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                ref="multipleTable1"
                :data="list"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column label="缩略图" prop="image" align="center">
                  <template slot-scope="scope">
                    <img :src="scope.row.image">
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
                <el-table-column prop="bookName" label="所属图书" align="center"></el-table-column>
                <el-table-column prop="sellingPrice" label="售价" align="center">
                  <template slot-scope="scope">
                       ￥{{scope.row.sellingPrice.toFixed(1)}}
                  </template>
                </el-table-column>

                <el-table-column prop="uploadTime" label="上传时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status==='0'">已录入</span>
                    <span v-if="scope.row.status==='1'">审核通过</span>
                    <span v-if="scope.row.status==='2'">审核未通过</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <i class="edit distance"></i>
                    <i class="search distance"></i>
                    <i class="view distance"></i>
                    <i class="link distance"></i>
                  </template>
                </el-table-column>
              </el-table>
              <div class="prfooter">
                <div class="prfooterleft">
                  <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
                  <span class="marginleft" @click="batchAudit">批量审核</span>
                  <span class="marginleft">更多</span>
                </div>
                <div class="prfooterright">
                  <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
                </div>
              </div>
            </el-tab-pane>
             <el-tab-pane label="已录入" name="second">
              <el-table
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
              >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column label="缩略图" align="center" prop="image">
                  <template slot-scope="scope">
                    <img :src="scope.row.image">
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
                <el-table-column prop="bookName" label="所属图书" align="center"></el-table-column>
                <el-table-column prop="sellingPrice" label="售价" align="center">
                  <template slot-scope="scope">
                       ￥{{scope.row.sellingPrice.toFixed(1)}}
                  </template>
                </el-table-column>

                <el-table-column prop="uploadTime" label="上传时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                   <template slot-scope="scope">
                    <span v-if="scope.row.status==='0'">已录入</span>
                    <span v-if="scope.row.status==='1'">审核通过</span>
                    <span v-if="scope.row.status==='2'">审核未通过</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="scope">
                    <i class="edit distance"></i>
                    <i class="search distance"></i>
                    <i class="view distance"></i>
                    <i class="link distance"></i>
                  </template>
                </el-table-column>
              </el-table>
              <div class="prfooter">
                <div class="prfooterleft">
                  <el-checkbox v-model="checkedAllRecorded">全选</el-checkbox>
                  <span class="marginleft">批量审核</span>
                  <span class="marginleft">更多</span>
                </div>
                <div class="prfooterright">
                  <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="审核通过" name="third">
              <el-table
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column label="缩略图" prop="image" align="center">
                  <template slot-scope="scope">
                    <img :src="scope.row.image">
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
                <el-table-column prop="bookName" label="所属图书" align="center"></el-table-column>
                <el-table-column prop="sellingPrice" label="售价" align="center">
                  <template slot-scope="scope">
                       ￥{{scope.row.sellingPrice.toFixed(1)}}
                  </template>
                </el-table-column>

                <el-table-column prop="uploadTime" label="上传时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                   <template slot-scope="scope">
                    <span v-if="scope.row.status==='0'">已录入</span>
                    <span v-if="scope.row.status==='1'">审核通过</span>
                    <span v-if="scope.row.status==='2'">审核未通过</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="scope">
                    <i class="edit distance"></i>
                    <i class="search distance"></i>
                    <i class="view distance"></i>
                    <i class="link distance"></i>
                  </template>
                </el-table-column>
              </el-table>
              <div class="prfooter">
                <div class="prfooterleft">
                  <el-checkbox v-model="checkedAllPass">全选</el-checkbox>
                  <span class="marginleft">批量审核</span>
                  <span class="marginleft">更多</span>
                </div>
                <div class="prfooterright">
                  <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="审核未通过" name="fourth">
              <el-table
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column label="缩略图" prop="image" align="center">
                  <template slot-scope="scope">
                    <img :src="scope.row.image">
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
                <el-table-column prop="bookName" label="所属图书" align="center"></el-table-column>
                <el-table-column prop="sellingPrice" label="售价" align="center">
<template slot-scope="scope">
                       ￥{{scope.row.sellingPrice.toFixed(1)}}
                  </template>
                </el-table-column>

                <el-table-column prop="uploadTime" label="上传时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                   <template slot-scope="scope">
                    <span v-if="scope.row.status==='0'">已录入</span>
                    <span v-if="scope.row.status==='1'">审核通过</span>
                    <span v-if="scope.row.status==='2'">审核未通过</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="scope">
                    <i class="edit distance"></i>
                    <i class="search distance"></i>
                    <i class="view distance"></i>
                    <i class="link distance"></i>
                  </template>
                </el-table-column>
              </el-table>
              <div class="prfooter">
                <div class="prfooterleft">
                  <el-checkbox v-model="checkedAllUnpass">全选</el-checkbox>
                  <span class="marginleft">批量审核</span>
                  <span class="marginleft">更多</span>
                </div>
                <div class="prfooterright">
                  <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
                </div>
              </div>
            </el-tab-pane> 
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getPicList } from "@/api/resourcenew/picture";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import pagination from "./components/pagination";
export default {
  name: "bookIndex",
  data() {
    return {
      activeName: "first",
      checkedAll: false, //所有图片全选
      checkedAllRecorded: false, //已录入全选
      checkedAllPass: false, //已通过全选
      checkedAllUnpass: false, //未通过全选
      listLoading: true,
      list: [], //所有图片
      checkedList:{
        
      },//选中的列表
      hideFlag: false, //默认收起
      datatree: [
        {
          label: "项目规划",
          children: [
            {
              label: "项目分类名称一",
              children: [
                {
                  label: "二级类别5",
                  children: [
                    {
                      label: "三级类别1",
                      children: [
                        {
                          label: "四级类别1",
                          label: "四级类别2",
                          label: "四级类别3"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: "学科分类",
          children: [
            {
              label: "项目分类名称一",
              children: [
                {
                  label: "二级类别5",
                  children: [
                    {
                      label: "三级类别1",
                      children: [
                        {
                          label: "四级类别1",
                          label: "四级类别2",
                          label: "四级类别3"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },

      querylist: {
        diyTypeId: null,
        name: null,
        source: null,
        bookName: null,
        status: null,
        beginTime: null,
        endTime: null,
        diyTypeCode: null,
        pageNum: 1,
        pageSize: 20,
        orderBy: null
      },
      total: 100,
      pagesize: 30,
      currentPage: 1
    };
  },
  methods: {
    //所有图片全选
    changeStatus(){
      if(this.checkedAll){
         this.list.forEach(row => {
            this.$refs.multipleTable1.toggleRowSelection(row,true);
          });
      }else{
        this.$refs.multipleTable1.clearSelection();
      }
      

    },
    // 所有图片批量审核
    batchAudit(){
         
    },
    //检索
    onSubmit() {
      console.log(this.querylist);
      this.getList();
    },
    //重置
    onReset() {
      this.querylist = {
        pageNum: 1,
        status: null,
        pageSize: this.pageSize
      };
      this.getList();
    },
    onHide() {
      this.hideFlag = !this.hideFlag;
    },
    handleClick(tab, event) {
      if (tab.index == "0") {
        this.querylist.status = null;
        this.getList();
      } else if (tab.index == "1") {
        this.getRecorded();
      } else if (tab.index == "2") {
        this.getPassedList();
      } else if (tab.index == "3") {
        this.getUnpassedList();
      }
    },
    //多选框发生变化时
    handleSelectionChange(val) {
console.log(val)
    },
    // 翻页
    pagesizeFun(val) {
      this.querylist.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.querylist.pageNum = val;
      this.getList();
    },

    handleNodeClick() {},
    //未通过
    getUnpassedList() {
      this.querylist.status = "2";
      this.getList();
    },
    //已通过
    getPassedList() {
      this.querylist.status = "1";
      this.getList();
    },
    // 已录入
    getRecorded() {
      this.querylist.status = "0";
      this.getList();
    },
    //所有图片
    getList() {
      getPicList(this.querylist).then(res => {
        if (res.status) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          errorMsg.apply(this, [res.data, `获取表格数据`]);
        }
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.getList();
  },
  components: { pagination }
};
</script>
<style scoped>
.plan-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  border-sizing: border-box;
  padding-left: 1px;
  flex-basis: auto;
  height: calc(100vh - 50px);
}
.planLeft {
  width: 199px;
  background-color: #fff;
  border-right: 1px solid #ddd;
}
.planright {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 44px 30px 30px 30px;
}
/* .buttons .el-button {
  width: 100px;
  height: 34px;
  margin-right: 8px;
  padding-left: 15px;
}
.buttons .el-button:hover {
  background: #03bcd9;
  border-color: #03bcd9;
  border-radius: 0;
  color: #fff;
}
.formlist {
  padding: 35px 41px 15px 35px;
  background: #fff;
  margin-top: 24px;
} */
.widthBig {
  width: 613px;
}

.formlist .line {
  text-align: center;
  margin-bottom: 0;
  border: 0;
}
.imBook {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/importico.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.add {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_add.png") no-repeat;
  float: left;
}
.imExcel {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_excel.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.submitIcon {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_submitico.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.btntext {
  background: none;
  color: #409eff;
  border: 0;
}
.tablelist .edit {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/edit.png") no-repeat;
}
.tablelist .search {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/search.png") no-repeat;
}
.tablelist .view {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/view.png") no-repeat;
}
.tablelist .link {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/link.png") no-repeat;
}
.tablelist .distance {
  margin-right: 5px;
}
</style>
<style>
.project-plan .formlist .el-form-item__label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #424861;
}
/* .project-plan .formlist .el-input {
  width: 210px;
}
.project-plan .formlist .width260 .el-input {
  width: 260px;
} */ 
/* /* .project-plan .formlist .el-form-item {
  margin: 0;
  display: inline-block;
  margin-right: 48px;
  vertical-align: top;
  margin-bottom: 14px;
} */ */
.project-plan .width90 .el-form-item__content {
  margin-left: 0 !important;
}
/* .project-plan .formlist .el-button.search {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.project-plan .formlist .el-button {
  width: 89px;
  border-radius: 5px;
} */
/*底部*/
.prfooter {
  padding: 0px 21px;
  height: 40px;
  background: #3f4560;
  font-size: 13px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 81%;
}
.prfooter .el-checkbox {
  color: #ffffff;
}
.prfooter span {
  color: #ffffff;
}
.prfooterleft {
  float: left;
}
.prfooterright {
  /* width: 560px; */
  float: right;
}
.el-pagination {
  font-size: 13px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #fff;
}
/*翻页*/
/* .project-plan .el-pagination__total {
  color: #fff;
}
.project-plan .el-pagination {
  padding: 6px 0px;
}
.project-plan .el-pagination span,
.project-plan .el-pagination .el-select .el-input .el-input__inner,
.project-plan .el-pagination__editor.el-input .el-input__inner,
.project-plan .el-pagination .btn-next,
.el-pagination .btn-prev {
  color: #fff;
}
.project-plan .el-pagination .el-select .el-input .el-input__inner,
.project-plan .el-pagination__editor.el-input .el-input__inner {
  background: #393f5b;
  border: 0;
}
.project-plan .el-pager li,
.project-plan .el-pagination .btn-next,
.project-plan .el-pagination .btn-prev {
  background: #393f5b;
} */
/* .project-plan .el-table__header-wrapper th {
  background: #fff;
} */
</style>