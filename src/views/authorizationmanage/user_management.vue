<template>
  <div class="app-container project-plan">
    <div class="buttons">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleCreate">
        {{authBtns.filter(i => i.idName=='addbtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('setbtn') >= 0" @click="massSetting">
        {{authBtns.filter(i => i.idName=='setbtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='setbtn').length>0 && authBtns.filter(i => i.idName=='setbtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('setbtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>
    </div>
    <el-form inline class="form-inline formlist" label-width="82px">
      <el-form-item label="姓名" >
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话" >
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.phone" clearable></el-input>
      </el-form-item>
      <el-form-item label="部门" >
        <el-popover
          popper-class="category-popover"
          placement="bottom-start"
          trigger="click"
          v-model="visible"
          @show="selectChange"
        >
          <el-tree
            :data="departments"
            ref="searchTree"
            show-checkbox
            check-strictly
            node-key="departmentId"
            :props="defaultProps"
            @check="checkChange"
          ></el-tree>
          <el-select
            v-model="listQuery.deptId"
            slot="reference"
            popper-class="hidden-selection"
            clearable
            @clear="selectChange"
            placeholder="全部"
          >
            <el-option
              v-for="item in options"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="状态" >
        <el-select v-model="listQuery.status">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class='search' @click="handleFilter" icon="el-icon-search">检索</el-button><el-button class='is-plain' @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :key="tableKey"
      stripe
      :data="list"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      highlight-current-row
      @current-change="handleCurChange"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column min-width="150px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="120px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="180" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.registerDate}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="部门">
        <template slot-scope="scope">
          <!--求别删！！！！！！！！！-->
          <span v-if="scope.row.deptList.length>0">
            <span v-for="(item, index) in scope.row.deptList" :key="index">
              <span v-if="index === 0">{{item&&item.deptName}}</span>
              <span v-else>，{{item&&item.deptName}}</span>
            </span>
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="角色">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.roleList" :key="index">
            <span v-if="index === 0">{{item&&item.roleName}}</span>
            <span v-else>，{{item&&item.roleName}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" style="color:#CC6600;">禁用</span>
          <span v-else-if="scope.row.status === 1" style="color:#008000;">启用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i
            :class="authBtns.filter(i => i.idName=='editbtn')[0].icon"
            v-if="authBtns.filter(i => i.idName=='editbtn').length > 0"
            :title="authBtns.filter(i => i.idName=='editbtn')[0].name"
            @click="handleUpdate(scope.row)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="right"
        label-width="140px"
        style="margin-right:20px;"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="userName">
          <el-input v-model="temp.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :prop="dialogStatus=='update'?'password':'4444444'">
          <el-input v-model="temp.password"  @focus="changePass" type="password"></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认密码：" prop="surepassword">
          <el-input v-model="surePassWord" clearable type="password"></el-input>
        </el-form-item> -->
        <el-form-item label="电话：" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
        <el-form-item label="部门（可多选）：" prop="deptList">
          <!-- <el-popover popper-class="category-popover popover400" placement="bottom-start" trigger="click">
            <el-tree
              :data="departments"
              ref="tree"
              show-checkbox
              check-strictly
              node-key="departmentId"
              :default-checked-keys="temp.dept"
              :props="defaultProps"
              @check="setSelect"
            ></el-tree>
              @remove-tag="setTree"
              popper-class="hidden-selection"
              slot="reference"-->
            <el-select
              v-model="temp.deptList"
              value-key="deptId"
              multiple
              style="width:100%;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.deptId"
                :label="item.deptName"
                :value="item"
              ></el-option>
            </el-select>
          <!-- </el-popover> -->
        </el-form-item>
        <el-form-item label="角色（可多选）：" prop="roleList">
          <el-select
            v-model="temp.roleList"
            multiple
            value-key="roleId"
            style="width:100%;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="超级管理员：" prop="isAdmin">
          <el-radio-group v-model="temp.isAdmin">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户头像:">
          <el-upload
            :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
            list-type="picture-card"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :disabled="uploading"
            :on-remove="handleRemove"
            :show-file-list="false"
          >
            <img
              v-if="temp.topImg"
              :src="`${this.domain}${this.requestPath.file}?fileName=${temp.topImg}&isOnLine=true`"
              class="avatar"
            >
            <img src="../../assets/img/info.jpg" v-else class="avatar">
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          </el-upload>
          <el-button class="resetBtn" size="mini" @click="reset" round>重置</el-button>
          <span class="tip">仅支持jpg、jpeg、png、gif格式，不超过2M。</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="dialogStatus=='create'" @click="createData" :loading="sending">保存</el-button>
        <el-button type="primary" v-else @click="updateData" :loading="sending">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPvVisible" width="30%">
      <el-form>
        <el-form-item label="用户状态：">
          <el-radio-group v-model="massQuery.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='setting'" @click="massSettingSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getListAPI,
  addAPI,
  batchUpdateAPI,
  getRolesAPI,
  getDepartmentsAPI,
  isExistAPI,
  getuserAPI,
  getUserMasAPI
} from "@/api/authorization-management/user";
import { operationMsg } from "@/utils/publicFunctions";
import { getMultipleSelectionIDs } from "@/filters/getIds";
import { formatOptions } from "@/utils/format";
import store from "@/store";
import "@/styles/resource.scss";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import md5 from 'blueimp-md5';
export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (value.replace(/\s+/g, "") == "") {
        callback(new Error("请填写真实姓名"));
      } else if (value.length > 20 || value.length < 0) {
        callback(new Error(`姓名长度为0-20`));
      }else{
        callback()
      }
      
    };
            
    const validateUserName = (rule, value, callback) => {
      let reguser=/^[a-zA-Z0-9-_]{4,20}$/;
      if (value.length > 20 || value.length < 4) {
        callback(new Error(`用户名长度为4-20`));
      }else if (!reguser.test(value)) {
        callback(new Error(`请输入数字、字母、“-”、“_”的组合`));
      }else {
        let params = { userName: value };
        this.dialogStatus === "update"
          ? (params.id = this.temp.userId)
          : params;
        isExistAPI(params).then(res => {
          res.data.code === 0
            ? res.data.data === false
              ? callback()
              : callback(new Error(`该用户已存在`))
            : callback(new Error(`错误Error：${res.data.msg}`));
        });
      }
    };
    
    const validatePwd = (rule, value, callback) => {
      let regPwd = /^[a-zA-Z0-9-_~\!\@\#\$\%\^\&\*\(\)\+\=]{6,50}$/;
      if(value){
        if (value.length > 50 || value.length < 6) {
          callback(new Error(`密码长度为6-50`));
        } else if (!regPwd.test(value)) {
          callback(
            new Error("请使用字母、数字或符号“~!@#$%^&*()_+-=”的组合，6-50个字符")
          );
        } else {
          callback();
        }
      }else{
        if(this.dialogStatus=='update'){
          callback();
        }else if(this.dialogStatus=='create'){
          callback(
            new Error("请输入密码")
          );
        }
      }
      
    };
    
    const validatePhone = (rule, value, callback) => {
      let telreg = /^(13\d|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18\d|19[89])\d{8}$/;
      if(value.length>0){
        if (value.length > 11) {
          callback(new Error(`请填写11位手机号`));
        } else if (!telreg.test(value)) {
          callback(new Error(`请输入正确的手机号`));
        }else{
          callback();
        }
      }else {
        callback();
      }
    };
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      uploading: false,
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        userName: null,
        phone: null,
        deptId: null,
        status: null
      },
      massQuery: {
        ids: [],
        status: 1
      },
      temp: {},
      surePassWord: "",
      // checkedIds:[],
      visible: false,
      options: [],
      roles: [],
      departments: [],
      defaultProps: {
        children: "list",
        label: "departmentName"
      },
      rules: {
        userName: [
          {
            type: "string",
            required: true,
            validator: validateUserName
          }
        ],
        name:[
          {
            type: "string",
            required:true,
            validator: validateName
          }
        ],
        password: [
          {
            type: "string",
            required: true,
            validator: validatePwd
          }
        ],
        phone: [
          {
            type: "string",
            required: false,
            validator: validatePhone
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址"
          }
        ],
        deptList: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: "请选择部门"
          }
        ],
        roleList: [
          {
            type: "array",
            required: true,
            trigger: "change",
            message: "请选择角色"
          }
        ],
        isAdmin: [{ required: true }]
      },
      dialogFormVisible: false,
      dialogPvVisible: false,
      sending: false,
      dialogStatus: "",
      textMap: {
        setting: "设置状态",
        update: "修改用户",
        create: "添加用户"
      },
      multipleSelection: []
    };
  },
  mounted() {
    if (ifUndefined(store.getters.user_managementSerKeys.pageNum)) {
      this.listQuery = store.getters.user_managementSerKeys;
    }
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    this.getList();
    this.getRoles();
    this.getDepartments();
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    //聚焦密码，清空
    changePass(){
      this.temp.password=""
    },
    // 用户头像
    handlePreview(file) {
      this.imgUrl = file.url;
    },

    handleRemove(file, fileList) {
      this.imgUrl = "";
    },
    beforeUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return isJPG;
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
        return isLt3M;
      }
      this.uploading = true;
      this.$message.warning("上传中");
    },
    handleSuccess(res, file, fileList) {
      this.$message.success("上传成功");
      this.temp.topImg = res;
      this.uploading = false;
    },
    //重置
    reset() {
      this.temp.topImg = "";
      this.imgUrl = "";
    },
    // selectChange、checkChange搜索单选树
    selectChange() {
      this.$refs.searchTree.setCheckedKeys([]);
    },
    checkChange(data, obj) {
      const [deptId] = obj.checkedKeys;
      this.listQuery.deptId = deptId;
      this.visible = false;
    },
    // 改变Tree选中节点时修改select
    setSelect(data, obj) {
      this.temp.deptList = obj.checkedNodes.map(item => {
        const { departmentId: deptId, departmentName: deptName } = item;
        return { deptId, deptName };
      });
    },
    // 删除多选标签设置Tree的选中节点
    setTree(tag) {
      if (this.temp.deptList.length > 0) {
        const checkedKeys = getMultipleSelectionIDs(
          this.temp.deptList,
          "deptId"
        );
        this.$refs.tree.setCheckedKeys(checkedKeys);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    handleCurChange(val) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val);
    },
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    getRoles() {
      getRolesAPI().then(res => {
        res.data.code === 0
          ? (this.roles = res.data.data)
          : this.$message.error("获取全部角色失败");
      });
    },
    getDepartments() {
      getDepartmentsAPI().then(res => {
        if (res.data.code === 0) {
          this.departments = res.data.data;
          console.log(this.departments,"this.departments6666666666")
          this.options = formatOptions(this.departments);
        } else {
          this.$message.error("获取全部部门失败");
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length > 0
        ? (this.massQuery.ids = getMultipleSelectionIDs(
            this.multipleSelection,
            "userId"
          ))
        : true;
    },
    handleUpdate(row) { 
        getUserMasAPI(row.userId).then( res => {
        if(res.data.code==0){
          this.temp = Object.assign({},res.data.data); // copy obj
          //记录返回的密码
          this.surePassWord=this.temp.password
          this.temp.dept = getMultipleSelectionIDs(this.temp.deptList, "deptId");
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedKeys(this.temp.dept);
          }
          this.dialogStatus = "update";
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate();
          })
        }
      })      
    },
    
    resetTemp() {
      this.temp = {
        userName: "",
        name: "",
        password: "123456",
        email: "",
        phone: "",
        isAdmin: 0,
        status: 1,
        deptList: [],
        roleList: [],
        topImg:null
      };
    },
    handleCreate() {
      // this.surePassWord="123456"
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.sending = true;
          if(this.surePassWord!=this.temp.password){
              this.temp.password = (md5(this.temp.password)).toUpperCase()
          }
          const {email,isAdmin,phone,status,userId, userName, name ,topImg} = this.temp;
          let tempData = {email, isAdmin, phone, status, userId, userName, name ,topImg};
          if ( this.temp.password !== null &&this.temp.password !== undefined && this.temp.password !== "") {
            tempData.password = this.temp.password;        
          }
          tempData.deptId = getMultipleSelectionIDs(
            this.temp.deptList,
            "deptId"
          );
          tempData.roleId = getMultipleSelectionIDs(
            this.temp.roleList,
            "roleId"
          );
          addAPI(tempData).then(res => {
            operationMsg.apply(this, [res.data, "用户信息修改"]);
            if(res.data.code==0){
              this.dialogFormVisible = false;
              this.getList()
            }
            this.sending = false;
          });
        }
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if(this.temp.password){
            this.sending = true;
            //md5加密
            this.temp.password = (md5(this.temp.password)).toUpperCase()
            let { deptList, roleList, ...newTemp } = this.temp;
            newTemp.deptId = getMultipleSelectionIDs(
              this.temp.deptList,
              "deptId"
            );
            newTemp.roleId = getMultipleSelectionIDs(
              this.temp.roleList,
              "roleId"
            );
            addAPI(newTemp).then(res => {
              operationMsg.apply(this, [res.data, "新建用户"]);
              res.data.code === 0 ? (this.dialogFormVisible = false) : true;
              this.sending = false;
            });
            
          }else{
            this.sending = true;
            let { deptList, roleList, ...newTemp } = this.temp;
            newTemp.deptId = getMultipleSelectionIDs(
              this.temp.deptList,
              "deptId"
            );
            newTemp.roleId = getMultipleSelectionIDs(
              this.temp.roleList,
              "roleId"
            );
            addAPI(newTemp).then(res => {
              operationMsg.apply(this, [res.data, "新建用户"]);
              res.data.code === 0 ? (this.dialogFormVisible = false) : true;
              this.sending = false;
            });
          }
          
        }
      });
    },
    massSettingSubmit() {
      batchUpdateAPI(this.massQuery).then(res => {
        operationMsg.apply(this, [
          res.data,
          `批量设置`
        ]);
        res.data.code === 0 ? (this.dialogPvVisible = false) : true;
      });
    },
    massSetting() {
      if (this.multipleSelection.length > 0) {
        this.dialogStatus = "setting";
        this.dialogPvVisible = true;
        this.massQuery.status = 1;
      } else {
        this.$message.warning("请先选择需要设置的内容");
      }
    },
    resetFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        userName: null,
        phone: null,
        deptId: null,
        status: null
      };
      this.getList();
    },
    handleFilter() {
      store.dispatch("SetUserManagementSerKeys", this.listQuery).then(res => {
      });
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
  }
};
</script>

<style scoped>
/* .prfooter {
  width: calc(100vw - 200px);
} */
.avatar {
  width: 146px;
  height: 146px;
}
.el-tree{
  overflow: auto;
}
</style>
