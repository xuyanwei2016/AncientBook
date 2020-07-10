<template>
  <div class="app-container">
    <div class="buttons">
      <!-- <el-button icon="el-icon-circle-check" @click="batchEnsure">批量确认</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchEnsurebtn') >= 0" @click="batchEnsure">
        {{authBtns.filter(i => i.idName=='batchEnsurebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchEnsurebtn').length>0 && authBtns.filter(i => i.idName=='batchEnsurebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchEnsurebtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-document" @click="batchGen">批量生成配货单</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchGenbtn') >= 0" @click="batchGen">
        {{authBtns.filter(i => i.idName=='batchGenbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchGenbtn').length>0 && authBtns.filter(i => i.idName=='batchGenbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchGenbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-sold-out" @click="batchSoldout">批量缺货</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('batchSoldoutbtn') >= 0" @click="batchSoldout">
        {{authBtns.filter(i => i.idName=='batchSoldoutbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchSoldoutbtn').length>0 && authBtns.filter(i => i.idName=='batchSoldoutbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchSoldoutbtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-document" @click="sendMessage">发短信</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('sendMessagebtn') >= 0" @click="sendMessage">
        {{authBtns.filter(i => i.idName=='sendMessagebtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='sendMessagebtn').length>0 && authBtns.filter(i => i.idName=='sendMessagebtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('sendMessagebtn')].icon, 'el-icon--right']"></i>
      </el-button>
      <!-- <el-button icon="el-icon-tickets" @click="sendInfo">推送发票</el-button> -->
      <el-button v-if="authBtns.map(i => i.idName).indexOf('sendInfobtn') >= 0" @click="sendInfo">
        {{authBtns.filter(i => i.idName=='sendInfobtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='sendInfobtn').length>0 && authBtns.filter(i => i.idName=='sendInfobtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('sendInfobtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>
    <transition-group name="custom-classes-transition" enter-active-class="animated">
      <el-form inline class="form-inline" :key="moreFilter">
        <el-form-item label="订单类型">
          <el-select v-model="listQuery.status">
            <el-option :value="null" label="全部"></el-option>
            <el-option v-for="(value, key) in allStatus" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="listQuery.code" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('code')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="书代号">
          <el-input v-model="listQuery.bookcode" clearable>
            <el-button slot="append" icon="el-icon-caret-bottom" @click="showTextarea('bookcode')"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="listQuery.phone" clearable></el-input>
        </el-form-item>
        <template v-if="moreFilter">
          <el-form-item label="收货人名">
            <el-input v-model="listQuery.consigneeName" clearable></el-input>
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model="listQuery.address" clearable></el-input>
          </el-form-item>




          <!--<el-form-item label="商品分类：" prop="diytype">
            <el-popover popper-class="category-popover" placement="bottom-start" trigger="click">
              <el-tree :data="navTree" ref="tree" show-checkbox check-strictly node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect" ></el-tree>
              <el-select v-model="temp.diytype" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:100%;" placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>-->






          <el-form-item label="下单会员">
            <el-input v-model="listQuery.createrName" clearable></el-input>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker v-model="timeRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="订单来源">
            <el-select v-model="listQuery.orderSource">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="报名网" :value="1"></el-option>
              <el-option label="本系统" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开票状态">
            <el-select v-model="listQuery.invoiceStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已开" :value="1"></el-option>
              <el-option label="未开" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流水单号">
            <el-input v-model="listQuery.payCode" clearable></el-input>
          </el-form-item>
          <el-form-item label="快递单号">
            <el-input v-model="listQuery.courierNumber" clearable></el-input>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select v-model="listQuery.payType">
              <el-option label="全部" :value="null"></el-option>
              <el-option :value="0" label="支付宝"></el-option>
              <el-option :value="1" label="微信"></el-option>
              <el-option :value="2" label="网银支付"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否下载">
            <el-select v-model="listQuery.isDownload">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="已下载" :value="1"></el-option>
              <el-option label="未下载" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单归属">
            <el-select v-model="listQuery.orderAscription">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="百世" :value="1"></el-option>
              <el-option label="网店宝" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否需要开票">
            <el-select v-model="listQuery.needInvoice">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有留言">
            <el-select v-model="listQuery.hasMessage">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
            <!-- bug2214 提出去掉商品分类 -->

           <!--<el-form-item label="商品分类"  prop="listQuery.categoryCode">

            <el-popover popper-class="category-popover" placement="bottom-start" trigger="click">
              <el-tree :data="navTree" ref="searchTree" show-checkbox check-strictly node-key="id" :props="defaultProps" @check="checkChange"></el-tree>
              <el-select v-model="listQuery.categoryCode" slot="reference" popper-class="hidden-selection" multiple @clear="clearCheckedKeys" placeholder="全部"  value-key="diytypeid">
                <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item.code"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>-->
          <el-form-item label="商品分类：" prop="categoryCodes"><!--listQuery.categoryCode-->
            <el-popover popper-class="category-popover" placement="bottom-start" trigger="click">
              <el-tree :data="navTree" ref="tree" show-checkbox check-strictly node-key="id" :default-checked-keys="checkedKeys" :props="defaultProps"  @check="setSelect" ></el-tree>
              <el-select v-model="categoryCodes" value-key="diytypeid" multiple @remove-tag="setTree" popper-class="hidden-selection" slot="reference" style="width:100%;" placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.showName" :value="item"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>



        </template>
        <el-form-item>
          <el-button @click="handleFilter">检索</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button @click="moreFilter = !moreFilter">{{moreFilter ?  '简洁' : '更多' }}<i :class="moreFilter ?  'el-icon-arrow-up' : 'el-icon-arrow-down' "></i></el-button>
        </el-form-item>
      </el-form>
    </transition-group>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="订单号" min-width="170" align="center">
        <template slot-scope="scope">
          <router-link class="bookLink" v-if="true" :to="{path: 'order/order_processing', query: {id: scope.row.id}}">{{scope.row.code}}</router-link>
          <span v-else>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人姓名" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.consigneeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单会员" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" min-width="65" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.payment}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="65" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.statusZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" min-width="130" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否下载" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isDownloadZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单归属" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderAscriptionZh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成状态" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{finishStatus[scope.row.isAllFinish]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票" min-width="32" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.needInvoice == 1">是</span>
          <span v-else-if="scope.row.needInvoice == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="开票状态" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="留言" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width operationBtns" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <!-- <router-link :to="{path: 'order/order_processing', query: {id: scope.row.id}}"><i class="el-icon-edit" title="订单处理"></i></router-link> -->
          <router-link :to="{path:`order/order_processing`, query: {id: scope.row.id}}" v-if="authBtns.filter(i => i.idName=='Orderprocessingbtn').length > 0">
            <i :class="authBtns.filter(i => i.idName=='Orderprocessingbtn')[0].icon" :title="authBtns.filter(i => i.idName=='Orderprocessingbtn')[0].name"></i>
          </router-link>
          <!-- <i class="el-icon-circle-close" v-if="scope.row.orderAscription==1 && (scope.row.status == 0 || scope.row.status==1 || scope.row.status==2 || scope.row.status==7)" @click="cancelOrder(scope.row)" title="取消订单"></i> -->
          <i :class="authBtns.filter(i => i.idName=='cancelOrderbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='cancelOrderbtn').length > 0)&&(scope.row.orderAscription==1 && (scope.row.status == 0 || scope.row.status==1 || scope.row.status==2 || scope.row.status==7))" @click="cancelOrder(scope.row)" :title="authBtns.filter(i => i.idName=='cancelOrderbtn')[0].name"></i>
          <!-- <i class="el-icon-circle-check" v-if="scope.row.orderAscription==1 && (scope.row.status ==1 || scope.row.status==7)" @click="confirmOk(scope.row.id)" title="确认订单"></i> -->
          <i :class="authBtns.filter(i => i.idName=='confirmOkbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='confirmOkbtn').length > 0)&&(scope.row.orderAscription==1 && (scope.row.status ==1 || scope.row.status==7))" @click="confirmOk(scope.row.id)" :title="authBtns.filter(i => i.idName=='confirmOkbtn')[0].name"></i>
          <!-- <i class="el-icon-sold-out" v-if="scope.row.status ==1 && scope.row.orderAscription == 1" @click="orderStatus(scope.row.id,'soldout')" title="缺货"></i> -->
          <i :class="authBtns.filter(i => i.idName=='outbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='outbtn').length > 0)&&(scope.row.status ==1 && scope.row.orderAscription == 1)" @click="orderStatus(scope.row.id,'soldout')" :title="authBtns.filter(i => i.idName=='outbtn')[0].name"></i>
          <!-- <i class="el-icon-back" v-if="scope.row.status ==6" @click="handleReturnGoods(scope.row.id)" title="退货"></i> -->
          <i :class="authBtns.filter(i => i.idName=='handleReturnGoodsbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='handleReturnGoodsbtn').length > 0)&&(scope.row.status ==6)" @click="handleReturnGoods(scope.row.id)" :title="authBtns.filter(i => i.idName=='handleReturnGoodsbtn')[0].name"></i>
          <!-- <i class="el-icon-tickets" v-if="scope.row.status ==6" @click="pushInvoice(scope.row.id)" title="推送发票"></i> -->
          <i :class="authBtns.filter(i => i.idName=='pushInvoicebtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='pushInvoicebtn').length > 0)&&(scope.row.status ==6)" @click="pushInvoice(scope.row.id)" :title="authBtns.filter(i => i.idName=='pushInvoicebtn')[0].name"></i>
          <!-- <i class="el-icon-document" v-if="scope.row.orderAscription == 1 && scope.row.status ==2" @click="orderStatus(scope.row.id,'generateDistribution')" title="生成配货单"></i> -->
          <i :class="authBtns.filter(i => i.idName=='generateDistributionbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='generateDistributionbtn').length > 0)&&(scope.row.orderAscription == 1 && scope.row.status ==2)" @click="orderStatus(scope.row.id,'generateDistribution')" :title="authBtns.filter(i => i.idName=='generateDistributionbtn')[0].name"></i>
          <!-- <i class="el-icon-d-arrow-left" v-if="scope.row.orderAscription == 2 && (scope.row.status==1 || scope.row.status==3)" @click="handleRefund(scope.row.id)" title="退款"></i> -->
          <i :class="authBtns.filter(i => i.idName=='handleRefundbtn')[0].icon" v-if="(authBtns.filter(i => i.idName=='handleRefundbtn').length > 0)&&(scope.row.orderAscription == 2 && (scope.row.status==1 || scope.row.status==3))" @click="handleRefund(scope.row.id)" :title="authBtns.filter(i => i.idName=='handleRefundbtn')[0].name"></i>
          <i :class="authBtns.filter(i => i.idName=='rejectionbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='rejectionbtn').length > 0 && scope.row.orderAscription == 2 && scope.row.status==5" @click="handleRejection(scope.row.id)" :title="authBtns.filter(i => i.idName=='rejectionbtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="sendValueVisible" :before-close="handleClose">
      <template v-if="dialogStatus === 'cancel'">
        <textarea type="textarea" placeholder="请填写说明，取消原因自动显示在备注历史中" style="width:98%;height:80px;resize:none" v-model="cancelTextarea"></textarea>
      </template>
      <template v-else-if="dialogStatus === 'sendMsg'">
        <el-container>
          <el-main>
            <h3>目标订单</h3>
            <el-table :data="sendList" border highlight-current-row stripe >
              <el-table-column label="订单号" prop="code" align="center"></el-table-column>
              <el-table-column label="电话" prop="phone" align="center"></el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination @current-change="handleSendMsgChange" :current-page="msgPageNum" :page-size="msgPageSize" layout="total, prev, pager, next" :total="msgTotal" align="center"></el-pagination>
            </div>
          </el-main>
          <el-aside width="200px">
            <br><h3>短信内容</h3>
            <el-input v-model="msgTextarea" type="textarea" placeholder="请输入短信内容，最多200字" :autosize="{ minRows: 10}"></el-input>
          </el-aside>
        </el-container>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOrderTrue" v-if="dialogStatus === 'cancel'">确 定</el-button>
        <el-button @click="sendMsgSubmit" v-if="dialogStatus === 'sendMsg'">确 定</el-button>
        <el-button @click="sendValueVisible = false,isSendMsgSubmit=true,isCancelOrderTrueBtn=true">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择退货商品" :visible.sync="returnFormVisible" width="70%" :before-close="handleCloseFormVisible">
      <el-table :data="returnGoodslist" border stripe ref="returnGoodsTable" @selection-change="handleReturnSelectionChange" v-loading="returnLoading" element-loading-text="请稍等" highlight-current-row>
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="商品名称" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="定价" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售价" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.salePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.num}}</span>
          </template>
        </el-table-column>
        <el-table-column label="可退数量" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.ddnum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="退货数量" width="200" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.returnNum" @change="numbersum(scope.row.returnNum,scope.row.id)" :step="1" :min="0" :max="scope.row.num"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="magintop">
        <el-col :span="5"><div class="reason">选择退货原因：</div></el-col>
        <el-col :span="19">
          <el-radio-group v-model="returnRadio">
            <el-radio label="1">客户原因退货（买错/买重/用不上/收件信息错误等）</el-radio><br>
            <el-radio label="2">物流原因退货（物流异常）</el-radio><br>
            <el-radio label="3">配货错误退货（错发/多发）</el-radio><br>
            <el-radio label="4">包裹破损（外包装或内部损坏）</el-radio><br>
            <el-radio label="5">书籍印刷问题</el-radio><br>
            <el-radio label="6">书籍内容问题</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row style="padding-top:25px; text-align:center">
        <el-button type="info" @click="submitReturnGoods">确定</el-button>
        <el-button type="info" @click="returnFormVisible = false,issubmitReturnGoodsBtn=true">取消</el-button>
      </el-row>
    </el-dialog>

    <el-dialog :title="`输入查询的${textTitle[titleStatus]}`" :visible.sync="showTextVisible">
      <el-input type="textarea" v-model="Ttextarea" :autosize="{minRows: 6}" placeholder=""></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="submitText">确定</el-button>
        <el-button type="info" @click="showTextVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
  .el-radio:nth-child(n+2){
    margin-top: 15px;
  }
  .el-input-number{
    width: 150px;
  }
  .el-textarea__inner{
    height: 100%;
  }
  .magintop{
    margin-top: 20px
  }
</style>

<script>
import { getMultipleSelectionIDs } from '@/filters/getIds'
import {
  batchCancelOrderAPI, getNavAPI, getOptionAPI, getAllStatusAPI, refundAPI, rejectionAPI,
  batchConfirmOrderAPI,
  batchOrderPaidAPI,
  batchSoldOutAPI,
  batchSentAPI,
  genRationAPI,
  createinvoiceAPI,
  remarkHistoryAPI,
  returnPostGoods,
  sendMessageAPI,
  getListAPI,
  orderDetailAPI,
  sumSendinvoiceAPI
} from '@/api/order/order';
// import { mapJson } from '@/utils/map'
import axios from 'axios'
import { operationMsg, requestMsg, errorMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
    return {
      finishStatus: ['未完成','部分完成','全部完成'],
      checkedKeys: [],
      authBtns: [],
      msgTextarea: null,
      msgTotal: 0,
      msgpageSize: 50,
      msgPageNum: 1,
      sendList: [],
      returnLoading: true,
      multiReturnIds: [],
      multiReturnSelection: [],
      allStatus: null,
      navTree: [],
      options: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      popoverVisible: false,
      sendValueVisible:false,
      showTextVisible: false,
      titleStatus: '',
      Ttextarea:'',
      textTitle: {
        code: '订单号',
        bookcode: '书代号'
      },
      orderInfoId:0,
      rules:{
        consigneeName:[{ required: true, pattern:/^[\u4e00-\u9fa5]{2,5}$/,message: '请输入正确的收货人', trigger: 'blur' }],
        address:[{ required: true, pattern:/^[\u4e00-\u9fa5]{2,40}$/,message: '请输入正确的地址', trigger: 'blur' }],
        phone:[{ required: true, pattern:/^1[3|5|7|8|]\d{9}$/,message: '请输入正确的手机号', trigger: 'blur' }],
        tel:[{ required: true, pattern:/^\d{11}$/,message: '请输入正确的电话号码', trigger: 'blur' }],
        mail:[{ required:false, pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,message:'请输入正确的Email', trigger:'blur'}],
        title:[{ required:false, pattern:/^.{4,50}$/,message:'请输入正确的抬头', trigger:'blur' }],
        identity:[{ required:false,pattren:/^.{10,40}$/,message:'请输入正确的识别号', trigger:'blur' }]
      },
      returnFormVisible: false,  //退货弹框控制器
      returnGoodslist:[],  //退货商品列表
      tableKey: 0,
      cancelTextarea:'',
      list: null,
      orderObj: {},
      total: null,
      thisorderId:null,
      listLoading: true,
      moreFilter:false,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        categoryCode: [],
        orderSource: null,
        invoiceStatus: null,
        payType: null,
        needInvoice: null,
        hasMessage: null,
        isDownload: null,
        orderAscription: null,
        status: null,
        phone:null            //手机号查询
      },
      categoryCodes:[],
      multipleSelection: [],//选中的数字
      multipleSelectionIDs:[],//选中的id
      textMap: {
        cancel: '取消订单',
        sendMsg: '发送短信'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      sending: false,
      timeRange: [],
      returnRadio: '1',
      isBatchEnsureBtn:true,
      isBatchGenBtn:true,
      isBatchSoldoutBtn:true,
      isSendMessageBtn:true,
      isSendMsgSubmit:true,
      isPushInvoiceBtn:true,
      isHandleFilterBtn:true,
      isResetFilterBtn:true,
      isCancelOrderTrueBtn:true,
      isConfirmOkBtn:true,
      isOrderStatusBtn:true,
      isHandleRejectionBtn:true,
      issubmitReturnGoodsBtn:true,
      isSendInfoBtn:true,
      isHandleReturnGoodsBtn:true,
      valueAry:[],

    }
  },
  watch: {
    sendValueVisible: function () {
              this.msgTextarea = ''
    }
  },
  created() {

    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    if( ifUndefined(store.getters.orderSerKeys.pageNum) ){
      this.listQuery = store.getters.orderSerKeys
      console.log(this.listQuery,'读取搜索条件成功')
      if(ifUndefined(this.listQuery.startTime) || ifUndefined(this.listQuery.endTime)){
        this.timeRange = []
        this.timeRange[0] = this.listQuery.startTime
        this.timeRange[1] = this.listQuery.endTime
      }
    }
    this.getAllStatus()
    this.getNav()
    this.getOption()
    this.getList()
  },
  methods: {
    handleRejection(id) {
      if(this.isHandleRejectionBtn){
        this.isHandleRejectionBtn=false;
        rejectionAPI({orderIds: [id]}).then(res => {
          requestMsg.apply(this,[res.data,`操作拒收`])
          this.isHandleRejectionBtn=true;
        })
      }

    },
    handleRefund(id) {
      confirm.apply(this,['确定退款吗?']).then(() => {
        batchCancelOrderAPI({orderIds: [id]}).then(res => {
          if(res.data.status){
            this.$message.success('已生成退款单')
          }else {
            requestMsg.apply(this,[res.data,`退款`])
          }

        })
      })
    },
    numbersum(num1,sid){
    this.returnGoodslist.map(i=>{
         if(i.id == sid){
           i.ddnum = i.num-num1
         }
       })
    },
    showTextarea(type){//显示文本域
      this.showTextVisible = true
      this.titleStatus = type
      this.Ttextarea = this.listQuery[type]
    },
    submitText(){
      this.listQuery[this.titleStatus] = this.Ttextarea
      this.showTextVisible = false
    },
    sendInfo(){ // 批量推送发票
      if(this.isSendInfoBtn){
        this.isSendInfoBtn=false;
        if(this.isSelected()){
          this.$confirm('是否确认推送发票？',"提示", {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            sumSendinvoiceAPI( this.multipleSelectionIDs ).then(res => {
              if (res.data.code === 0) {
                this.$message.success('批量推送发票成功')
                this.getList();
              }else{
                res.data.code === -2 ? this.$message.error(res.data.msg) : this.$message.error('批量推送发票失败')
                this.isSendInfoBtn=true;
              }
            })
          }).catch(req=>{
            this.isSendInfoBtn=true;
          })
        }
      }

    },
    handleReturnGoods(id){
      this.thisorderId = id;
      this.returnLoading = true
      if(this.isHandleReturnGoodsBtn){
        this.isHandleReturnGoodsBtn=false;
        orderDetailAPI(id).then(res => {
          if (res.data.status) {
            this.returnFormVisible = true
            this.returnGoodslist = res.data.data.orderinfoList.map(i => {
              i.ddnum = 0
              i.returnNum = i.num
              return i
            })
            this.$nextTick(() => {
              // console.log(this.$refs.returnGoodsTable);
              this.$refs.returnGoodsTable.toggleAllSelection()
            })
          } else {
            errorMsg.apply(this, [ res.data, `获取订单详情` ])
          }
          this.isHandleReturnGoodsBtn=true;
          this.returnLoading = false
        })
      }

    },
    submitReturnGoods(){
      if(this.issubmitReturnGoodsBtn){
        this.issubmitReturnGoodsBtn=false;
        if (this.multiReturnSelection.length<1 || !this.multiReturnSelection[0]) {
          return this.$message.warning('未选择任何退货商品')
        }
        let returnGoods = this.multiReturnSelection.map(i => {
          let {num, returnNum, ...temp} = i
          return {num: returnNum, ...temp}
        })
        let returnData = {
          orderId: this.thisorderId,
          list: returnGoods,
          content: this.returnRadio
        }
        returnPostGoods(returnData).then(res=>{
          requestMsg.apply(this,[res.data,'退货'])
          res.data.status ? this.returnFormVisible = false : true
          this.issubmitReturnGoodsBtn=true;
        })
      }

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
        store.dispatch('SetOrderSerKey',this.listQuery).then(res => {
          console.log(res,'保存查询成功')
        })
        if (!this.moreFilter) {
          let { status, code, bookcode,phone, pageNum, pageSize } = this.listQuery
          this.listQuery = { status, code, bookcode,phone, pageNum, pageSize }
          this.timeRange = []
        } else {
          // this.listQuery = {
          //   pageNum: this.listQuery.pageNum,
          //   pageSize: this.listQuery.pageSize,
          //   orderSource: null,
          //   invoiceStatus: null,
          //   payType: null,
          //   needInvoice: null,
          //   hasMessage: null,
          //   isDownload: null,
          //   orderAscription: null,
          //   status: this.listQuery.status
          // }
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
          orderSource: null,
          invoiceStatus: null,
          payType: null,
          needInvoice: null,
          hasMessage: null,
          status: null,
          isDownload: null,
          orderAscription: null,
          pageSize: this.listQuery.pageSize,
          phone:null
        }
        this.categoryCodes=[];
        this.timeRange = [];
        this.getList()
      }

    },
    sendMsgSubmit() {
      if(this.isSendMsgSubmit){
        this.isSendMsgSubmit=false;
        if (this.msgTextarea === null || this.msgTextarea === '') {
          this.isSendMsgSubmit=true;
          return this.$message.error('未填写短信内容')
        }
        if (this.msgTextarea && this.msgTextarea.length>200) {
          this.isSendMsgSubmit=true;
          return this.$message.error(`最多200字，现${this.msgTextarea.length}字`)
        }
        sendMessageAPI({
          orderIds: this.multipleSelectionIDs,
          content: this.msgTextarea
        }).then(res => {
          requestMsg.apply(this,[res.data, this.textMap[this.dialogStatus] ])
          this.isSendMsgSubmit=true;
        })
      }


    },
    sendMessage(){
      if(this.isSelected()){
        this.dialogStatus = 'sendMsg'
        this.sendValueVisible = true
        this.msgPageNum = 1
        this.sendList = this.multipleSelection.filter((el,idx) => idx<this.msgPageSize)
        this.msgTotal = this.multipleSelection.length
      }
    },
    isSelected(){
      if (this.multipleSelectionIDs.length <= 0){
        this.$message.warning('请选择需要操作的条目')
        return false
      }
      return true
    },
    /*批量確認*/
    batchEnsure(){
      if(this.isSelected()&&this.isBatchEnsureBtn){
        this.isBatchEnsureBtn=false;
        if (this.multipleSelection.some(i => i.orderAscription!=1) || this.multipleSelection.some(i => i.status!=1 && i.status!=7)) {
          this.isBatchEnsureBtn=true;
          return this.$message.warning('只能操做属于百世的已支付和已缺货状态的订单')
        }
        confirm.apply(this,['是否确认订单信息？']).then(() => {
          batchConfirmOrderAPI({ orderIds: this.multipleSelectionIDs }).then(res => {
              requestMsg.apply(this,[res.data,`批量确认订单`])
            this.isBatchEnsureBtn=true;
          })
        }).catch(action => {
          this.isBatchEnsureBtn=true;
          })
      }
    },
    /*批量生成配貨單*/
    batchGen(){
      if(this.isSelected()&&this.isBatchGenBtn){
        this.isBatchGenBtn=false;
        if (this.multipleSelection.some(i => i.orderAscription!=1) || this.multipleSelection.some(i => i.status!=2)) {
          this.isBatchGenBtn=true;
          return this.$message.warning('只能操做属于百世的已确认状态的订单')
        }
        confirm.apply(this,['是否生成配货单？']).then(() => {
          genRationAPI(this.multipleSelectionIDs).then(res => {
            requestMsg.apply(this,[res.data,`批量生成配货单`])
            this.isBatchGenBtn=true;
          })
        }).catch(action=>{
          this.isBatchGenBtn=true;
        })
      }
    },
    /*批量缺貨*/
    batchSoldout(){
      if(this.isSelected()&&this.isBatchSoldoutBtn){
        this.isBatchSoldoutBtn=false;
        if (this.multipleSelection.some(i => i.orderAscription!=1) || this.multipleSelection.some(i => i.status!=1)) {
          this.isBatchSoldoutBtn=true;
          return this.$message.warning('只能操做属于百世的已支付状态的订单')
        }
        confirm.apply(this,['是否确认缺货？']).then(() => {
          batchSoldOutAPI({ orderIds: this.multipleSelectionIDs }).then(res => {
            requestMsg.apply(this,[res.data,`批量确认缺货`])
            this.isBatchSoldoutBtn=true;
            // if (res.data.code === 0) {
            //   this.$message.success('批量确认成功')
            //   this.getList()
            // }else{
            //   this.$message.error(res.data.data.split(':')[1])
            // }
          })
        }).catch(action=>{
          this.isBatchSoldoutBtn=true;
        })
      }
    },
    cancelOrder(order){
      this.dialogStatus = 'cancel'
      this.sendValueVisible=true
      this.orderObj = order
    },
    cancelOrderTrue(){
      if(this.isCancelOrderTrueBtn){
        this.isCancelOrderTrueBtn=false;
        remarkHistoryAPI({orderId: this.orderObj.id, remark: this.cancelTextarea}).then((res) => {
          // console.log(this.cancelTextarea)
          if (res.data.status) {
            this.$message.success('填写取消理由成功')
            this.cancelTextarea = ''
          } else {
            errorMsg.apply(this, [ res.data, `填写取消理由` ])
          }
        })
        batchCancelOrderAPI({orderIds: [this.orderObj.id]}).then(res => {
          if (res.data.status) {
            this.$message.success('取消订单成功')
            this.getList()
            this.sendValueVisible = false
          }else{
            errorMsg.apply(this, [ res.data, `取消订单` ])
            this.isCancelOrderTrueBtn=true;
          }
        })
      }

    },
    confirmOk(id){
      if(this.isConfirmOkBtn){
        this.isConfirmOkBtn=false;
        confirm.apply(this,['已验证库存并确认订单？']).then(()=>{
          batchConfirmOrderAPI({orderIds:[id]}).then((res) => {
            requestMsg.apply(this, [res.data,`确认订单`])
            this.isConfirmOkBtn=true;
          }).catch(req=>{
            this.isConfirmOkBtn=true;
          })
        })
      }

    },
    orderStatus(id,status){
      if(this.isOrderStatusBtn){
        this.isOrderStatusBtn=false;
        confirm.apply(this,['是否继续操作？']).then(() => {
          if (status == 'soldout') {
            batchSoldOutAPI({orderIds:[id]}).then((res) => {
              requestMsg.apply(this, [res.data,`缺货操作`])
              this.isOrderStatusBtn=true;
            })
          } else {
            genRationAPI([id]).then((res) => {
              requestMsg.apply(this, [res.data,`生成配货单`])
              this.isOrderStatusBtn=true;
            })
          }
        }).catch(req=>{
          this.isOrderStatusBtn=true;
        })
        this.orderInfoId = id

      }

    },
    pushInvoice(id){ // 推送发票
      if(this.isPushInvoiceBtn){
        this.isPushInvoiceBtn=false;
        confirm.apply(this,['是否确认推送发票？']).then(() => {
          createinvoiceAPI(id).then(res=>{
            requestMsg.apply(this, [res.data,`推送发票`])
            this.isPushInvoiceBtn=true;
          }).catch(req=>{
            this.isPushInvoiceBtn=true;
          })
        })
      }

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelectionIDs = getMultipleSelectionIDs(val)
    },
    handleReturnSelectionChange(val) {
      this.multiReturnSelection = val
      this.multiReturnIds = getMultipleSelectionIDs(val)
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.status){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          errorMsg.apply(this, [ res.data, `获取表格数据` ])
        }
        this.listLoading = false;
        this.isHandleFilterBtn=true;
        this.isResetFilterBtn=true;
        this.isCancelOrderTrueBtn=true;
        this.isSendInfoBtn=true;
      })
    },
    getNav(){
      getNavAPI().then(res => {
        res.data.status ? this.navTree = res.data.data : errorMsg.apply(this, [ res.data, `获取树形自定义分类` ])
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

    clearCheckedKeys(){
      this.$refs.searchTree.setCheckedKeys([])
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
    getAllStatus() {
      getAllStatusAPI().then(res => {
        res.data.status ? this.allStatus = res.data.data : errorMsg.apply(this, [ res.data, `获取订单所有状态` ])
      })
    },
    handleSendMsgChange(val) {
      this.msgPageNum = val
      this.sendList = this.multipleSelection.filter((el,idx) => idx<this.msgPageSize*this.msgPageNum && idx>=(this.msgPageSize-1)*this.msgPageNum)
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    /*发短信右上角取消*/
    handleClose() {
      this.sendValueVisible=false;
      this.isSendMsgSubmit=true;
      this.isCancelOrderTrueBtn=true;

    },
    /*退货右上角取消*/
    handleCloseFormVisible() {
      this.returnFormVisible = false;
      this.issubmitReturnGoodsBtn=true;

    },
  }
}
</script>
