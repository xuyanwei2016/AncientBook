<template>
  <div class="project-plan app-container">
    <div class="buttons">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0" @click="addBtn">
        {{authBtns.filter(i => i.idName=='addBtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>

      <el-button v-if="authBtns.map(i => i.idName).indexOf('leadBtn') >= 0" @click="leadBtn">
        {{authBtns.filter(i => i.idName=='leadBtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='leadBtn').length>0 && authBtns.filter(i => i.idName=='leadBtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('leadBtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>
    </div>
    <!-- <el-form inline class="form-inline">
      <el-form-item label="机构名称">
        <el-input v-model="listQuery.contract" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
      </el-form-item>
    </el-form>-->
    <el-table
      :key="tableKey"
      :data="list"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      highlight-current-row
      stripe
      @selection-change="chioceList"
       class="tablelist"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
      <el-table-column label="丛书名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.seriesEnglish}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i
            :class="authBtns.filter(i => i.idName=='editBtn')[0].icon"
            :title="authBtns.filter(i => i.idName=='editBtn')[0].name"
            v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"
            @click="editBtn(scope.row.id,scope.row.seriesName,scope.row.seriesEnglish)"
          ></i>

          <i
            :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon"
            :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name"
            v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0"
            @click="singleDelete(scope.row.id)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <!--添加丛书-->
    <el-dialog title="添加丛书" :visible.sync="dialogVisible" width="30%" @close="closeBook">
      <el-form
        class="form-inline"
        :rules="rules"
        :model="addMessage"
        label-width="100px"
        style="margin-right:10px;"
        ref="dataForm"
      >
        <el-form-item label="丛书名称:" prop="seriesName">
          <el-input v-model="addMessage.seriesName" style='width:80%;'></el-input>
        </el-form-item>
        <el-form-item label="英文名称:" prop="seriesEnglish">
          <el-input v-model="addMessage.seriesEnglish" style='width:80%;'></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getsureAuthor">保存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        
      </span>
    </el-dialog>
    <!--导入excel-->
    <el-dialog
      title="导入Excel"
      :visible.sync="importExcDialog"
      class="backgroundDialog importExcDialog"
      @close="closeExcel"
    >
      <p>请选择要导入的文件，文件类型只支持Excel。</p>
      <div class="importExc">
        <input
          type="file"
          ref="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        >
        <a class="fake-download" :href="`${domain}/file/templet/丛书导入模板.xlsx`">下载模板文件</a>
      </div>
      <el-progress
        :percentage="percentageValue"
        :stroke-width="12"
        style="margin:15px auto"
        color="#67C23A"
      ></el-progress>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmImport" type="primary">确 定</el-button>
        <el-button @click="importExcDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 底部 -->
    <div  v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
      <div class="prfooterright">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNum"
          :page-sizes="[30,50,100,200,500]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          align="center"
        ></el-pagination>
      </div>
    </div>
    <!-- 底部 -->
    
  </div>
</template>


<script>
import {
  getListAPI,
  deleteAPI,
  isExistAPI,
  addAPI,
  updateAPI,
  excelAPI
} from "@/api/business/books";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";

import {
  requestMsg,
  confirm,
  checkSelect,
  operationMsg,
  errorMsg
} from "@/utils/publicFunctions";
import { getMultipleSelectionIDs, removeDuplicates } from "@/filters/getIds";
import Cookies from "js-cookie";
import store from "@/store";
import "@/styles/resource.scss";
export default {
  data() {
    const bookName = (rule, value, callback) => {
      let reg=/^(?!(\s+$))/;
      if(!reg.test(value)){
        callback(new Error('请输入丛书名称'));
      }else{
        callback()
      }
    }
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      fileList: [],
      total: null,
      listLoading: true,
      nation: "", //民族
      listQuery: {
        pageNum: 1,
        pageSize: 50
      },
      upfiles: true,
      addMessage: {
        id: ""
      },
      dialogVisible: false,
      importExcDialog: false,
      timeLimit: null,
      multipleSelection: [],
      data: [
        {
          dataType: "",
          dataTypeSort: "",
          dataType: ""
        }
      ],
      editId: "",
      temp: {},
      rules: {
        seriesEnglish: [
          {
            required: false,
            max:80,
            message:'英文名称不能超过80位',
          }
        ],
        seriesName: [
          {
            required: true,
            message:'请输入丛书名称'
          },
          {
            max:80,
            message:'丛书名称不能超过80位'
          },
          {
            validator:bookName,
            message:'请输入丛书名称'
          }
        ]
      },
      batchData: {
        ids: ""
      },
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      percentageValue: 0
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  mounted() {
    this.getList();
    this.nation = Cookies.get("nation");
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.list = res.data.data.list;
            this.total = res.data.data.total;
          }
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    leadBtn(id) {
      //   //删除功能
      //   if (checkSelect.apply(this, [this.multipleSelection])) {
      //     this.batchData.ids = getMultipleSelectionIDs(this.multipleSelection)
      //     confirm.apply(this, ["确定要删除吗？"]).then(() => {
      //     deleteAPI(this.batchData.ids).then(res => {
      //       requestMsg.apply(this, [res.data, "删除"]);
      //     });
      //   });
      //   }
    },
    
    massSetting(msg, api, data, msgName) {
      confirm.apply(this, [msg]).then(() => {
        api(data).then(res => {
          operationMsg.apply(this, [res.data, msgName]);
        });
      });
    },
    singleDelete(id) {
      this.massSetting(`确定删除这个丛书吗？`, deleteAPI, [id], `删除`);
    },
    addBtn() {
      this.dialogVisible = true;
    },
    editBtn(id, seriesName, seriesEnglish) {
      this.dialogVisible = true;
      this.addMessage.id = id;
      this.addMessage.seriesName = seriesName;
      this.addMessage.seriesEnglish = seriesEnglish;
    },
    //导入
    leadBtn() {
      this.importExcDialog = true;
    },
    //上传文件
    confirmImport() {
      if (this.$refs.file.files[0]) {
        const fileObj = this.$refs.file.files[0];
        // FormData 对象
        const form = new FormData();
        // 文件对象
        form.append("file", fileObj);
        var timeid = window.setInterval(() => {
          if (this.percentageValue < 100) {
            this.percentageValue += 25;
          }
        }, 20);
        excelAPI(form).then(res => {
          window.clearInterval(timeid);
          if (res.data.code == 0) {
            this.$message.success(
              "文件：" + fileObj.name + "," + res.data.data
            );
            this.importExcDialog = false;
            this.getList();
          } else {
            this.$message.error("文件：" + fileObj.name + "上传失败");
          }
        });
      }
    },
    chioceList(val) {
      this.multipleSelection = val;
    },
    handleFilter() {
      store.dispatch("SetSupplierSerKeys", this.listQuery).then(res => {});
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
     //解决索引只排序当前页的问题,增加函数自定义索引序号
    indexSet(index){
      return (this.listQuery.pageNum-1)*this.listQuery.pageSize+index+1;
    },
    //添加丛书
    getsureAuthor() {
      this.$refs["dataForm"].validate(valid => {
        
        if (valid) {
          if (this.addMessage.id) {
            updateAPI(this.addMessage).then(res => {
              if (res.data.code == 0) {
                this.$message.success("丛书编辑成功");
                this.dialogVisible = false;
                this.getList();
              }else if(res.data.code == -8) {
                this.$message.error('该丛书已存在')
              }else{
                errorMsg.apply(this, [res.data, `丛书编辑`]);
              }
            });
          } else {
            addAPI(this.addMessage).then(res => {
              if (res.data.code == 0) {
                this.$message.success("丛书添加成功");
                this.dialogVisible = false;
                this.getList();
              }else if(res.data.code == -8) {
                this.$message.error('该丛书已存在')
              }else{
                errorMsg.apply(this, [res.data, `丛书添加`]);
              }
            });
          }
           
         
          
        }
      });
    },
    //关闭添加丛书
    closeBook(){
      this.addMessage={
        id: "",
        seriesEnglish:"",
        seriesName:""
      }
      this.$refs["dataForm"].resetFields()
    },
    //关闭弹窗
    closeExcel(){
      var file = this.$refs.file;
      file.value = ""; //虽然file的value不能设为有字符的值，但是可以设置为空值
      this.percentageValue = 0;
    }
  }
};
</script>
<style>
.app-container .importExcDialog .el-dialog {
  width: 420px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -210px;
  margin-top: -150px !important;
}
/* .dialogFormVisibleClass{
  background:white;
  border:1px solid #ccc;
  color:#ccc;
  border-radius: 0;
}
.dialogFormVisibleClass:hover{
  background:#606266;
  color:white;
  border:1px solid #606266;
  border-radius: 0;
} */
.addStyle {
  margin-left: 100px;
  cursor: pointer;
}
.addStyle span {
  font-size: 20px;
  display: inline-block;
  vertical-align: middle;
}
</style>
<style scoped>

</style>