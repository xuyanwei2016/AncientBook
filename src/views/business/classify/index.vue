<template>
  <div class="project-plan">
    <div class="plan-container">
      <aside  class="tree-aside" style="margin-botton:60px;">
        <!-- <span class="all" @click="getAllTree">全部</span> -->
        <el-tree
          :data="navTree"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          ref="treeBox"
          :highlight-current='true'
          :expand-on-click-node="false"
          @node-click="getCurrentNodes"
        >
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }"
            @mouseover="showIcon(data.typeName)"
          >
            <span>{{ data.typeName}}</span>&nbsp;&nbsp;&nbsp;
            <span v-if="data.typeName==moveShow">
              <i class="el-icon-delete" @click.stop="deleteNewCalss(data)"></i>&nbsp;&nbsp;
              <i class="el-icon-edit" @click.stop="editNewCalss(data)"></i>
            </span>
          </span>
        </el-tree>
        <span class="addClass" @click="addNewClass">
          <i class="el-icon-plus"></i>添加分类体系
        </span>
      </aside>

      <el-main>
        <div class="buttons">
          <el-button
            v-if="authBtns.map(i => i.idName).indexOf('btnadd') >= 0"
            @click="handleCreate"
          >
            {{authBtns.filter(i => i.idName=='btnadd')[0].name}}
            <i
              v-if="authBtns.filter(i => i.idName=='btnadd').length>0 && authBtns.filter(i => i.idName=='btnadd')[0].icon"
              :class="[authBtns[authBtns.map(i => i.idName).indexOf('btnadd')].icon, 'el-icon--right']"
            ></i>
          </el-button>
          <el-button
            v-if="authBtns.map(i => i.idName).indexOf('batchdelete') >= 0"
            @click="massDelete"
          >
            {{authBtns.filter(i => i.idName=='batchdelete')[0].name}}
            <i
              v-if="authBtns.filter(i => i.idName=='batchdelete').length>0 && authBtns.filter(i => i.idName=='batchdelete')[0].icon"
              :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchdelete')].icon, 'el-icon--right']"
            ></i>
          </el-button>
          <el-button @click="expandAll = true">全部展开</el-button>
          <el-button @click="expandAll = false">全部收起</el-button>
        </div>

        <tree-table
          :data="list"
          :evalFunc="func"
          :evalArgs="args"
          :expandAll="expandAll"
          border
          v-loading="listLoading"
          :getFormatData="getFormatData"
          label-name="分类名称"
          stripe
          first-column="typeName"
          :par-selection="handleSelectionChange"
        >
          <el-table-column align="center" label="排序号" min-width="70">
            <template slot-scope="scope">
              <span>{{scope.row.sort}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="旧编码" min-width="70">
            <template slot-scope="scope">
              <span>{{scope.row.oldCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="分类编号" min-width="80">
            <template slot-scope="scope">
              <span>{{scope.row.code}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <router-link
                :to="{path:`classify/recommended_goods`, query:{id:scope.row.id}}"
                v-if="authBtns.filter(i => i.idName=='recommend').length > 0"
              >
                <i
                  :class="authBtns.filter(i => i.idName=='recommend')[0].icon"
                  :title="authBtns.filter(i => i.idName=='recommend')[0].name"
                ></i>
              </router-link>
              <i
                :class="authBtns.filter(i => i.idName=='btnedit')[0].icon"
                v-if="authBtns.filter(i => i.idName=='btnedit').length > 0 && scope.row.parentId!='0'"
                @click="handleUpdate(scope.row)"
                :title="authBtns.filter(i => i.idName=='btnedit')[0].name"
              ></i>
              <i
                :class="authBtns.filter(i => i.idName=='addchild')[0].icon"
                v-if="authBtns.filter(i => i.idName=='addchild').length > 0"
                @click="handleCreateChild(scope.row)"
                :title="authBtns.filter(i => i.idName=='addchild')[0].name"
              ></i>
              <i
                :class="authBtns.filter(i => i.idName=='btnremove')[0].icon"
                v-if="authBtns.filter(i => i.idName=='btnremove').length > 0 && scope.row.parentId!='0'"
                @click="singleDelete(scope.row)"
                :title="authBtns.filter(i => i.idName=='btnremove')[0].name"
              ></i>
            </template>
          </el-table-column>
        </tree-table>
      </el-main>
    </div>
    <el-dialog @close="closedialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="margin-right:10px;"
      >
        <el-form-item v-if="dialogStatus=='createChild'" label="上级分类：" prop="parentName">
          <el-input v-model="parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称：" prop="typeName">
          <el-input v-model="temp.typeName" @input="handleShowname"></el-input>
        </el-form-item>
        <el-form-item label="显示名称：" prop="showName">
          <el-input v-model="temp.showName" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="分类编号：" prop="code">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>-->
        <el-form-item label="旧编码：" prop="oldCode">
          <el-input v-model="temp.oldCode"></el-input>
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-left:10px;color:#E59728;">
        1.前台分类使用”显示名称“
        <br>
        2.当前最大排序号为{{maxSort}}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="dialogStatus=='update' || dialogStatus=='updateChild'"
          @click="updateData"
          :loading="loading"
        >保存</el-button>
        <el-button type="primary" v-else @click="createData" :loading="loading">保存</el-button>
        <el-button @click="dialogFormVisible = false;" >取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加/修改分类体系对话框 -->
    <el-dialog :title="editOradd" :visible.sync="dialogClassifyVisible" @close="closedialogClassifyVisible" width="570px">
      <el-form
        :rules="ruleos"
        :model="classtemp"
        label-position="right"
        label-width="100px"
        style="margin-right:10px;"
        ref="classForm"
      >
        <!-- <el-form-item v-if="dialogStatus=='createChild'" label="上级分类：" prop="parentName">
          <el-input v-model="parentName" disabled></el-input>
        </el-form-item>-->
        <el-form-item label="分类标准:" prop="typeName">
          <el-input v-model="classtemp.typeName" style="width: 318px;"></el-input>
        </el-form-item>
        <el-form-item label="英文名称:" prop="englishName">
          <el-input v-model="classtemp.englishName" style="width: 318px;"></el-input>
        </el-form-item>
        <el-form-item label="适用数据:">
          <div v-for="(item,index) in classtemp.tsf" :key="index" style="margin-bottom:10px">
            <el-select
              style="float:left"
              v-model="item.resourceType"
              prop="applyData"
              @change="changeDataType"
            >
              <el-option label="全部" :value="allType"></el-option>
              <el-option
                v-for="(value,key) in typeList"
                :key="key"
                :label="value"
                :value="key"
              >{{value}}</el-option>
            </el-select>
            <el-input
              v-model="item.resourceTypeSort"
              prop="sort"
              style="float:left;width:108px;margin-left:10px"
              placeholder="排序号"

            ></el-input>&nbsp;&nbsp;
            <i class="el-icon-delete" @click="deleteTypeClass(index)"></i>
          </div>
        </el-form-item>
      </el-form>
      <!-- <div style='margin-left:10px;color:#E59728;'>
        1.前台分类使用”显示名称“<br>
        2.当前最大排序号为{{maxSort}}
      </div>-->
      <div class="addData" @click="addType">
        <span>
          <i class="el-icon-plus"></i>选择数据
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="dialogclassStatus=='update'" :disabled="ifDisabled" @click="updateclassData" :loading="classloading">保存</el-button>
        <el-button type="primary" v-else @click="createclassData" :disabled="ifDisabled" :loading="classloading">保存</el-button>
        <el-button @click="dialogClassifyVisible = false">取消</el-button>
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
  getClassify,
  getStair,
  updateClassify,
  addClassify,
  deleteClassify,
  isExist,
  codeExist,
  getNameDiyAPI,
  getMaxOrderNumAPI
} from "@/api/website-management/classify";
import getTreeId from "@/filters/getTreeid";
import { operationMsg, confirm } from "@/utils/publicFunctions";
import store from "@/store";
import { getTypeAPI } from "@/api/resource/common";
export default {
  name: "customTreeTableDemo",
  components: { treeTable },
  data() {
    const validateName = (rule, value, callback) => {
      let classOrstant = "";
      if (this.dialogFormVisible) {
        classOrstant = "分类名称";
      } else {
        classOrstant = "分类标准";
      }
      if (value.length > 20) {
        callback(new Error(`${classOrstant}必须小于20位！`));
      } else if (value.replace(/\s+/g, "") == "") {
        callback(new Error(`请输入${classOrstant}`));
      } else {
        let params = { typeName: value, parentId: this.temp.parentId };
        this.dialogStatus === "update" || this.dialogStatus === "updateChild"
          ? (params.id = this.temp.id)
          : params;
        isExist(params).then(res => {
          res.data.code === 0
            ? res.data.data === false
              ? callback()
              : callback(new Error(`${classOrstant}"${value}"已存在！`))
            : callback(new Error(`错误Error：${res.data.msg}`));
        });
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value) {
        if (/^\w+$/.test(value)) {
          let params = { oldCode: value };
          this.dialogStatus === "update" || this.dialogStatus === "updateChild"
            ? (params.id = this.temp.id)
            : params;
            codeExist(params).then(res => {
              if(res.data.code==0){
                if(res.data.data==true){
                  callback(new Error(`旧编码已存在！`))
                }else{
                  callback()
                }
              }else{
                this.$message.error('服务器异常')
              }
            });
        } else {
          callback("请输入数字字母下划线");
        }
      }else{
        callback()
      }
    };
    const validateShowName = (rule, value, callback) => {
      if (value) {
        if (value.length > 20) {
          callback(new Error(`显示名称必须小于20位！`));
        }else{
          callback()
        }
      }else{
        callback(new Error(`请输入显示名称`));
      }
    };
    return {
      dialogclassStatus: "creat",
      authBtns: [],
      func: treeToArray,
      expandAll: true,
      typeList: [],
      allType: "",
      list: [],
      listLoading: true,
      editOradd: "", //添加或修改分类体系
      moveShow: "",
      temp: {
        typeName: "",
        showName: "",
        parentId: 0,
        sort: null,
        applyData: ""
      },
      classtemp: {
        tsf: [
          {
            resourceTypeSort: "",
            resourceType: ""
          }
        ],
        englishName: "",
        typeName: "",
        parentId: "0"
      },
      parentName: "",
      formatList: [],
      maxSort: 0,
      ids: [],
      textMap: {
        update: "修改分类",
        updateChild: "修改子分类",
        create: "添加分类",
        createChild: "添加子分类"
      },
      outerId:null,
      ruleos:{
        typeName: [
          {
            type: "string",
            required: true,
            validator: validateName
          }
        ],
        englishName:[
          {max:20,message:"英文名称必须小于20位"}
        ]
      },
      rules: {
        typeName: [
          {
            type: "string",
            required: true,
            validator: validateName
          }
        ],
        showName: [
          {
            type: "string",
            required: true,
            validator: validateShowName
          }
        ],
        oldCode: [
          {
            required: false,
            validator: validateCode
          },
          {
            max:40,
            message:'旧编码必须小于40位'
          }
        ],
        sort: [
          {required: true,message:'请输入排序号'},
          {
            pattern: /^([1-9]\d{0,8}|0)$/,
            message: "请输入0-999999999之间的整数"
          }
        ]      
      },
      dialogStatus: "",
      dialogFormVisible: false,
      dialogClassifyVisible: false,
      multipleSelection: [],
      loading: false,
      classloading:false,
      args: [null, null, "timeLine"],
      navTree: [],
      defaultProps: {
        children: "list",
        label: "showName"
      },
      treeName: "",
      ifDisabled:false
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  mounted() {
    this.getStairClassify();
    
    this.getType();
  },
  methods: {
    //改变数据类型
    changeDataType(val){
      this.ifDisabled=false;
      if(this.classtemp.tsf.length>1){
        for (let i=0 ; i<this.classtemp.tsf.length-1; i++){
          if(val==this.classtemp.tsf[i].resourceType){
            this.$message.warning('资源重复')
            this.ifDisabled=true;
          }
        }
      }     
    },
    //获取最大排序号
    getMaxSort(){
      getMaxOrderNumAPI(this.temp.parentId).then( res=> {
        if(res.data.code==0){
          this.maxSort=res.data.data
          this.temp.sort=res.data.data+1
        }
      })
    },
    handleShowname() {
      this.temp.showName = this.temp.typeName;
    },
    handleclassShowname() {
      this.classtemp.englishName = this.classtemp.typeName;
    },
    getFormatData(data) {
      this.formatList = data;
    },
    getList() {
      this.listLoading = true;      
      getNameDiyAPI(this.showName).then(response => {
        if (response.data.code === 0) {
          const originalArr = [];
          if(response.data.data!=null&&response.data.data!='null'){//加层保护，避免报错，阻断代码执行
            response.data.data.map(res => {
              if(res.list!=null&&res.list!="null"){//注释类型判断，不然报错，阻断执行
                if (res.list.length > 0) { 
                  originalArr.push(res);
                }
              }
            });
          }
          const originalData = JSON.stringify(originalArr);
          if(originalArr.length>0){
            this.list=[];//初始化，在赋值；
            if(originalArr[0].list!=null&&originalArr[0].list!='null'){
              if(originalArr[0].list.length>0){
                this.list = JSON.parse(originalData.replace(/list/gi, "children"))[0].children;
              }else{
                this.list=[]
              }
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
      console.log(this.list,'list.length')
    },
    getAlllist() {
      this.listLoading = true;
      getClassify().then(response => {
        if (response.data.code === 0) {
          const originalArr = [];
          response.data.data.map(res => {
            
            if (res.list.length > 0) {
              originalArr.push(res);
            }
          });
          const originalData = JSON.stringify(originalArr);

          this.list = JSON.parse(originalData.replace(/list/gi, "children"));

          this.multipleSelection = []; //清空
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    //关闭
    closedialog() {
      this.resetTemp(); //清空
    },
    //关闭添加分类标准
    closedialogClassifyVisible() {
      this.resetclassTemp();
      this.$refs['classForm'].resetFields()
      this.ifDisabled=false;
    },
    //批量删除
    massDelete() {
      console.log(this.multipleSelection,'批量删除')
      if (this.multipleSelection.length > 0) {
        confirm.apply(this, ["确定要删除选择的分类吗?"]).then(() => {
          deleteClassify(this.ids).then(res => {
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
    //单条删除
    singleDelete(row) {
      let ids = getTreeId([row], "children");
      confirm.apply(this, ["确定要删除选择的分类吗?"]).then(() => {
        deleteClassify(ids).then(res => {
          operationMsg.apply(this, [res.data, "删除"]);
        });
      });
    },
    handleSelectionAll(val) {//全选的方法
      this.multipleSelection = val;
      this.multipleSelection.length > 0 ? (this.ids = getTreeId(this.multipleSelection, "children")) : true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val,'heheh')
      this.multipleSelection.length > 0 ? (this.ids = getTreeId(this.multipleSelection, "children")) : true;
      console.log(this.ids,'555')
    },
    resetTemp() {
      this.temp.typeName=""
      this.temp.showName=""
      this.temp.oldCode=""
      this.temp.sort=""
    },
    resetclassTemp() {
      this.classtemp = {
        tsf: [
          {
            resourceTypeSort: "",
            resourceType: this.allType
          }
        ],
        englishName: "",
        typeName: "",
        parentId: "0"
      };
    },
    handleCreate() {
      if (this.treeName) {
        this.temp.parentId=this.outerId;//重置为左侧分类的id
        this.getMaxSort();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      } else {
        this.$message.warning("请选择分类体系");
      }
    },
    handleCreateChild(row) {
      this.temp.parentId = row.id;
      this.parentName = row.showName;
      this.getMaxSort();
      this.dialogStatus = "createChild";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
       this.$refs["dataForm"].validate(valid => {
         if(valid){
            this.loading = true;
            addClassify(this.temp).then(res => {
              operationMsg.apply(this, [res.data, this.textMap[this.dialogStatus]]);
              res.data.status ? (this.dialogFormVisible = false) : true;
              this.loading = false;
              this.expandAll = true;
            });
         }
       })
      
    },
    handleUpdate(row) {
      let { createTime, parent, children, ...temp } = row;
      this.temp = temp;
      if (this.temp.parentId === "0") {
        this.dialogStatus = "update";
      } else {
        this.dialogStatus = "updateChild";
        // this.parentName = row.parent.showName
      }
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      // this.$refs["dataForm"].validate(valid => {
      //   if (valid) {
      this.loading = true;
      const tempData = Object.assign({}, this.temp);
      updateClassify(tempData).then(res => {
        operationMsg.apply(this, [res.data, this.textMap[this.dialogStatus]]);
        res.data.code === 0 ? (this.dialogFormVisible = false) : true;
        this.loading = false;
        this.expandAll = true;
      });
      //   }
      // });
    },
    // 获取左侧一级分类
    getStairClassify() {
      getStair().then(res => {
        if (res.data.code === 0) {
          if(res.data.data!='null'&&res.data.data!=null){
            if(res.data.data.length>0){
              this.navTree = res.data.data;
              this.$nextTick(() => {
                this.$refs['treeBox'].setCurrentKey(this.navTree[0].id);
              });
              this.showName = res.data.data[0].showName;
              this.treeName = res.data.data[0].showName;
              this.temp.parentId =res.data.data[0].id;
              this.getList();
            }
          }
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    //获取当前树节点
    getCurrentNodes(data) {
      console.log(data,'click1')
      this.treeName = data.showName;
      this.showName=data.showName;
      this.temp.parentId = data.id;
      this.outerId=data.id;//储存左侧的id，已保证再次点击头部添加，不是添加子分类
      getNameDiyAPI(this.treeName).then(response => {
        console.log(response,'click2')
        if (response.data.code == 0) {
          const originalData1 = JSON.stringify(response.data.data);
          if(response.data.data!=null&&response.data.data!="null"){//.length注意添加判断，不然报错后面的都无法执行
            this.list=[];//类似初始化，然后赋值
            if(response.data.data.length>0){
              if(response.data.data[0].list!=null&&response.data.data[0].list!='null'){//.length注意添加判断，不然报错后面的都无法执行
                if(response.data.data[0].list.length>0){
                  this.list = JSON.parse(originalData1.replace(/list/gi, "children"))[0].children;
                }else{
                  this.list=[]
                }
              }
            }else{
              this.list=[]
            }
          }
        }
      });
    },

    //划过图标
    showIcon(name) {
      this.moveShow = name;
    },
    //删除分类体系
    deleteNewCalss(val) {
      confirm.apply(this, ["确定要删除选择的分类吗?"]).then(() => {
        getNameDiyAPI(val.typeName).then(response => {
          if (response.data.code == 0) {
            let ids = getTreeId(response.data.data, "list");
            if(ids.length>0){
              ids=ids;
            }else{
              ids=[val.id]
            }
            deleteClassify(ids).then(res => {
              if (res.data.code == 0) {
                this.getStairClassify();
              } else {
                this.$message.error("重新获取失败");
              }
            });
          }
        });
      });
    },
    //编辑分类体系
    editNewCalss(val) {
      this.dialogclassStatus = "update";
      this.dialogClassifyVisible = true;
      this.editOradd = "修改分类体系";

      if (val.res.length > 0) {
        let arr2 = [];
        val.res.map((item, index) => {
          let obj = {
            resourceType: item.resourceType,
            resourceTypeSort: item.resourceTypeSort
          };
          arr2.push(obj);
        });
        this.classtemp.tsf = arr2;
      }
      this.classtemp.englishName = val.englishName;
      this.classtemp.typeName = val.typeName;
      this.classtemp.id = val.id;
    },
    //添加分类体系
    addNewClass() {
      this.editOradd = "添加分类体系";
      this.dialogclassStatus = "creat";
      this.dialogClassifyVisible = true;
      delete this.classtemp.id;
    },
    //添加一个分类需求
    addType() {
      let ifAll=this.classtemp.tsf.some(res=>{
          return res.resourceType==this.allType
      })
      if(ifAll){
        this.$message.warning('已选择全部分类')
        return
      }else{
        if(this.ifDisabled){
        this.$message.warning('资源重复,不可再次添加')
        }else if(this.classtemp.tsf.length>9){
          this.$message.warning('已选择全部数据类型')
        }else{
          this.classtemp.tsf.push({
            resourceTypeSort: "",
            resourceType: this.allType
          });
        }
        
      }
      
    },
    //删除一个分类需求
    deleteTypeClass(val) {
      this.ifDisabled=false;
      if (this.classtemp.tsf.length > 1) {
        this.classtemp.tsf.splice(val, 1);
      } else {
        this.$message.warning("至少保留一种分类体系");
      }
    },
    //获取资源类型列表
    // 资源类型列表
    getType() {
      getTypeAPI().then(res => {
        this.typeList = res.data.data;
        for (let ind in res.data.data) {
          this.allType += ind + ",";
        }
        this.allType = this.allType.slice(0, this.allType.length - 1);
        this.classtemp.tsf[0].resourceType = this.allType;
      });
    },
    //保存一级分类的添加和修改
    updateclassData() {
      this.$refs["classForm"].validate(valid => {
        if(valid){
          let ifAll=this.classtemp.tsf.some(res=>{
              return res.resourceType==this.allType
          })
          if(ifAll&&this.classtemp.tsf.length>1){
            this.$message.warning('已有全部分类，请删除其余分类')
          }else{
            this.classloading=true
            if (this.classtemp.typeName) {
              updateClassify(this.classtemp).then(res => {
                if (res.data.code == 0) {
                  this.dialogClassifyVisible = false;
                  this.getStairClassify();
                } else {
                  this.$message.error(`添加失败,${res.data.msg}`);
                }
                this.classloading=false
              });
            } else {
              this.$message.warning("请填写分类标准");
              this.classloading=false
            }
          }
        }else{
          this.$message.warning("有验证未通过");
          this.classloading=false
        }
      })   
    },
    createclassData() {
      this.$refs["classForm"].validate(valid => {  
        if(valid){
          let ifAll=this.classtemp.tsf.some(res=>{
              return res.resourceType==this.allType
          })
          if(ifAll&&this.classtemp.tsf.length>1){
            this.$message.warning('已有全部分类，请删除其余分类')
          }else{
            this.classloading=true;
            if (this.classtemp.typeName) {
              addClassify(this.classtemp).then(res => {
                if (res.data.code == 0) {
                  this.dialogClassifyVisible = false;
                  this.getStairClassify();
                } else {
                  this.$message.error(`添加失败,${res.data.msg}`);
                }
                this.classloading=false
              });
            } else {
              this.$message.warning("请填写分类标准");
              this.classloading=false
            }
          }
        }else{
           this.$message.warning('有验证未通过');
           this.classloading=false
        }
      })   
    }
    //获取全部分类
    // getAllTree() {
    //   this.treeName=this.showName = "";
    //   this.getAlllist()
    // }
  }
};
</script>

<style lang="less" scoped>
  .plan-container{
    display: flex;
  }
  // .dialogFormVisibleClass {
  //   background: white;
  //   border: 1px solid #ccc;
  //   color: #ccc;
  // }
  // .dialogFormVisibleClass:hover {
  //   background: #606266;
  //   color: white;
  //   border: 1px solid #606266;
  // }
  .planLeft {
    width: 300px;
  }
  .all {
    margin-left: 24px;
    color: #606266;
    cursor: pointer;
    width: 100%;
    display: inline-block;
    font-size: 14px;
  }
  .all:hover {
    background: #f5f7fa;
  }
  .addData {
    margin: 0 100px;
    display: inline-block;
    color: #666;
    i {
      color: #2196f3;
    }
    cursor: pointer;
  }
  .addClass {
    display: inline-block;
    color: #666;
    i {
      color: #2196f3;
    }
    cursor: pointer;
    margin: 20px 24px;
  }
  .el-icon-delete {
    cursor: pointer;
  }
  /deep/.el-tree-node{
    padding: 7px 0;
  }
  .custom-tree-node span:first-child{
    white-space: pre-line;
  }
</style>

<style>
.custom-tree-node {
  font-size: 14px;
}
</style>
