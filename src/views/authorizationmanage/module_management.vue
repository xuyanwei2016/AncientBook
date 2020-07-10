<template>
  <div class="project-plan app-container">
    <div class="filter-container">
      <div class="buttons">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleCreate">
          {{authBtns.filter(i => i.idName=='addbtn')[0].name}}
          <i
            v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon"
            :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"
          ></i>
        </el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('delbtn') >= 0" @click="massDelete">
          {{authBtns.filter(i => i.idName=='delbtn')[0].name}}
          <i
            v-if="authBtns.filter(i => i.idName=='delbtn').length>0 && authBtns.filter(i => i.idName=='delbtn')[0].icon"
            :class="[authBtns[authBtns.map(i => i.idName).indexOf('delbtn')].icon, 'el-icon--right']"
          ></i>
        </el-button>
        <!-- <el-button @click="handleCreate">添加</el-button>
        <el-button @click="massDelete">删除</el-button>-->
      </div>
    </div>

    <tree-table
      :data="list"
      :evalFunc="func"
      :evalArgs="args"
      :expandAll="expandAll"
      border
      v-loading="listLoading"
      :getFormatData="getFormatData"
      :par-selection="handleSelectionChange"
      label-name="模块名称"
      stripe
      first-column="moduleName"
    >
      <el-table-column align="center" label="跳转地址" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="模块排序" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="模块代号" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" :title="authBtns.filter(i => i.idName=='editbtn')[0].name" @click="handleUpdate(scope.row)" ></i>
          <i :class="authBtns.filter(i => i.idName=='addbtn2')[0].icon" v-if="authBtns.filter(i => i.idName=='addbtn2').length > 0" :title="authBtns.filter(i => i.idName=='addbtn2')[0].name" @click="handleCreateChild(scope.row)"></i>-->
          <!-- <el-button @click="handleUpdate(scope.row)">修改</el-button> -->
          <!-- <i class="el-icon-edit" @click="handleUpdate(scope.row)" title="修改"></i> -->
          <i
            :class="authBtns.filter(i => i.idName=='editbtn')[0].icon"
            v-if="authBtns.filter(i => i.idName=='editbtn').length > 0"
            :title="authBtns.filter(i => i.idName=='editbtn')[0].name"
            @click="handleUpdate(scope.row)"
          ></i>
          <i
            :class="authBtns.filter(i => i.idName=='addbtn2')[0].icon"
            v-if="authBtns.filter(i => i.idName=='addbtn2').length > 0"
            :title="authBtns.filter(i => i.idName=='addbtn2')[0].name"
            @click="handleCreateChild(scope.row)"
          ></i>
          <!-- <el-button @click="handleCreateChild(scope.row)">新增</el-button> -->
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="margin-right:10px;"
      >
        <el-form-item v-if="dialogStatus=='createChild'" label="父级模块：" prop="parentName">
          <el-input v-model="parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="模块名称：" prop="moduleName">
          <el-input v-model="temp.moduleName"></el-input>
        </el-form-item>
        <el-form-item label="跳转url：" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item label="模块排序：" prop="sort">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button
          type="primary"
          v-if="dialogStatus=='update'"
          @click="updateData"
          :loading="loading"
        >保存</el-button>
        <el-button type="primary" v-else @click="createData" :loading="loading">添加</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import treeTable from "@/components/TreeTable";
import treeToArray from "@/views/example/table/treeTable/customEval";
import {
  getListAPI,
  updateAPI,
  deleteAPI,
  addAPI
} from "@/api/authorization-management/module";
import getTreeId from "@/filters/getTreeid";
import { operationMsg, confirm } from "@/utils/publicFunctions";
import { getMaxSort } from "@/filters/getIds";
import store from "@/store";
export default {
  name: "module_management",
  components: { treeTable },
  data() {
    const validateName = (rule, value, callback) => {
      if (value.replace(/\s+/g, "") == "") {
        callback(new Error("请填写模块名称"));
      } else {
        callback();
      }
    };
    return {
      authBtns: [],
      func: treeToArray,
      expandAll: false,
      list: [],
      listLoading: true,
      parentName: "",
      temp: {
        moduleName: "",
        url: "",
        sort: "",
        pid: 0
      },
      formatList: [],
      maxSort: 0,
      ids: [],
      textMap: {
        update: "修改模块",
        create: "添加模块",
        createChild: "添加子模块"
      },
      rules: {
        moduleName: [
          {
            type: "string",
            required: true,
            trigger: "blur",
            validator: validateName
          }
        ],
        url: [
          {
            type: "string",
            required: true,
            trigger: "blur",
            validator: validateName
          }
        ],
        sort: [
          {
            type: "string",
            required: true,
            trigger: "blur",
            pattern: /^([1-9]\d*|0)$/,
            message: "请输入0及正整数表示的排序号"
          }
        ]
      },
      dialogStatus: "",
      loading: false,
      dialogFormVisible: false,
      multipleSelection: [],
      args: [null, null, "timeLine"]
    };
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    this.getList();
  },
  methods: {
    getFormatData(data) {
      this.formatList = data;
    },
    // 获取列表
    getList() {
      this.listLoading = true;
      getListAPI().then(response => {
        if (response.data.code === 0) {
         
          const originalArr = [];
          if(response.data.data.length>0){
             response.data.data.map(res => {
               originalArr.push(res);
             })
          }
          const originalData = JSON.stringify(originalArr);
          if(originalArr.length>0){
            if(originalArr[0].children.length>0){
             
              this.list = JSON.parse(originalData.replace(/mpId/gi, "id"));
            }else{
              this.list=[]
            }
          }else{
            this.list=[]
          }
          
          this.multipleSelection = []; //清空

        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    massDelete() {
      if (this.multipleSelection.length != 0) {
        confirm.apply(this, ["确认删除选择的模块吗？"]).then(() => {
          deleteAPI(this.ids).then(res => {
            operationMsg.apply(this, [
              res.data,
              `批量删除${this.multipleSelection.length}项`
            ]);
          });
        });
      } else {
        this.$message.warning("请先选择需要删除的内容");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length > 0 ? (this.ids = getTreeId(this.multipleSelection, "children"))  : true;    
    },
    resetTemp() {
      this.temp = {
        moduleName: "",
        url: "",
        sort: this.maxSort,
        pid: 0
      };
    },
    handleCreate() {
      this.maxSort = getMaxSort(this.list);
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleCreateChild(row) {
      this.resetTemp();
      this.temp.pid = row.id;
      this.parentName = row.moduleName;
      this.dialogStatus = "createChild";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          addAPI(this.temp).then(res => {
            operationMsg.apply(this, [
              res.data,
              this.textMap[this.dialogStatus]
            ]);
            res.data.code === 0 ? (this.dialogFormVisible = false) : true;
            this.loading = false;
          });
        }
      });
    },
    handleUpdate(row) {
      let { id, pid, moduleName, sort, url } = row;
     
      this.temp = {  pid, moduleName, sort, url };
      this.temp.mpId=row.id
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      document.getElementsByClassName("form-submit").disabled = true;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          this.loading = true;
          updateAPI(tempData).then(res => {
            operationMsg.apply(this, [res.data, "模块更新"]);
            res.data.code === 0 ? (this.dialogFormVisible = false) : true;
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>
