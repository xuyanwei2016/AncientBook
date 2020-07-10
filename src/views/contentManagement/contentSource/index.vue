<template>
    <div class="main project-plan">
        <div class="hea">
            <div class="buttons">
                <router-link :to="`contentSource/create`" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0">
                    <el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}
                        <i class="add"></i>
                    </el-button>
                </router-link>
                <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDeleteBtn') >= 0" @click="batchDel"> {{authBtns.filter(i => i.idName=='batchDeleteBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='batchDeleteBtn').length>0 && authBtns.filter(i => i.idName=='batchDeleteBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('batchDeleteBtn')].icon, 'el-icon--right']"></i></el-button>
            </div>

            
            <el-form  inline class="formlist">
                <el-form-item>
                    <el-input @keyup.enter.native="handleFilter" v-model="listQuery.sourceName" @clear="clear" clearable placeholder="请输入来源名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="search" @click="handleFilter" icon="el-icon-search">检索</el-button>
                </el-form-item>
            </el-form>    
        </div>
        

        <div class="tableList">
            <el-table :data="list"  v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="来源名称" min-width="240" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.sourceName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="链接地址" min-width="260" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.website}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="简介" min-width="280" align="center">
                    <template slot-scope="scope">
                        <span class='brief' v-html="scope.row.introduce"></span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" class-name="small-padding fixed-width" min-width="100" align="center">
                    <template slot-scope="scope">
                        <router-link :to="{ path:`contentSource/create`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0">
                            <i class="imedit" title="编辑" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"></i>
                        </router-link>
                        <i class="imdel"  title="删除" v-if="authBtns.map(i => i.idName).indexOf('deleteBtn') >= 0"  @click="deleteBtn(scope.row.id)"></i>
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
                    ></el-pagination>
                </div>
            </div>
        </div>
        


        <!-- 批量删除对话框 -->
        <!-- <el-dialog title="删除" :visible.sync="dialogDelVisible" width="30%">
            <span>确定要删除选择的消息吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="batchDelete">确 定</el-button>
                <el-button @click="dialogDelVisible = false">取 消</el-button>
            </span>
        </el-dialog> -->

    </div>
</template>

<script>
// import pagination from "../components/pagination";
import pagination from "../../../views/resource/components/pagination";
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import { getListAPI , batchDelAPI } from '@/api/contentManagement/contentSource'
import store from '@/store'




export default {
    name:'contentSource',
    components: { pagination },
    data() {
        return {
            authBtns: [],
            total: 30,
            // dialogDelVisible: false,
            list: [],
            batchList: [],
            listLoading: false,
            listQuery: {
                pageNum: 1,
                pageSize: 50,
                sourceName: ''
            }
        }
    },
    created(){
        this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    },
    mounted () {
        this.getList()
    },
    computed:{
        sidebar() {
        return this.$store.state.app.sidebar;
        }
    },
    methods: {
        getList() {
            getListAPI(this.listQuery).then(res => {
                if(res.data.code==0){
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                }else{
                    this.$message.error('获取数据失败')
                }
                
            })
        },

        // 检索
        handleFilter() {
            const sourceName = this.listQuery.sourceName;
            getListAPI(this.listQuery,{ sourceName: sourceName }).then(res => {
                 if(res.data.code==0){
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                }else{
                    this.$message.error('获取数据失败')
                }
            })
        },

        // 清空
        clear() {
            this.getList()
        },

        chioceList(val) {
            this.batchList = val;
        },

         // 单条删除
        deleteBtn(id) {
            const ids = [];
            ids.push(id);
            confirm.apply(this,['确定要删除选择内容来源吗?']).then(() => {
                batchDelAPI(ids).then(res => {
                    requestMsg.apply(this, [res.data, '删除'])
                    this.getList()
                })
            })
        },

        // 批量删除
        batchDel() {
            if(this.batchList.length === 0) {
                this.$message.warning("请至少选择一条记录进行操作!")
            } else {
                const ids = getMultipleSelectionIDs(this.batchList);
                confirm.apply(this,['确定要删除选择内容来源吗?']).then(() => {
                    batchDelAPI(ids).then(res => {
                        requestMsg.apply(this, [res.data, '删除'])
                        this.getList()
                    })
                })
            }
        },  
        // 翻页
        handleSizeChange(val) {
            console.log(val,"val6666666666666666666666666")
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            console.log(val,"val6666666666666666666666666")
            this.listQuery.pageNum = val;
            this.getList();
        },
    },
    activated() {
        this.getList();//缓存操作的新增编辑时，要更新数据
    }
}
</script>

<style scoped>
.project-plan .formlist{
    padding: 0;
    margin-top:0;
    
}
.project-plan .formlist .el-form-item{
    margin-bottom: 0 !important;
}
    .main {
        margin-top: 30px;
        margin-left: 20px;
        margin-right: 20px;
    }
    .hea {
        width: 100%;
        height: 80px;
        /* line-height: 80px; */
        background-color: #fff;
        padding: 20px 10px;
        margin-bottom: 20px;
    }

    .buttons {
        float: left;
    }

    .el-form {
        float: right;
    }

    .tableList {
        margin: 0;
        padding: 0;
        /* background-color: #fff; */
    }

    .prfooter {
        padding: 0px 21px;
        height: 40px;
        background: #3f4560;
        font-size: 13px;
        font-family: MicrosoftYaHei-Bold;
        font-weight: bold;
        line-height: 40px;
    }

    .prfooterright {
        float: right;
    }

    .btn-prev {
        background-color: #393f5b !important;
    }
    .add {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url("../../../assets/img/plan_add.png") no-repeat;
        float: left;
        margin-right:5px;
    }

    .imedit {
        display: inline-block;
        width: 20px;
        height: 22px;
        background: url("../../../assets/img/edit1.png") no-repeat;
    }
    
    .imdel {
        display: inline-block;
        width: 21px;
        height: 21px;
        background: url("../../../assets/img/del1.png") no-repeat;
    }
    .brief p img{
        width:100px !important;
        height:50px !important;
    }
    /* .prfooter{
        width: calc(100vw - 200px);
    } */
</style>
