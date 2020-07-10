<template>
  <div class="app-container"  v-loading="pushing"  element-loading-text="正在推送...">
    <div class="buttons">
      <!-- <el-button icon="el-icon-circle-plus" @click="batchPushBs">批量推送百世</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchPushBsbtn') >= 0" @click="batchPushBs">
        {{authBtns.filter(i => i.idName=='batchPushBsbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchPushBsbtn').length>0 && authBtns.filter(i => i.idName=='batchPushBsbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchPushBsbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-document" @click="sendMessage">发短信</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('sendMessagebtn') >= 0" @click="sendMessage">
        {{authBtns.filter(i => i.idName=='sendMessagebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='sendMessagebtn').length>0 && authBtns.filter(i => i.idName=='sendMessagebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('sendMessagebtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-circle-plus" @click="exportExcel">导出明细清单</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('exportExcelbtn') >= 0" @click="exportExcel">
        {{authBtns.filter(i => i.idName=='exportExcelbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportExcelbtn').length>0 && authBtns.filter(i => i.idName=='exportExcelbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportExcelbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-circle-plus" @click="exportExcelTWo">导出汇总清单</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('exportExcelTWobtn') >= 0" @click="exportExcelTWo">
        {{authBtns.filter(i => i.idName=='exportExcelTWobtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='exportExcelTWobtn').length>0 && authBtns.filter(i => i.idName=='exportExcelTWobtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('exportExcelTWobtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>
    <transition-group name="custom-classes-transition" enter-active-class="animated">
      <el-form inline class="form-inline" :key="moreFilter">

        <el-form-item label="配货单类型">
        <el-select v-model="value5" multiple placeholder="请选择">
          <el-option
            v-for="item in optionsVal"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>


        <!--<el-form-item label="配货单类型">-->
          <!--<el-select v-model="listQuery.status">
            <el-option :value="null" label="全部"></el-option>
            <el-option :value="0" label="待发货"></el-option>
            <el-option :value="-1" label="推送失败"></el-option>
            <el-option :value="-2" label="发货失败"></el-option>
            <el-option :value="-3" label="用户拒收"></el-option>
            <el-option :value="1" label="已推送"></el-option>
            <el-option :value="2" label="已发货"></el-option>
            <el-option :value="3" label="已发货"></el-option>
            <el-option :value="4" label="已取消"></el-option>
            <el-option :value="-4" label="取消失败"></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="订单号">
          <el-input  placeholder="订单号、配货单号" v-model="listQuery.orderCode" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('orderCode')"></el-button>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="配货单号">
          <el-input  placeholder="配货单号" v-model="listQuery.code" clearable></el-input>
        </el-form-item> -->
        <template v-if="moreFilter" >
          <el-form-item label="下单会员">
            <el-input  placeholder="下单会员" v-model="listQuery.createrName" clearable></el-input>
          </el-form-item>
          <el-form-item label="书代号">
            <el-input  placeholder="书代号" v-model="listQuery.goodsAttr1" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input  placeholder="手机号" v-model="listQuery.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="收货人名">
            <el-input  placeholder="收货人名" v-model="listQuery.receiverName" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="发货地区">
            <el-input  placeholder="发货地区" v-model="listQuery.address" clearable></el-input>
          </el-form-item>
          <el-form-item label="导出状态">
            <el-select v-model="listQuery.exportStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已导出" value="1"></el-option>
              <el-option label="未导出" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开票状态">
            <el-select v-model="listQuery.invoiceStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已开票" :value="1"></el-option>
              <el-option label="未开票" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否需要开发票">
            <el-select v-model="listQuery.needInvoice">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号">
            <el-input  placeholder="快递单号" v-model="listQuery.courierNumber" clearable></el-input>
          </el-form-item>

          <el-form-item label="商品分类：" prop="categoryCodes"><!--listQuery.categoryCode-->
            <el-popover popper-class="category-popover" placement="bottom-start" trigger="click">
              <el-tree :data="navTree" ref="tree" show-checkbox check-strictly node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect" ></el-tree>
              <el-select v-model="categoryCodes" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:100%;" placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>

        </template>
        <!-- <template v-if="!moreFilter">
          <el-form-item label="综合搜索">
            <el-input placeholder="可输入配货单号、书代号、手机号" v-model="listQuery.conds" clearable class="once-search-input"></el-input>
          </el-form-item>
        </template> -->







        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button @click="moreFilter = !moreFilter">{{moreFilter ? '简洁' : '更多' }}<i :class="moreFilter ? 'el-icon-arrow-up' : 'el-icon-arrow-down' "></i></el-button>
        </el-form-item>
      </el-form>
    </transition-group>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" ref="multipleTable"  v-show="!pushing">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column label="配货单号" align="center">
        <template slot-scope="scope">
          <router-link class="bookLink" v-if="true" :to="{path: 'pick_order/pick_processing', query: {id: scope.row.id}}">{{scope.row.code}}</router-link>
          <span v-else>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          <router-link class="bookLink" :to="{path: 'order/order_processing', query: {id: scope.row.orderId}}">{{scope.row.orderCode}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="收货人姓名" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.receiverName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单会员" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否开票" align="center">
        <template slot-scope="scope">
          <span>{{invoiceText[scope.row.needInvoice]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="配货单状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否导出" align="center">
        <template slot-scope="scope">
          <span>{{exportText[scope.row.exportStatus]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.storageLocation}}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际运费" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.carriage}}</span>
        </template>
      </el-table-column>
      <el-table-column label="配货单日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width operationBtns" label="操作" align="center">
        <template slot-scope="scope">
          <ul style="padding:0;">
            <li style="">
              <!-- <router-link :to="{path: 'pick_order/pick_processing', query: {id: scope.row.id}}">配货单处理</router-link> -->
            <router-link :to="{path:`pick_order/pick_processing`, query: {id: scope.row.id}}" v-if="authBtns.filter(i => i.idName=='pickbtn').length > 0">{{authBtns.filter(i => i.idName=='pickbtn')[0].name}}
          </router-link>
            </li>
            <li v-if="(authBtns.map(i => i.idName).indexOf('pushBsbtn') >= 0)&&(scope.row.statusZh === '待发货' || scope.row.statusZh === '推送失败')"   @click="pushBs(scope.row.id)">{{authBtns.filter(i => i.idName=='pushBsbtn')[0].name}}</li>

            <li v-if="(authBtns.map(i => i.idName).indexOf('cancelbtn') >= 0)&&(scope.row.statusZh === '待发货' || scope.row.statusZh === '已推送' || scope.row.statusZh === '发货失败')" @click="cancel(scope.row.id,scope.row.status)">{{authBtns.filter(i => i.idName=='cancelbtn')[0].name}}</li>
            <li v-if="(authBtns.map(i => i.idName).indexOf('sendFailbtn') >= 0)&&(scope.row.statusZh === '推送失败')" @click="sendFail(scope.row.id)" >{{authBtns.filter(i => i.idName=='sendFailbtn')[0].name}}</li>
            <!-- <li v-if="scope.row.statusZh === '已推送' || scope.row.statusZh === '取消失败'" @click="pushBsSec(scope.row.id)">二次推送百世</li> -->
            <li v-if="(authBtns.map(i => i.idName).indexOf('cancelPushbtn') >= 0)&&(scope.row.statusZh === '取消失败')" @click="cancelPush(scope.row.id)">{{authBtns.filter(i => i.idName=='cancelPushbtn')[0].name}}</li>
            <li v-if="(authBtns.map(i => i.idName).indexOf('refusebtn') >= 0)&&(scope.row.statusZh === '已发货')" @click="refuse(scope.row.id)">{{authBtns.filter(i => i.idName=='refusebtn')[0].name}}</li>
            <li v-if="(authBtns.map(i => i.idName).indexOf('signbtn') >= 0)&&(scope.row.statusZh === '已发货')" @click="handleSign(scope.row.id)">{{authBtns.filter(i => i.idName=='signbtn')[0].name}}</li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>
    <el-dialog :title="`输入查询的订单号`" :visible.sync="showTextVisible">
      <el-input type="textarea" v-model="Ttextarea" :autosize="{minRows: 6}" placeholder=""></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="submitText">确定</el-button>
        <el-button type="info" @click="showTextVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
  .ib{
    display:inline-block;
  }
  .operationBtns ul li{
    text-align: center;
  }
</style>

<script>
import queryString from 'query-string'
import { getMultipleSelectionIDs } from '@/filters/getIds'
import {
  sendMessageAPI, signInAPI,
  getListAPI,
  cancelAPI,
  sendFailAPI,
  cancelPushAPI,
  pushBsAPI,
  refushAPI,
  orderDetailAPI,
  getStatusHisByIdAPI,
  getRemarkByIdAPI,
  remarkHistoryAPI,
  changeOrderInfoAPI,
  // getListFuzzyAPI
} from '@/api/order/pickorder';
import {getNavAPI, getOptionAPI} from '@/api/order/order';
import { operationMsg, requestMsg, confirm, errorMsg } from '@/utils/publicFunctions'
import { requestPath } from '@/utils/global'
import store from '@/store'

export default {
  data() {
    return {
      authBtns: [],
      navTree: [],
      optionsVal: [{
        value: 'null',
        label: '全部'
      },{
        value: '0',
        label: '待发货'
      }, {
        value: '-1',
        label: '推送失败'
      }, {
        value: '-2',
        label: '发货失败'
      }, {
        value: '-3',
        label: '用户拒收'
      }, {
        value: '1',
        label: '已推送'
      }, {
        value: '2',
        label: '已发货'
      }, {
        value: '3',
        label: '已签收'
      }, {
        value: '4',
        label: '已取消'
      }, {
        value: '-4',
        label: '取消失败'
      }],
      options:[],
      value5: [],
      popoverVisible: false,
      pushing:false,
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      statusHis:[],
      orderRemark:'',
      newOrderRemark:'',
      orderInfoId:0,
      receiverForm:{
      },
      rules:{
        consigneeName:[
          { required: true, pattern:/^[\u4e00-\u9fa5]{2,5}$/,message: '请输入正确的收货人', trigger: 'blur' }
        ],
        address:[
          { required: true, pattern:/^[\u4e00-\u9fa5]{2,40}$/,message: '请输入正确的地址', trigger: 'blur' }
        ],
        phone:[
          { required: true, pattern:/^1[3|5|7|8|]\d{9}$/,message: '请输入正确的手机号', trigger: 'blur' }
        ],
        tel:[
          { required: true, pattern:/^\d{11}$/,message: '请输入正确的电话号码', trigger: 'blur' }
        ],
        mail:[
          {
            required:false, pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,message:'请输入正确的Email', trigger:'blur'
          }
        ],
        title:[
            {
              required:false, pattern:/^.{4,50}$/,message:'请输入正确的抬头', trigger:'blur'
            }
        ],
        identity:[
            {
              required:false,pattren:/^.{10,40}$/,message:'请输入正确的识别号', trigger:'blur'
            }
        ]
      },
      mapJson: '../src/utils/map.json', //mapJson,//'{"110000":"北京市"}',
      bookNum:0,
      subtotal:0,
      orderGoods:{},
      orderDetail:{},
      cities:{
        province:[],
        sheng: [],
        shi: [],
        shi1: [],
        qu: [],
        qu1: [],
        city:[],
        block:[],
      },
      dialogVisible:false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        categoryCode: '',
        invoiceStatus: null,
        needInvoice:null,
        exportStatus: null,
        status: []
      },
      categoryCodes:[],
      multipleSelection: [],
      multipleSelectionIDs:[],
      textMap: {
        update: '修改库区',
        create: '添加库区'
      },
      invoiceText:['否','是'],
      exportText: ['未导出','已导出'],
      timeRange: [],
      listStatus: '',
      isBatchPushBsBtn:true,
      isSendMessageBtn:true,
      isResetFilterBtn:true,
      isHandleSignBtn:true,
      isExportExcelBtn:true,
      isExportExcelTWoBtn:true,
      isPushBsBtn:true,
      isCancelBtn:true,
      isSendFailBtn:true,
      isCancelPushBtn:true,
      isRefuseBtn:true,
      isHandleFilterBtn:true,
      showTextVisible: false,
      titleStatus: '',
      Ttextarea:'',
      navTree: [],
      checkedKeys: [],
    }
  },
created() {
  this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
},
  mounted() {
    if( ifUndefined(store.getters.pick_orderSerKeys.pageNum) ){
      this.listQuery = store.getters.pick_orderSerKeys
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeRange[0] = this.listQuery.startTime
        this.timeRange[1] = this.listQuery.endTime
      }
      console.log(this.listQuery,'读取搜索条件成功')
    }
    this.listQuery.categoryCode=null;
    this.getList()
    this.getNav()
    this.getOption()
  },
  watch:{
    moreFilter:function(){
      this.listQuery.conds = undefined
      // this.resetFilter()
    }
  },
  methods: {
    handleSign(id) {
      if(this.isHandleSignBtn){
        this.isHandleSignBtn=false;
        signInAPI({ids: [id]}).then(res => {
          requestMsg.apply(this, [res.data, '签收'])
          this.isHandleSignBtn=true;
        })
      }

    },
    exportExcel(){//导出excel
      if(this.value5.length>0){
        for(let i=0;i<this.value5.length;i++){
          this.listQuery.status=this.listQuery.status+this.value5[i]+','
        }
      }
      if(this.isExportExcelBtn){
        this.isExportExcelBtn=false;
        let {pageNum, pageSize, ...params} = this.listQuery
        let tempParams = {}
        for (const key in params) {
          if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
            tempParams[key] = params[key]
          }
        }
        let paramStr = queryString.stringify(tempParams)
        if (paramStr) {

          window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export/list-detail?${paramStr}`)
        } else {
          window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export/list-detail`)
        }
        this.isExportExcelBtn=true;

      }


      // paramStr ? window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export-all?${paramStr}`) : window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export-all`)
    },
    exportExcelTWo(){//汇总清单
      if(this.value5.length>0){
        for(let i=0;i<this.value5.length;i++){
          this.listQuery.status=this.listQuery.status+this.value5[i]+','
        }
      }
      if(this.isExportExcelTWoBtn){
        this.isExportExcelTWoBtn=false;
        let {pageNum, pageSize, ...params} = this.listQuery
        let tempParams = {}
        for (const key in params) {
          if (({}).hasOwnProperty.call(params, key) && params[key]!== null && params[key]!== '' && params[key]!== undefined) {
            tempParams[key] = params[key]
          }
        }
        let paramStr = queryString.stringify(tempParams)
        if (paramStr) {
          window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export-all?${paramStr}`)
        } else {
          window.open(`${process.env.BASE_API}${requestPath.order}/order-blank/export-all`)
        }
          this.isExportExcelTWoBtn=true;
      }

    },
    getList() {
      if(this.value5.length>0){
        for(let i=0;i<this.value5.length;i++){
          this.listQuery.status=this.listQuery.status+this.value5[i]+','
        }
      }

      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list;
          this.total = res.data.data.total;
          this.listQuery.status='';
        } else {
          this.$message.error('获取数据失败');
        }

        this.listLoading = false;
        this.isBatchPushBsBtn=true;
        this.isResetFilterBtn=true;
        this.isPushBsBtn=true;
        this.isHandleFilterBtn=true;
      })
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.status ? this.navTree = res.data.data : errorMsg.apply(this, [ res.data, `获取树形自定义分类` ])
      })

    },
    getOption(){
      getOptionAPI().then(res => {
        if (res.data.code === 0) {
          this.options = res.data.data.map(item => {
            let { id: diytypeid, ...temp } = item
            return {diytypeid, ...temp}
          })
        } else {
          this.$message.error(`获取分类选择器选项数据失败`)
        }
      })
    },
    setSelect(data, obj){
      this.categoryCodes = obj.checkedNodes.map(node => {
        return {diytypeid: node.id, code: node.code}
      })
    },
    // 删除多选标签设置Tree的选中节点
    setTree(tag){
      if (this.categoryCodes.length>0) {
        const checkedKeys = getMultipleSelectionIDs(this.categoryCodes,'diytypeid')
        this.$refs.tree.setCheckedKeys(checkedKeys)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    pushBs(id) {//推送百世
      if(this.isPushBsBtn){
        this.isPushBsBtn=false;
        confirm.apply(this,['确定要推送百世吗？']).then(() => {

          pushBsAPI([id]).then(res => {
            if (res.data.status) {
              if (res.data.data) {
                this.$notify.error({
                  title: '失败',
                  message: res.data.data,
                  duration: 0
                })
              } else {
                this.$message.success('批量推送百世成功')
              }
              this.getList()
            } else {
              errorMsg.apply(this, [ res.data, `批量推送百世` ])
              this.isPushBsBtn=true;
            }
          })
        }).catch(req=>{
          this.isPushBsBtn=true;
        })
      }

    },
    cancel(id,statusd) {//取消配货单
      if(this.isCancelBtn){
        this.isCancelBtn=false;
        this.$confirm('确认取消配货单？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          cancelAPI({ids:[id],status:statusd.toString()}).then(res => {
            requestMsg.apply(this,[res.data,'取消'])
            this.isCancelBtn=true;
          })
        }).catch(req=>{
          this.isCancelBtn=true;
        })
      }

    },
    sendFail(id) {//发送失败
      if(this.isSendFailBtn){
        this.isSendFailBtn=false;
        sendFailAPI({ids:[id]}).then(res => {
          requestMsg.apply(this,[res.data,'操作'])
          this.isSendFailBtn=true;
        })
      }

    },
    pushBsSec(id) {//二次推送百世
      confirm.apply(this,['确定要二次推送百世吗？']).then(() => {
        pushBsAPI([id]).then(res => {
          requestMsg.apply(this,[res.data,'二次推送百世'])
        })
      })
    },
    cancelPush(id) {//取消推送
      if(this.isCancelPushBtn){
        this.isCancelPushBtn=false;
        cancelPushAPI({ids:[id]}).then(res => {
          requestMsg.apply(this,[res.data,'取消推送'])
          this.isCancelPushBtn=true;
        })
      }

    },
    refuse(id) {//拒收
      if(this.isRefuseBtn){
        this.isRefuseBtn=false;
        confirm.apply(this,['确定要拒收吗？']).then(() => {
          refushAPI({ids:[id]}).then(res => {
            requestMsg.apply(this,[res.data,'拒收'])
            this.isRefuseBtn=true;
          })
        }).catch(req=>{
          this.isRefuseBtn=true;
        })
      }

    },
    batchPushBs() {//批量推送百世
      if(this.isSelected()&&this.isBatchPushBsBtn){
        this.isBatchPushBsBtn=false;
        confirm.apply(this,['确定推送百世吗？']).then(() => {
          this.pushing = true
          pushBsAPI(this.multipleSelectionIDs).then(res => {
            // requestMsg.apply(this,[res.data,'推送百世'])
            if (res.data.status) {
              if (res.data.data) {
                this.$notify.error({
                  title: '失败',
                  message: res.data.data,
                  duration: 0
                })
              } else {
                this.$message.success('批量推送百世成功')
              }

            } else {
              errorMsg.apply(this, [ res.data, `批量推送百世` ])
            }
            this.pushing = false
            this.getList()
          })
        }).catch(req=>{
          this.isBatchPushBsBtn=true;
        })
      }
    },
    isSelected(){
      if (this.multipleSelectionIDs.length <= 0){
        this.$message.warning('请选择需要操作的条目')
        return false
      }
      return true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelectionIDs = getMultipleSelectionIDs(val)
    },
    submitText(){
      this.listQuery.orderCode = this.Ttextarea
      this.showTextVisible = false
    },
    showTextarea(type){//显示文本域
      this.showTextVisible = true
      this.titleStatus = type
      this.Ttextarea = this.listQuery[type]
    },
    handleFilter() {
      let stringcategoryCode='';
      if(this.categoryCodes.length>0){
        for(let i=0;i<this.categoryCodes.length;i++){
          stringcategoryCode=stringcategoryCode+this.categoryCodes[i].code+','
        }
        this.listQuery.categoryCode=stringcategoryCode;
      }else{
        this.listQuery.categoryCode=null
      }
      if(this.isHandleFilterBtn){
        this.isHandleFilterBtn=false;
        this.listQuery.pageNum = 1
        store.dispatch('SetPickOrderSerKey',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        if(Object.prototype.toString.call(this.listQuery.conds) !== '[object Undefined]'){
          this.getListFuzzy()
        }else{
          if (this.timeRange) {
            this.listQuery.startTime = this.timeRange[0]
            this.listQuery.endTime = this.timeRange[1]
          } else {
            this.listQuery.startTime = null
            this.listQuery.endTime = null
          }
        }
        this.listQuery.pageNum = 1
        this.getList()
      }

    },
    resetFilter(){
      if(this.isResetFilterBtn){
        this.isResetFilterBtn=false;
        this.listQuery = {
          pageNum: 1,
          categoryCode: null,
          invoiceStatus: null,
          needInvoice:null,
          exportStatus: null,
          status: null,
          pageSize: this.listQuery.pageSize
        }
        this.categoryCodes=[];
        this.timeRange = null
        this.getList()
      }

    },
    sendMessage(){
      if(this.isSelected()&&this.isSendMessageBtn){
        this.isSendMessageBtn=false;
        this.$prompt('发送短信给已选订单', '发送短信', {
          confirmButtonText: '发送',
          cancelButtonText: '取消',
          inputPattern: /^.{1,100}$/,
          inputErrorMessage: '不能为空,100字以内',
          inputType:'textarea'
        }).then(value => {
          sendMessageAPI({
            orderIds: this.multipleSelectionIDs,
            content: value.value
          }).then(res => {
            if (res.data.code === 0) {
              this.$message.success(`短信内容： ${value.value} 发送成功`)
            } else {
              errorMsg.apply(this, [ res.data, `短信发送` ])
            }
            this.isSendMessageBtn=true;
          })
        }).catch(req=>{
          this.isSendMessageBtn=true;
        })
      }
    },
    // orderStatus(status){
    //   this.listQuery.status = status
    // },
    // getListFuzzy(){
    //   this.listLoading = true
    //   getListFuzzyAPI(this.listQuery).then(res => {
    //     if(res.data.code === 0){
    //       this.list = res.data.data.list
    //       this.total = res.data.data.total
    //     } else {
    //       this.$message.error('获取数据失败');
    //     }
    //     this.listLoading = false
    //   })
    // },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>
