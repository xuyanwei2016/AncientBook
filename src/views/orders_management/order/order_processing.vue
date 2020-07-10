<template>
  <div class="app-container">
    <h3>订单基础信息：</h3>
    <el-form ref="orderForm" :model="orderDetail" label-position="right" label-width="120px" class="order-form clearfix">
      <el-form-item label="订单编号：">{{orderDetail.code}}</el-form-item>
      <el-form-item label="订单来源：">{{orderDetail.orderSourceZh}}</el-form-item>
      <el-form-item label="订单状态：">{{orderDetail.statusZh}}</el-form-item>
      <el-form-item label="支付方式：" v-if="orderDetail.status != 0">{{payMap[orderDetail.payType]}}</el-form-item>
      <el-form-item label="订单总额：">
        <span class="color-red">￥{{orderDetail.payment}}</span>
      </el-form-item>
      <el-form-item label="优惠总额：">
        <span class="color-red">￥{{orderDetail.discountTotal}}</span>
      </el-form-item>
      <el-form-item label="下单时间：">{{orderDetail.createTime}}</el-form-item>
      <el-form-item label="支付状态：">{{orderDetail.status == 0 ? '未支付' : '已支付'}}</el-form-item>
      <el-form-item label="下单会员：">{{orderDetail.createrName}}</el-form-item>
      <el-form-item label="发货地区：">{{orderDetail.province}}</el-form-item>
      <el-form-item label="实际运费：">{{orderDetail.carriage}}</el-form-item>
      <el-form-item label="读者运费：">
        <span class="color-red">￥{{orderDetail.readerCarriage}}</span>
      </el-form-item>
      <el-form-item label="需要发票：">{{orderDetail.needInvoice == 0 ? '否' : '是'}}</el-form-item>
      <el-form-item label="开票状态：">{{orderDetail.invoiceStatus == 1 ? '已开票' : '未开票'}}</el-form-item>
      <el-form-item label="是否有留言：">{{orderDetail.hasMessage == 0 ? '否' : '是'}}</el-form-item>
      <el-form-item label="快递单号：">{{orderDetail.courierNumber}}</el-form-item>
      <el-form-item label="配送方式：">{{orderDetail.distributionModeName}}</el-form-item>
      <el-form-item label="支付时间：" v-if="orderDetail.status != 0">{{orderDetail.payTime}}</el-form-item>
      <el-form-item label="流水单号：" v-if="orderDetail.status != 0">{{orderDetail.payCode}}</el-form-item>
      <el-form-item label="优惠后运费：">
        <span v-if="orderDetail.status > 0">￥{{orderDetail.realReaderCarriage}}</span>
        <el-input-number @change="sunnum(receiverForm.realReaderCarriage)" v-else v-model="receiverForm.realReaderCarriage" :step="1" :min="0" :max="orderDetail.readerCarriage" style="width:160px"></el-input-number>
      </el-form-item>
    </el-form>

    <p class="divider"></p>
    <h3>订单商品信息：</h3>
    <el-table :data="orderGoods" border highlight-current-row stripe>
      <el-table-column prop="goodsAttr1" label="书代号" min-width="100" align="center"></el-table-column>
      <el-table-column label="商品名称" min-width="180" align="center">
        <template slot-scope="scope">
          <a class="bookLink" :href="`/#/bookItem?id=${scope.row.goodsid}`" target="_blank">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="数量" min-width="50" align="center"></el-table-column>
      <el-table-column prop="price" label="定价" min-width="50" align="center"></el-table-column>
      <el-table-column prop="discount" label="折扣值" min-width="50" align="center"></el-table-column>
      <el-table-column prop="salePrice" label="售价" min-width="50" align="center"></el-table-column>
      <el-table-column label="商品状态" prop="goodsAttr3" min-width="50" align="center">
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.goodsAttr3 === '1'">正常</span>
          <span v-else-if="scope.row.goodsAttr3 === '0'" style="color: red;">已下架</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="subtotal" label="小计" min-width="80" align="center">
        <span>￥</span>
      </el-table-column>
    </el-table>
      <p style="text-align:right">商品总金额 <span style="color:red;font-size:20px">{{sumsubtotal}}</span> 元,运费<span style="color:red;font-size:20px">{{orderDetail.realReaderCarriage}}</span> 元,订单总金额<span style="color:red;font-size:20px">{{orderDetail.payment}}</span> 元</p>
    <p class="divider"></p>
    <h3>收货人信息：</h3>
    <el-form :model="receiverForm" ref="receiverForm" label-position="right" label-width="120px" style="width: 70%;" :rules="rules">
      <el-form-item label="收货人：" class="inline-block" prop="consigneeName">
        <el-input v-model="receiverForm.consigneeName" :disabled="Onedis"></el-input>
      </el-form-item>
      <el-form-item label="省市：" >
        <el-select v-model="cities.sheng" @change="choseProvince" placeholder="省级地区" :disabled="Onedis&&addressControl">
          <!-- //这个change事件是select的，不是option的，别写在option里面 -->
          <el-option v-for="item in cities.province" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="cities.shi" @change="choseCity" placeholder="市级地区" :disabled="Onedis&&addressControl">
          <el-option v-for="item in cities.shi1" :key="item.id" :label="item.value" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="cities.qu" @change="choseBlock" placeholder="区级地区" :disabled="Onedis&&addressControl">
          <el-option v-for="item in cities.qu1" :key="item.id" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-input v-model="receiverForm.address" :disabled="Onedis&&addressControl"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone" class="inline-block">
        <el-input v-model="receiverForm.phone" :disabled="Onedis"></el-input>
      </el-form-item>
      <el-form-item label="固定电话：" class="inline-block">
        <el-input v-model="receiverForm.tel" :disabled="Onedis"></el-input>
      </el-form-item>
      <el-form-item label="客户备注：">
        <el-input type="textarea" v-model="receiverForm.message" :autosize="{ minRows: 4}" :disabled="Onedis"></el-input>
      </el-form-item>
    </el-form>

    <p class="divider"></p>
    <h3>发票信息：</h3>
    <el-form :model="invoiceForm" ref="invoiceForm" :rules="rules" label-position="right" label-width="120px" style="width: 70%;">
      <el-form-item label="是否开发票:">
        <el-radio-group v-model="invoiceForm.has" :disabled="Twodis">
          <el-radio :label="1" >是</el-radio>
          <el-radio :label="0" >否</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="invoiceForm.has === 1">
        <el-form-item prop="mail" label="邮箱：">
          <el-input v-model="invoiceForm.mail" placeholder="邮箱" :disabled="Twodis"></el-input>
        </el-form-item>
        <el-form-item label="发票类型：">
          <el-radio-group v-model="invoiceForm.invoiceType" :disabled="Twodis">
            <el-radio :label="0">个人</el-radio>
            <el-radio :label="1">单位</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="title" label="发票抬头：">
          <el-input v-model="invoiceForm.title" :disabled="Twodis"></el-input>
        </el-form-item>
        <el-form-item prop="identity" label="纳税人识别号：">
          <el-input v-model="invoiceForm.taxpayerIdentificationNumber" :disabled="Twodis"></el-input>
        </el-form-item>
      </template>
    </el-form>

    <p class="divider"></p>
    <div style="width:1000px;margin:0 auto;">
      <el-tabs type="border-card">
        <el-tab-pane label="备注历史">
          <div style="overflow-y:auto;width:900px;height:200px;padding:20px 40px;">
            <div v-for="remark in orderRemark" :key="remark.id">
              <div>
                <h4><span>记录人：{{remark.createrName}}</span> <b style="float:right">记录时间：{{remark.createTime}}</b></h4>
                <p>{{remark.operationContent}}</p>
              </div>
              <p class="divider"></p>
            </div>
            <el-form>
              <el-form-item label="新备注：" >
                <el-input type="textarea" v-model="newOrderRemark" row="5"></el-input>
              </el-form-item>
              <el-button type="primary" @click="addOrderRemark()">添加</el-button>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="状态变更记录">
          <el-table :data="statusHis" border stripe highlight-current-row>
            <el-table-column prop="createTime" label="操作时间"></el-table-column>
            <el-table-column prop="operationContent" label="操作内容"></el-table-column>
            <el-table-column prop="createrName" label="操作人"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配货单列表">
          <el-table :data="distributionList" border highlight-current-row stripe>
            <el-table-column label="配货单号">
              <template slot-scope="scope">
                <router-link :to="{name:'pick_processing',query:{id:scope.row.id}}">{{ scope.row.code }}</router-link></template>
            </el-table-column>
            <el-table-column prop="statusZh" label="配货单状态"></el-table-column>
            <el-table-column label="物流公司">
              <template slot-scope="scope">
                <span>{{scope.row.distributionMode == "HTKY"? "百世汇通" : scope.row.distributionMode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="courierNumber" label="物流单号"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="退货单列表">
          <el-table :data="returnOrderlist" border highlight-current-row stripe>
            <el-table-column label="退货单号">
              <template slot-scope="scope">
                <router-link :to="{name:'goods_processing',query:{id:scope.row.id}}">{{ scope.row.code }}</router-link></template>
            </el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="refundTotal" label="退款金额"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="退款单列表">
          <el-table :data="refundOrderlist" border highlight-current-row stripe>
            <el-table-column label="退款单号">
              <template slot-scope="scope">
                <router-link :to="{name:'refund_order',query:{id:scope.row.id}}">{{ scope.row.code }}</router-link></template>
            </el-table-column>
            <el-table-column label="退货单号">
              <template slot-scope="scope">
                <router-link :to="{name:'refund_order',query:{id:scope.row.id}}">{{ scope.row.salesReturnCode }}</router-link></template>
            </el-table-column>
            <el-table-column prop="refundTotal" label="退款金额"></el-table-column>
            <el-table-column prop="status" label="退款单状态"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="短信单列表">
          <el-table :data="Phoneloglist" border highlight-current-row stripe>
            <el-table-column label="订单编号" prop="code"></el-table-column>
            <el-table-column label="订单状态">
              <template slot-scope="scope">
                <span v-if="scope.row.orderStatus ==0">待支付</span>
                <span v-if="scope.row.orderStatus ==1">已支付</span>
                <span v-if="scope.row.orderStatus ==2">已确认</span>
                <span v-if="scope.row.orderStatus ==3">待发货</span>
                <span v-if="scope.row.orderStatus ==4">配货中</span>
                <span v-if="scope.row.orderStatus ==5">待收货</span>
                <span v-if="scope.row.orderStatus ==6">已完成</span>
                <span v-if="scope.row.orderStatus ==7">缺货</span>
                <span v-if="scope.row.orderStatus ==8">已退货</span>
                <span v-if="scope.row.orderStatus ==9">已取消</span>
                <span v-if="scope.row.orderStatus ==10">已拒收</span>
                <span v-if="scope.row.orderStatus ==-1">已删除</span>
                <span v-if="scope.row.orderStatus ==11">退款中</span>
                <span v-if="scope.row.orderStatus ==12">已退款</span>
                <span v-if="scope.row.orderStatus ==13">退货中</span>
              </template>
            </el-table-column>
            <el-table-column label="配货单状态">
              <template slot-scope="scope">
                <span v-if="scope.row.orderBlankStatus ==0">待发货</span>
                <span v-if="scope.row.orderBlankStatus ==-1">推送失败</span>
                <span v-if="scope.row.orderBlankStatus ==-2">发货失败</span>
                <span v-if="scope.row.orderBlankStatus ==-3">拒收</span>
                <span v-if="scope.row.orderBlankStatus ==1">已推送</span>
                <span v-if="scope.row.orderBlankStatus ==2">已发货</span>
                <span v-if="scope.row.orderBlankStatus ==3">已签收</span>
                <span v-if="scope.row.orderBlankStatus ==4">已取消</span>
                <span v-if="scope.row.orderBlankStatus ==-4">取消失败</span>

              </template>
            </el-table-column>
            <el-table-column label="操作时间" prop="createTime"></el-table-column>
            <el-table-column label="操作人" prop="creater"></el-table-column>
            <el-table-column label="短信内容" prop="content"></el-table-column>
          </el-table>
        </el-tab-pane>


        <el-tab-pane label="物流信息">
          <el-table :data="logisticsList">
            <el-table-column prop="context" label="物流详情"></el-table-column>
            <el-table-column prop="ftime" label="时间"></el-table-column>
          </el-table>
        </el-tab-pane>




      </el-tabs>
    </div>

    <div slot="footer" class="dialog-footer footer-margin">
      <el-button type="primary" @click="submitDealOrder">确认</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>

  </div>
</template>

<script>
import {
  batchCancelOrderAPI,
  batchConfirmOrderAPI,
  batchOrderPaidAPI,
  batchSoldOutAPI,
  batchSentAPI,
  genRationAPI,
  remarkHistoryAPI,
  sendMessageAPI,
  changeOrderInfoAPI,
  // getListAPI,
  getRationByIdAPI,
  getRemarkByIdAPI,
  getStatusHisByIdAPI,
  // getListFuzzyAPI,
  orderDetailAPI,
  returnOrderlistAPI,
  refundOrderlistAPI,
  getPhoneloglistAPI
} from '@/api/order/order';
import {express100} from '@/api/order/pickorder';
// import { mapJson } from '@/utils/map'
import axios from 'axios'
import { operationMsg, errorMsg } from '@/utils/publicFunctions'

export default {
  data() {
    return {
      payMap: {
        0: '支付宝',
        1: '微信',
        2: '易宝'
      },
      addressControl: false,
      Onedis:false,       //控制收货信息是否可以修改该
      Twodis:false,       //控制发票信息是否可以修改该
      statusHis:[],         //状态变更记录
      distributionList:[], //配货单列表
      returnOrderlist:[],  //退货单列表
      refundOrderlist:[],   //  退款单列表
      Phoneloglist:[],    //短信列表
      orderRemark:[],
      newOrderRemark:'',
      orderInfoId:0,
      receiverForm:{
        address:''
      },
      invoiceForm: {
        has: 0,
        invoiceType: 0
      },
      rules:{
        consigneeName:[
          // pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,
          { required: true, pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,message: '请输入正确的收货人', trigger: 'change' }
        ],
        // address:[
        //   { required: true, pattern:/^[\u4e00-\u9fa5]{2,40}$/,message: '请输入正确的地址', trigger: 'change' }
        // ],
        phone:[
          { required: true, pattern:/^(1)\d{10}$/,message: '请输入正确的手机号', trigger: 'blur' }
        ],
        tel:[
          { required: true, pattern:/^\d{11}$/,message: '请输入正确的电话号码', trigger: 'blur' }
        ],
        mail:[
          {
            required:false, pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,message:'请输入正确的Email', trigger:'blur'
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
      sumsubtotal:0,
      orderGoods:[],
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
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        orderType:''
      },
      orderInfoBasic:{},
      dialogStatus: '',
      dialogFormVisible: false,
      sending: false,
      isAddOrderRemarkBtn:true,
      isSubmitDealOrderBtn:true,
      logisticsList:[],
      listStatus: '',

    }
  },
  mounted() {
    this.getCityData()
    this.getOrderRemark()
    this.dealOrder(this.$route.query.id)
  },
  methods: {
    sunnum(num1){//当优惠后读者运费改变  重新计算总金额
      this.orderDetail.payment =parseFloat(parseFloat(num1) + parseFloat(this.sumsubtotal))
    },
    addOrderRemark(){
      if(this.isAddOrderRemarkBtn){
        this.isAddOrderRemarkBtn=false;
        remarkHistoryAPI({orderId: this.orderInfoId, remark: this.newOrderRemark}).then((res) => {
          if (res.data.status) {
            this.newOrderRemark = ''
            this.getOrderRemark()
          } else {
            errorMsg.apply(this, [ res.data, `添加备注历史` ])
            this.isAddOrderRemarkBtn=true;
          }

        })
      }

    },
    getOrderRemark(){
      getRemarkByIdAPI({orderId:this.orderInfoId,pageNum:1,pageSize:9999}).then((res) => {
        res.data.status ? this.orderRemark = res.data.data.list : errorMsg.apply(this, [ res.data, `查询备注历史列表` ])
      }),
      getStatusHisByIdAPI({orderId:this.orderInfoId,pageNum:1,pageSize:9999}).then(res => {
        res.data.status ? this.statusHis = res.data.data.list : errorMsg.apply(this, [ res.data, `查询状态改变历史列表` ])
      })
      getRationByIdAPI({orderId:this.orderInfoId,pageNum:1,pageSize:9999}).then(res => {
        res.data.status ? this.distributionList = res.data.data.list : errorMsg.apply(this, [ res.data, `获取配货单列表` ])
      })
      returnOrderlistAPI({orderCode:this.orderDetail.code,pageNum:1,pageSize:9999}).then(res => {
        res.data.status ? this.returnOrderlist = res.data.data.list : errorMsg.apply(this, [ res.data, `获取退货单列表` ])
      })
      refundOrderlistAPI({orderCode:this.orderDetail.code,pageNum:1,pageSize:9999}).then(res => {
        res.data.status ? this.refundOrderlist = res.data.data.list : errorMsg.apply(this, [ res.data, `获取退款单列表` ])
      })
      getPhoneloglistAPI({code:this.orderDetail.code}).then(res=>{
        res.data.status ? this.Phoneloglist = res.data.data : errorMsg.apply(this, [ res.data, `获取短信列表` ])
      })
      this.isAddOrderRemarkBtn=true;

      express100({"company": this.orderDetail.distributionMode, "number": this.orderDetail.courierNumber}).then(res=>{
        console.log('获取物流信息',res.data)
        res.data.status ? this.logisticsList = res.data.data : errorMsg.apply(this, [ res.data, `获取配货单物流信息` ])
      })
    },
    submitDealOrder(){
      if(this.isSubmitDealOrderBtn){
        this.isSubmitDealOrderBtn=false;
        this.$refs['receiverForm'].validate((valid) => {
          if (valid) {
            this.$refs['invoiceForm'].validate((valid) => {
              let OrderInfo = {
                address:this.receiverForm.address, // (string, optional): 详细地址 ,
                area:this.cities.qu, // (string, optional): 区 ,
                city:this.cities.shi, // (string, optional): 市 ,
                consigneeName:this.receiverForm.consigneeName, // (string, optional): 收货人名字 ,
                // createrName:this.receiverForm.createrName, // (string, optional): 下单会员 ,
                invoiceEmail:this.invoiceForm.mail, // (string, optional): 电子邮箱 ,
                id:this.orderInfoId, // (integer, optional): 订单id ,
                invoiceType:this.invoiceForm.invoiceType, // (integer, optional): 发票类型 0个人1公司 ,
                needInvoice:this.invoiceForm.has, // (integer, optional): 是否需要开票:请选择、1是、0否 ,
                invoiceTitle: this.invoiceForm.title, //(string, optional): 个人：姓名 公司：发票抬头 ,
                message: this.receiverForm.message, // (string, optional): 客户留言 ,
                phone:this.receiverForm.phone, // (string, optional): 手机号码 ,
                province:this.cities.sheng, // (string, optional): 省 ,
                realReaderCarriage:this.receiverForm.realReaderCarriage, // (number, optional): 实际读者运费 ,
                taxpayerIdentificationNumber:this.invoiceForm.taxpayerIdentificationNumber, // (string, optional): 纳税人识别号 ,
                tel:this.receiverForm.tel, // (string, optional): 固定电话
              }
              // console.log(OrderInfo)
              changeOrderInfoAPI(OrderInfo).then(res => {
                if(res.data.status){
                  this.$message.success('修改订单成功')
                  this.$router.back()
                } else {
                  errorMsg.apply(this, [ res.data, `修改订单` ])
                }
                this.isSubmitDealOrderBtn=true;
              })
            })
          }else{
            this.$message.error('请检查输入内容')
            this.isSubmitDealOrderBtn=true;
          }
        })
      }

    },
    // 加载china地点数据，三级
    getCityData(){
      axios.get(this.mapJson).then((response)=>{
        if (response.status==200) {
          let data = response.data
          this.cities.province = []
          this.cities.city = []
          this.cities.block = []
          // 省市区数据分类
          for (let item in data) {
            if (item.match(/0000$/)) {//省
              this.cities.province.push({id: item, value: data[item], children: []})
            } else if (item.match(/00$/)) {//市
              this.cities.city.push({id: item, value: data[item], children: []})
            } else {//区
              this.cities.block.push({id: item, value: data[item]})
            }
          }
          // 分类市级
          for (let index in this.cities.province) {
            for (let index1 in this.cities.city) {
              if (this.cities.province[index].id.slice(0, 2) === this.cities.city[index1].id.slice(0, 2)) {
                this.cities.province[index].children.push(this.cities.city[index1])
              }
            }
          }
          // 分类区级
          for(let item1 in this.cities.city) {
            for(let item2 in this.cities.block) {
              if (this.cities.block[item2].id.slice(0, 4) === this.cities.city[item1].id.slice(0, 4)) {
                this.cities.city[item1].children.push(this.cities.block[item2])
              }
            }
          }
        } else {
          // console.log(response.status)
        }
      }).catch(function(error){console.log(typeof+ error)})
    },
    // 选省
    choseProvince(e) {
      for (let index2 in this.cities.province) {
        if (e === this.cities.province[index2].id) {
          this.cities.shi1 = this.cities.province[index2].children
          this.cities.shi = this.cities.province[index2].children[0].value
          this.cities.qu1 =this.cities.province[index2].children[0].children
          this.cities.qu = this.cities.province[index2].children[0].children[0].value
          this.E = this.cities.qu1[0].id
        }
      }
    },
    // 选市
    choseCity(e) {
      for (let index3 in this.cities.city) {
        if (e === this.cities.city[index3].id) {
          this.cities.qu1 = this.cities.city[index3].children
          this.cities.qu = this.cities.city[index3].children[0].value
          this.E = this.cities.qu1[0].id
        }
      }
    },
    // 选区
    choseBlock(e) {
      this.E=e;
      // console.log(this.E)
    },
    dealOrder(id){ //获取详情
      this.orderInfoId = id
      orderDetailAPI(id).then(res => {
        if (res.data.status) {
          this.orderDetail = res.data.data
          this.orderDetail.readerCarriage=  parseFloat(this.orderDetail.readerCarriage)
          this.receiverForm.createrName = this.orderDetail.createrName
          this.receiverForm.address = this.orderDetail.address
          this.receiverForm.phone = this.orderDetail.phone
          this.receiverForm.message = this.orderDetail.message
          this.receiverForm.tel = this.orderDetail.tel
          this.receiverForm.consigneeName = this.orderDetail.consigneeName
          this.cities.sheng = this.orderDetail.province
          this.cities.shi = this.orderDetail.city
          this.cities.qu = this.orderDetail.area
          this.receiverForm.realReaderCarriage = parseInt(this.orderDetail.realReaderCarriage)
          this.invoiceForm.has = this.orderDetail.needInvoice
          this.invoiceForm.mail = this.orderDetail.invoiceEmail
          this.invoiceForm.invoiceType = this.orderDetail.invoiceType
          this.invoiceForm.title = this.orderDetail.invoiceTitle
          this.invoiceForm.taxpayerIdentificationNumber = this.orderDetail.taxpayerIdentificationNumber
          console.log(this.invoiceForm);

          if(this.orderDetail.status == 0||this.orderDetail.status == 1||this.orderDetail.status == 2||this.orderDetail.status == 3||this.orderDetail.status == 7){//0/1/2/3/7可以修改
            this.Onedis = false
          }else{
            this.Onedis = true
          }
          this.orderDetail.status == 5 || this.orderDetail.status == 6 ? this.addressControl = false : this.addressControl = true
          if(this.orderDetail.status == 6 && this.invoiceForm.has === 1){ //除了状态6 都可以
            this.Twodis = true
          }else{
            this.Twodis = false
          }
          this.orderGoods = res.data.data.orderinfoList
          this.sumsubtotal = 0
          this.bookNum = 0
          this.orderGoods.map((item,index) => {
            if(item.goodsAttr3 == "1"){item.goodsAttr3 = "上架"}
            if(item.goodsAttr3 == "0"){item.goodsAttr3 = "下架"}
            if(item.goodsAttr3 == "-1"){item.goodsAttr3 = "获取失败"}
            item.price = '¥' + item.price
            item.subtotal = item.salePrice * item.num
            this.sumsubtotal += parseFloat(item.subtotal)
            this.bookNum += item.num
            item.salePrice = '¥' + item.salePrice
            item.subtotal = '￥' + parseFloat(item.subtotal ).toFixed(2)
          })
          this.sumsubtotal = parseFloat(this.sumsubtotal ).toFixed(2)
          this.getOrderRemark()
        } else {
          errorMsg.apply(this, [ res.data, `获取订单详情` ])
        }
      })
    }
  }
}
</script>
