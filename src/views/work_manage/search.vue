<template>
  <div class="project-plan">
    <div class="plan-container" id="box">
      <div class="planLeft">
        <el-tree
          style="width:200px"
          :data="navTree"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
        ></el-tree>
      </div>
      <template slot="search">
        <div class="resource-type">
          <div class="left">
            <span class="type">图书</span>
            <span>文章</span>
          </div>
          <div class="right" @click="$router.go(-1)">&lt;&lt;&nbsp;返回</div>
        </div>
      </template>
      <el-main>
         <div class="">
          <el-tabs v-model="activeName" class="resource_search formlist" @tab-click="handleClick" style="background:#fff">
            <el-tab-pane label="图书" name="1">
              <el-form style="overflow:hidden" class="tops" inline label-width="96px">
                <div @click="addBtn" style="float:left;margin-right:10px">
                  <el-button type="primary" size="mini">+</el-button>
                </div>
                <div @click="removeBtn" style="float:left;margin-right:20px">
                  <el-button type="primary" size="mini">-</el-button>
                </div>
                <div class="searchDiv">
                  <div v-for="(list,index) in question" :key="index">
                    <el-form-item v-if="index!=0" class="width66">
                      <el-select v-model="list.conditionEnd">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="list.type">
                        <el-option
                          :label="value"
                          :value="key"
                          v-for="(value,key) in options"
                          :key="key"
                        >{{value}}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.value"></el-input>
                    </el-form-item>
                    <el-form-item class="width66">
                      <el-select v-model="list.condition">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input v-model="list.valueLast"></el-input>
                    </el-form-item>
                    <el-form-item class="width80">
                      <el-select v-model="list.searchType">
                        <el-option value="1" label="精确">精确</el-option>
                        <el-option value="2" label="模糊">模糊</el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label="来源：" style="diaplay:block;clear:both">
                  <el-radio-group v-model="listQuery.dataSources">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="0">本版</el-radio>
                    <el-radio :label="1">外版</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="出版时间：">
                  <el-date-picker
                    v-model="time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class='search' @click="searchBtn" icon="el-icon-search">检索</el-button>
                  <el-button @click="resetBtn" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="文章" name="2">
              <el-form style="overflow:hidden" class="tops" inline label-width="82px">
                <div @click="addBtn" style="float:left;margin-right:10px">
                  <el-button type="primary"  size="mini">+</el-button>
                </div>
                <div @click="removeBtn" style="float:left;margin-right:20px">
                  <el-button type="primary"  size="mini">-</el-button>
                </div>
                <div class="searchDiv">
                  <div v-for="(list,index) in question" :key="index">
                    <el-form-item class="width66" v-if="index!=0">
                      <el-select v-model="list.conditionEnd">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item style="float:left;">
                      <el-select v-model="list.type">
                        <el-option
                          :label="value"
                          :value="key"
                          v-for="(value,key) in options1"
                          :key="key"
                        >{{value}}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.value"></el-input>
                    </el-form-item>
                    <el-form-item class="width66">
                      <el-select v-model="list.condition">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input v-model="list.valueLast"></el-input>
                    </el-form-item>
                    <el-form-item class="width80">
                      <el-select v-model="list.searchType">
                        <el-option value="1" label="精确">精确</el-option>
                        <el-option value="2" label="模糊">模糊</el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label="来源：" style="diaplay:block;clear:both">
                  <el-radio-group v-model="listQuery.dataSources">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="0">本版</el-radio>
                    <el-radio :label="1">外版</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button @click="searchBtn" class="search" icon="el-icon-search" type="primary">检索</el-button>
                  <el-button @click="resetBtn" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="图片" name="5">
              <el-form style="overflow:hidden" class="tops" inline label-width="82px">
                <div @click="addBtn" style="float:left;margin-right:10px">
                  <el-button  type="primary" size="mini">+</el-button>
                </div>
                <div @click="removeBtn" style="float:left;margin-right:20px">
                  <el-button  type="primary" size="mini">-</el-button>
                </div>
                <div class="searchDiv">
                  <div v-for="(list,index) in question" :key="index">
                    <el-form-item  v-if="index!=0" class="width66">
                      <el-select v-model="list.conditionEnd">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="list.type">
                        <el-option
                          :label="value"
                          :value="key"
                          v-for="(value,key) in options1"
                          :key="key"
                        >{{value}}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.value"></el-input>
                    </el-form-item>
                    <el-form-item class="width66">
                      <el-select v-model="list.condition">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input v-model="list.valueLast"></el-input>
                    </el-form-item>
                    <el-form-item class="width80">
                      <el-select v-model="list.searchType">
                        <el-option value="1" label="精确">精确</el-option>
                        <el-option value="2" label="模糊">模糊</el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label="来源：" style="diaplay:block;clear:both">
                  <el-radio-group v-model="listQuery.dataSources">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="0">本版</el-radio>
                    <el-radio :label="1">外版</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button @click="searchBtn" type="primary" class="search" icon="el-icon-search">检索</el-button>
                  <el-button @click="resetBtn" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="视频" name="6">
              <el-form style="overflow:hidden" class="tops" inline label-width="82px">
                <div @click="addBtn" style="float:left;margin-right:10px">
                  <el-button  type="primary" size="mini">+</el-button>
                </div>
                <div @click="removeBtn" style="float:left;margin-right:20px">
                  <el-button  type="primary" size="mini">-</el-button>
                </div>
                <div class="searchDiv">
                  <div v-for="(list,index) in question" :key="index">
                    <el-form-item  v-if="index!=0" class="width66">
                      <el-select v-model="list.conditionEnd">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-select v-model="list.type">
                        <el-option
                          :label="value"
                          :value="key"
                          v-for="(value,key) in options1"
                          :key="key"
                        >{{value}}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.value"></el-input>
                    </el-form-item>
                    <el-form-item class="width66">
                      <el-select v-model="list.condition">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.valueLast"></el-input>
                    </el-form-item>
                    <el-form-item class="width80">
                      <el-select v-model="list.searchType">
                        <el-option value="1" label="精确">精确</el-option>
                        <el-option value="2" label="模糊">模糊</el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label="来源：" style="diaplay:block;clear:both">
                  <el-radio-group v-model="listQuery.dataSources">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="0">本版</el-radio>
                    <el-radio :label="1">外版</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button @click="searchBtn" class="search" icon="el-icon-search">检索</el-button>
                  <el-button @click="resetBtn" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="音频" name="7">
              <el-form style="overflow:hidden" class="tops" inline label-width="82px">
                <div @click="addBtn" style="float:left;margin-right:10px">
                  <el-button type="primary" size="mini">+</el-button>
                </div>
                <div @click="removeBtn" style="float:left;margin-right:20px">
                  <el-button  type="primary" size="mini">-</el-button>
                </div>
                <div class="searchDiv">
                  <div v-for="(list,index) in question" :key="index">
                    <el-form-item v-if="index!=0" class="width66">
                      <el-select v-model="list.conditionEnd">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-select v-model="list.type">
                        <el-option
                          :label="value"
                          :value="key"
                          v-for="(value,key) in options1"
                          :key="key"
                        >{{value}}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.value"></el-input>
                    </el-form-item>
                    <el-form-item class="width66">
                      <el-select v-model="list.condition">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.valueLast"></el-input>
                    </el-form-item>
                    <el-form-item class="width80">
                      <el-select v-model="list.searchType">
                        <el-option value="1" label="精确">精确</el-option>
                        <el-option value="2" label="模糊">模糊</el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label="来源：" style="diaplay:block;clear:both">
                  <el-radio-group v-model="listQuery.dataSources">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="0">本版</el-radio>
                    <el-radio :label="1">外版</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button @click="searchBtn" class="search" icon="el-icon-search">检索</el-button>
                  <el-button @click="resetBtn" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="动画" name="8">
              <el-form style="overflow:hidden" class="tops" inline label-width="82px">
                <div @click="addBtn" style="float:left;margin-right:10px">
                  <el-button  type="primary" size="mini">+</el-button>
                </div>
                <div @click="removeBtn" style="float:left;margin-right:20px">
                  <el-button  type="primary" size="mini">-</el-button>
                </div>
                <div class="searchDiv">
                  <div v-for="(list,index) in question" :key="index">
                    <el-form-item  v-if="index!=0" class="width66"> 
                      <el-select v-model="list.conditionEnd">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-select v-model="list.type">
                        <el-option
                          :label="value"
                          :value="key"
                          v-for="(value,key) in options1"
                          :key="key"
                        >{{value}}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.value"></el-input>
                    </el-form-item>
                    <el-form-item class="width66">
                      <el-select v-model="list.condition">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.valueLast"></el-input>
                    </el-form-item>
                    <el-form-item class="width80">
                      <el-select v-model="list.searchType">
                        <el-option value="1" label="精确">精确</el-option>
                        <el-option value="2" label="模糊">模糊</el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label="来源：" style="diaplay:block;clear:both">
                  <el-radio-group v-model="listQuery.dataSources">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="0">本版</el-radio>
                    <el-radio :label="1">外版</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button @click="searchBtn"  class="search" icon="el-icon-search">检索</el-button>
                  <el-button @click="resetBtn" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="法规" name="10">
              <el-form style="overflow:hidden" class="tops" inline label-width="82px">
                <div @click="addBtn" style="float:left;margin-right:10px">
                  <el-button  type="primary" size="mini">+</el-button>
                </div>
                <div @click="removeBtn" style="float:left;margin-right:20px">
                  <el-button  type="primary" size="mini">-</el-button>
                </div>
                <div class="searchDiv">
                  <div v-for="(list,index) in question" :key="index">
                    <el-form-item  v-if="index!=0" class="width66">
                      <el-select v-model="list.conditionEnd">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-select v-model="list.type">
                        <el-option
                          :label="value"
                          :value="key"
                          v-for="(value,key) in options1"
                          :key="key"
                        >{{value}}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.value"></el-input>
                    </el-form-item>
                    <el-form-item class="width66">
                      <el-select v-model="list.condition">
                        <el-option value="&&" label="与">与</el-option>
                        <el-option value="||" label="或">或</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item >
                      <el-input v-model="list.valueLast"></el-input>
                    </el-form-item>
                    <el-form-item class="width80">
                      <el-select v-model="list.searchType">
                        <el-option value="1" label="精确">精确</el-option>
                        <el-option value="2" label="模糊">模糊</el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label="来源：" style="diaplay:block;clear:both">
                  <el-radio-group v-model="listQuery.dataSources">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="0">本版</el-radio>
                    <el-radio :label="1">外版</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="发表时间：">
                  <el-date-picker
                    v-model="time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button @click="searchBtn" class="search" icon="el-icon-search">检索</el-button>
                  <el-button @click="resetBtn" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>

          <div class="prmiddle">
            <div class="iconlist">
              <div class="iconleft pullleft">
                <em>排列：</em>
                <span :class="relevanceType == true?'blue':''" @click="order()">
                  关联度
                  <i class="el-icon-back"></i>
                </span>
                <span :class="timeType == true?'blue':''" v-if="listQuery.resourceType==1" @click="order()">
                  出版时间
                  <i class="el-icon-back"></i>
                </span>
                <span :class="timeType == true?'blue':''" v-else @click="order()">
                  上传时间
                  <i class="el-icon-back"></i>
                </span>
                <el-checkbox v-model="download" @change="downType(download)">可下载</el-checkbox>
                <el-checkbox v-model="finished" @change="finishedType(finished)">已完成</el-checkbox>
              </div>
              <div class="iconright pull-right">
                <el-checkbox v-model="listFinished" @change="fininshType = !fininshType">列表显示完成度</el-checkbox>
                <i :class="{rowCheck :viewType==2}" class="rowico marginleft" @click="viewType = 2"></i>
                <i :class="{tableCheck :viewType==1}" class="listico marginleft" @click="viewType = 1"></i>
                <span class="marginleft">共{{total}}条搜索结果</span>
              </div>
            </div>
            <div class="plancon">
              <el-table
                border
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                style="margin-bottom:50px"
                @select="selectionChange"
                v-if="viewType == true"
                :show-header="false"
              >
                <el-table-column align="center" type="selection" ref="selectionCheckbox"></el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <div class="list" style="width:100%">
                      <div class="content">
                        <img
                          :src="`${domain}${requestPath.file}?fileName=${scope.row.cover}&isOnLine=true`"
                          class="pic"
                          v-if="scope.row.cover"
                          @click="toDetails(scope.row)"
                        >
                        <img v-else src="../../assets/img/bookDefault.png" @click="toDetails(scope.row)" class="pic"/>
                        <div class="info">
                          <h1 class="green" @click="toDetails(scope.row)">{{scope.row.name}}</h1>
                          <h6>
                            <em v-if="scope.row.resourceType==1||scope.row.resourceType==2">作者：{{scope.row.author}}</em>
                            <em v-if="scope.row.resourceType==1">ISBN号：{{scope.row.isbn}}</em>                                                        
                            <em v-if="scope.row.resourceType==1">出版时间：<span v-if="scope.row.publishTime">{{scope.row.publishTime.substr(0,7)}}</span></em>
                            <em v-if="scope.row.resourceType==1">版次：{{scope.row.edition}}</em>
                            <em v-if="scope.row.resourceType==1">本版/外版：{{scope.row.dataSources}}</em>
                            <em v-if="scope.row.resourceType==1">加工状态：<span v-if="scope.row.processingState==0">已加工</span><span v-if="scope.row.processingState==1">未加工</span> <span v-if="scope.row.processingState==2">免加工</span></em>
                            <em v-if="scope.row.resourceType==1">下架/上架：<span v-if="scope.row.status==1">上架</span><span v-if="scope.row.status==2">下架</span></em>
                            <em v-if="scope.row.resourceType==1">数字版权：{{scope.row.numberCopyright}}</em>
                            <em v-if="scope.row.resourceType==1">是否绘本：{{scope.row.isPaintBook}}  </em>
                            <em v-if="scope.row.resourceType==1">是否合作书：<span v-if="scope.row.isCooperationBook==1">是</span> <span v-if="scope.row.isCooperationBook==2">否</span></em>
                            <em v-if="scope.row.resourceType!=1">所属图书：{{scope.row.bookName}}</em>
                          </h6>
                          <p class="intro" v-if="scope.row.resourceType!=1" v-html="scope.row.intro"></p>
                          
                          <div class="infoicon">
                            <span class="red marginleft" v-if="fininshType == true">完成度：90%</span>
                            <span class="marginleft bluecolor"  v-if="scope.row.resourceType==1" @click="relation(scope.row)">
                              <i class="resources"></i>相关资源
                            </span>
                            <span
                              class="marginleft bluecolor"
                              v-if="scope.row.download == 0"
                              @click="applyDown(scope.row)"
                            >
                              <i class="dwico"></i>申请下载
                            </span>
                            <span class="marginleft bluecolor"  @click="downLoad(scope.row.id)" v-else>
                              <i class="dwico"></i>下载
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="matrix" v-else>
                <div class="matrixList" v-for="(item,index) in matrixList" :key="index">
                  <el-checkbox v-model="item.checkType" style="float:left"></el-checkbox>
                  <img
                    :src="`${domain}${requestPath.file}?fileName=${item.cover}&isOnLine=true`"
                    class="image"
                    v-if="item.cover"
                    @click="toDetails(item)"
                  >
                  <img v-else src="../../assets/img/bookDefault.png" @click="toDetails(item)" class="image"/>
                  <div class="text" @click="toDetails(item)">{{item.name}}</div>
                  <div class="btn" v-if="item.download == 0" @click="applyDown(item)"><i class="el-icon-download"></i>申请下载</div>
                  <div class="btn" v-else @click="downLoad(item.id)"><i class="el-icon-download"></i>下载</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
            <div class="prfooterleft">
              <el-checkbox v-model="checkedAll" @change="allCheck()">全选</el-checkbox>
              <span class="marginleft" @click="downLoad()">批量下载</span>
              <el-popover placement="right" width="170" trigger="click">
                <p @click="exportData" style="margin-bottom:10px">批量导出图书元数据</p>
                <p @click="composition">排版文件</p>
                <span class="marginLeft" slot="reference">更多</span>
              </el-popover>
            </div>
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
        </div>
      </el-main>    
    </div>
    <el-dialog title="关联内容" :visible.sync="relatedDialog" class="backgroundDialog relatedDialog">
      <el-form :model="relatedForm" label-width="120">
        <el-form-item label="资源类型" style="margin-right:20px">
          <el-select v-model="relatedForm.resourceType" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option v-for="(key,value) in typeList" :key="key" :label="key" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="relatedForm.name"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchRelated" icon="el-icon-search">检索</el-button>
      </el-form>
      <el-table
        border
        v-loading="relateListLoading"
        element-loading-text="给我一点时间"
        ref="multipleTable1"
        :data="relateList"
        tooltip-effect="dark"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="上传时间" align="center"></el-table-column>
        <el-table-column prop="status" label="类型" align="center">
          <template slot-scope="scope">{{typeList[scope.row.resourceType]}}</template>
        </el-table-column>
      </el-table>
      <div class="prfooter">
        <pagination @pagesize="pagesizeFun2" :total="total2" @currentPage="currentPageFun2"></pagination>
      </div>
    </el-dialog>
    <!--批量导出Excel-->
    <el-dialog title="批量导出" :visible.sync="exportExcelDialog" class="backgroundDialog excelDialog">
      <el-form ref="exportExportform" :model="exportExportform" label-width="82px">
        <el-form-item label="导出范围">
          <el-select v-model="exportExportform.range">
            <el-option label="全部数据" value="0"></el-option>
            <el-option label="选中数据" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导出字段">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAllWords"
            @change="handleCheckAllWordsChange"
          >全部字段</el-checkbox>
          <el-checkbox-group v-model="exportExportform.words" @change="handleCheckedWordsChange">
            <el-checkbox
              v-for="(value,key) in excelListItems"
              :label="key"
              name="words"
              :key="key"
            >{{value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmExport">导出</el-button>
        <el-button @click="exportExcelDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--申请下载-->
    <el-dialog title="申请下载" :visible.sync="applyDialog" @close="closeApply" class="backgroundDialog exportExcelDialog">
      <el-form ref="applyform" :model="applyform" label-width="82px">
        <el-form-item label="文件形式" v-if="this.listQuery.typesettingList!='*'">
          <el-checkbox-group v-model="applyform.fileList">
            <el-checkbox v-for="(value,key) in fileList" :label="key" name="words" :key="key" >{{value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="申请原因" prop="intro">
          <el-input v-model="applyform.reason" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmApply" class="success" :loading="applyLoading" type="primary">确定</el-button>
        <el-button @click="applyDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--下载-->
    <el-dialog title="下载" :visible.sync="downDialog" @close="closeDown" class="backgroundDialog exportExcelDialog">
      <el-form ref="downForm" :model="downForm" label-width="82px">
        <el-form-item label="文件形式">
          <el-checkbox-group v-model="downForm.typeList" >
            <el-checkbox v-for="(value,key) in fileList" :label="key" name="words" :key="key" >{{value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDown" :loading="downLoading" class="success">确定</el-button>
        <el-button @click="downDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { getMultipleSelectionIDs } from "@/filters/getIds";
import { getNavAPI, fileAPI, exportListAPI,getDepartmentAPI,} from "@/api/resource/common";
import "@/styles/resource.scss";
import { getRelatedList } from "@/api/resource/ebook";
import queryString from "query-string";
import { getTypeAPI, saveAPI } from "@/api/work/index";
import { getListAPI } from "@/api/work/search";
import { predownAPI } from "@/api/work/apply";
import { confirm } from "@/utils/publicFunctions";
export default {
  name: "plan",
  data() {
    return {
      tabName:"1",
      domain: process.env.BASE_API,
      requestPath: requestPath,
      typeList: [],
      sourceList: ["全部", "本版", "外版"],
      sourceIndex: 0,
      relevanceType: true,
      timeType: false,
      time: [],
      navTree: [],
      defaultProps: {
        children: "list",
        label: "showName"
      },
      fininshType: false,
      list: [],
      matrixList: [],
      total: 0,
      total2: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        dataSources: null,
        resourceType: 1,
        download: null,
        criterionStatus:[]
      },
      options: {
        name: "标题",
        author: "作者",
        isbn: "ISBN",
        executiveEditor:'责任编辑',
        edition:'版次',
        keywords: "关键词",
        seriesName: "丛书名",
        intro: "简介",
        publisher: "出版社"
      },
      options1: {
        author: "作者",
        name: "标题",
        keywords: "关键词",
        intro: "简介",
      },
      options2: {
        name: "条文",
        bookName: "所属图书"
      },
      viewType: true,
      multipleSelection: [],
      ids: [],
      listLoading: true,
      download: false,
      fininsh: false,
      listFinished: false,
      finished: false,
      checkedAll: false,
      downLoadIds: [],
      relatedDialog: false,
      relatedForm: {
        pageNum: 1,
        pageSize: 50
      },
      relateList: [],
      relateListLoading: true,
      downDialog:false,
      downForm:{
        typeList:[],
        ids:[]
      },
      applyDialog: false,
      applyform: {
        file: [],
        fileList: []
      },
      fileList: [],
      downParams: {},
      question: [
        {
          type: "name",
          value: "",
          condition: "&&",
          valueLast: "",
          searchType: "1"
        }
      ],
      exportExcelDialog: false,
      exportExportform: {
        words: [],
        range: ""
      },
      excelListItems: [],
      isIndeterminate: false,
      checkAllWords: false,
      arrayWordsAll: [], //导出excel结束
      rangeExcelList: {
        objectIds: [],
        isDelete: 0,
        names: null,
        resourceType: 1
      },
      activeName: "1",
      departmentList: [],
      applyLoading:false,
      downLoading:false,
      linkList: {
        1: "book_store/addBookResource?type=view&id=",
        2: "article/add_article?type=view&detailsId=",
        5: "picture_store/add_pic?type=view&id=",
        6: "video_store/add_video?type=view&id=",
        7: "audio_store/add_audiotype=view&id=",
        8: "animation_store/add_animation?type=view&id=",
        9: "courseware/create?type=view&id=",
        10: "statute/create?type=view&id=",
        14: "clause/add_clause?type=view&id=",
        15: "pdf/create?type=view&id=",
        16: "expert/create?type=view&id="
      },
      linkRelatedList:{
        1:'book_store/relatedResource',
        2:'article/relatedResource',
        5:'picture_store/relatedResource',
        6:'video_store/relatedResource',
        7:'audio_store/relatedResource',
        8:'animation_store/relatedResource',
        10:'statute/relatedResource',
        14:'clause/related_res',
        15:'pdf/relatedResource'      
      },
      allLength:0,
      acount:0
    };
  },
  watch: {
    "$store.state.pageTemp.search_value": function(e) {
      this.listLoading = true;
      this.listQuery.keyword = e;
      this.getList();
    }
  },
  mounted() {
    this.getNav();
    this.getList();
    this.getType();
    this.getfileList();
    this.getDepartmentList()
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    
    toDetails(row){
      this.$router.push('/resource/'+this.linkList[row.resourceType]+row.id)
    },
    relation(row) {
      this.$router.push('/resource/'+this.linkRelatedList[row.resourceType]+'?id='+row.id+'&name='+row.name+'&type=view')
    },
    getType() {
      getTypeAPI().then(res => {
        this.typeList = res.data.data;
      });
    },
    getNav() {
      // 左侧自定义分类
      getNavAPI().then(res => {
        res.data.data = [{ showName: "全部" }].concat(res.data.data);
        res.data.code === 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    },
    getfileList() {
      fileAPI().then(res => {
        this.fileList = res.data.data;
      });
    },
    getList() {
      getListAPI(this.listQuery).then(res => {
        if (res.data.code==0) {
          this.list = res.data.data.list;
          this.matrixList = this.list.map(el => {
            return { checkType: false, ...el };
          });
          this.total = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
        this.checkedAll=false;
        this.multipleSelection=[]
      });
    },
    sourceChange(index) {
      //本版和外版
      this.listLoading = true;
      this.sourceIndex = index;
      if (index == 0) {
        this.listQuery.dataSources = "";
      } else {
        this.listQuery.dataSources = index-1;
      }
      this.getList();
    }, 
    getDepartmentList() {
      getDepartmentAPI().then(res => {
        this.departmentList = res.data.data;
      });
    },
    order() {
      //出版时间
      this.listLoading = true;
      this.timeType = !this.timeType;
      this.relevanceType = !this.relevanceType;
      if (this.timeType) {
        if(this.listQuery.resourceType!=1){
           this.listQuery.orderBy = "uploadTime desc";
        }else{
          this.listQuery.orderBy = "publishTime desc";
        }
        
      } else {
        this.listQuery.orderBy = "";
      }
      this.getList();
    },
    downType(type) {
      //可下载
      this.listLoading = true;
      if (type) {
        this.listQuery.download = 1;
      } else {
        this.listQuery.download = "";
      }
      this.getList();
    },
    finishedType(type) {
      //已完成
      this.listLoading = true;
      if (type) {
        this.listQuery.status = 1;
      } else {
        this.listQuery.status = null;
      }
      this.getList();
    },
    //批量或者单条下载
    downLoad(id) {     
      if(id){
        this.downForm.ids=id
        if(this.listQuery.typesettingList=="*"){
          this.downDialog=false;
          let data={
            ids:this.downForm.ids,
            typeList:'排版文件'
          }
          predownAPI(data).then( res => {
            if(res.data.status){
              this.$message.success('下载成功');
              window.open(`${process.env.BASE_API}${res.data.data}`);
            }else {
              this.$message.error(`${res.data.msg}`);
            }
            this.downLoading=false
          })
        }else{
          this.downDialog=true;
        }       
      }else{
        this.downLoadIds=[];  
        if(this.viewType==1){//table下载
          this.downLoadIds = getMultipleSelectionIDs(this.multipleSelection)
        } else if(this.viewType ==2){//矩阵下载
          this.matrixList.map(el =>{
            if(el.checkType == true) {
              this.downLoadIds.push(el.id)
            }
          })
        }
        if(this.downLoadIds.length>0){
          this.downDialog=true;
          let ids = this.downLoadIds.join(',');
          this.downForm.ids=ids
        } else{
          this.$message.warning('至少选择一条数据进行操作')
        }
      }
    },
    closeDown(){
      this.downForm={
        typeList:[],
        ids:''
      }
    },
    //确定下载
    confirmDown(){
      this.downLoading=true
      let data={
        ids:this.downForm.ids,
        typeList:this.downForm.typeList.join(",")
      }
      predownAPI(data).then( res => {
        if(res.data.status){
          this.downLoading=false;
          this.downDialog=false;
          this.$message.success('下载成功');
          window.open(`${process.env.BASE_API}${res.data.data}`);
        }else {
          this.$message.error(`${res.data.msg}`);
        }
        this.downLoading=false
      })
    },
    exportData() {
      //批量导出图书元数据
      this.downLoadIds = [];
      if (this.viewType) {
        //table导出
        this.downLoadIds = getMultipleSelectionIDs(this.multipleSelection);
      } else {
        //矩阵导出
        this.matrixList.map(el => {
          if (el.checkType == true) {
            this.downLoadIds.push(el.id);
          }
        });
      }
      if (this.downLoadIds.length > 0) {
        this.getWordsList();
        this.exportExcelDialog = true;
        this.rangeExcelList.objectIds = [];
      } else {
        this.$message.warning("至少选择一条数据进行操作");
      }
    },
    //排版文件
    composition(){
      if(this.multipleSelection.length>0){
        this.allLength=this.multipleSelection.length;
        this.acount=0;
        for(let j =0; j<this.multipleSelection.length>0 ; j++){
          if(this.multipleSelection[j].download==0){
            this.acount+=1
          }
        }
        confirm.apply(this, ["已选"+this.allLength+",其中"+this.acount+"需申请后下载"]).then(() => {
          let data={
            ids:getMultipleSelectionIDs(this.multipleSelection).join(","),
            typeList:'排版文件'
          }
          predownAPI(data).then( res => {
            if(res.data.status){
              window.open(`${process.env.BASE_API}${res.data.data}`);
            }else {
              this.$message.error(`${res.data.msg}`);
            }
          })  
        })
      }else{
        this.$message.warning('至少选择一条数据进行操作')
      }
      
    },
    //导出字段列表
    getWordsList() {
      exportListAPI().then(res => {
        if (res.data.status) {
          this.excelListItems = res.data.data;
          for (var key in this.excelListItems) {
            this.arrayWordsAll.push(key);
          }
        } else {
          this.$message.error("获取字段列表失败");
        }
      });
    },
    //导出excel
    handleCheckedWordsChange(value) {
      let checkedCount = value.length;
      this.checkAllWords = checkedCount === this.arrayWordsAll.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.arrayWordsAll.length;
    },
    // 确认导出
    confirmExport() {
      if (this.exportExportform.range == "0") {
        this.rangeExcelList.objectIds = [];
        this.rangeExcelList.names = this.arrayWordsAll.join(",");
      } else {
        this.rangeExcelList.objectIds = this.downLoadIds.join(",");
        this.rangeExcelList.names = this.exportExportform.words.join(",");
      }
      this.rangeExcelList=Object.assign(this.rangeExcelList,this.listQuery)
      delete this.rangeExcelList.pageNum;
      delete this.rangeExcelList.pageSize;
      this.excelListData = queryString.stringify(this.rangeExcelList);
      window.open(
        `${process.env.BASE_API}${requestPath.resource}/public/export_book?${
          this.excelListData
        }`
      );
    },
    handleCheckAllWordsChange(val) {
      this.exportExportform.words = val ? this.arrayWordsAll : [];
      this.isIndeterminate = false;
    },
    selectionChange(selection, row) {
      //复选框
      this.multipleSelection = selection;
    },
    allCheck() {
      //全选
      if (this.checkedAll) {
        //全选
        if (this.viewType==1) {
          //table全选
          this.$refs.multipleTable.toggleAllSelection();
          this.multipleSelection = this.list;
        } else {
          //矩阵全选
          this.matrixList.map(el => {
            el.checkType = true;
          });
        }
      } else {
        //取消全选
        if (this.viewType==1) {
          //table取消全选
          this.$refs.multipleTable.clearSelection();
          this.multipleSelection = [];
        } else {
          //矩阵取消全选
          this.matrixList.map(el => {
            el.checkType = false;
          });
        }
      }
    },
    applyDown(row) {
      //申请下载
      this.downParams = row;
      this.applyDialog = true;
    },
    //关闭申请下载、
    closeApply(){
      this.applyform={
        file:[],
        fileList:[],
        reason:''
      }
    },
    
    getDialogList() {
      //相关资源list
      getRelatedList(this.relatedForm).then(res => {
        if (res.status) {
          this.relateList = res.data.data.list;
          this.total2 = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.relateListLoading = false;
      });
    },
    confirmApply() {//申请下载
      this.applyLoading=true
      this.applyform.arfList = [{
        deptId: this.downParams.department ,
        resourceId: this.downParams.id,
        resourceType: this.downParams.resourceType,
        resourceName:this.downParams.name
      }]
      if(this.applyform.fileList.length<1 && this.applyform.reason==''){
        this.$message.error('请填写内容！');
        return;
      }
      if(this.listQuery.typesettingList=="*"){
        this.applyform.file ='排版文件'
      }else{
        this.applyform.file = this.applyform.fileList.join(',')
      }
      
      const {fileList,...rest} = this.applyform
      saveAPI(rest).then(res =>{
        if (res.data.status) {
          this.$message.success('申请成功！');
          // messageAPI()
          this.applyDialog = false;
        } else {
          this.$message.error(`${res.data.msg}`)
        }
        this.applyLoading=false
      })
    },
    addBtn() {
      const addList = {
        type: "name",
        value: "",
        condition: "&&",
        valueLast: "",
        searchType: "1",
        conditionEnd: "&&"
      };
      
      this.question.push(addList);
    },
    removeBtn() {
      //删除最后一项
      if (this.question.length > 1) {
        this.question.pop();
      }
    },
    searchBtn() {
      //搜索
      var string = "";
      if (this.time) {//检索时间赋值
        this.listQuery.startTime = this.time[0];
        this.listQuery.endTime = this.time[1];
      } else {
        this.listQuery.startTime = null;
        this.listQuery.endTime = null;
      }
      if(this.question.length==1&&this.question[0].value==""&&this.question[0].valueLast==""){
        this.listQuery.keyword = null;
        this.getList()
      }else{
        this.question.map((el, index) => {
          if(el.value==""&&el.valueLast==""){
            this.$message.warning('请把信息补全')
            return
          }else{
            
              if (index == 0) {
              //第一个与后面（多一个关系）
              if (el.searchType != 1)
                string =
                  el.type +
                  (el.value ? ":" : "") +
                  "*" +
                  el.value +
                  "*" +
                  (el.valueLast
                    ? " " +
                      el.condition +
                      " " +
                      el.type +
                      ":" +
                      "*" +
                      el.valueLast +
                      "*"
                    : "");
              else
                string =
                  el.type +
                  (el.value ? ":" : "") +
                  el.value +
                  (el.valueLast
                    ? " " + el.condition + " " + el.type + ":" + el.valueLast
                    : "");
            } else {
              if (el.searchType != 1)
                string =
                  string +
                  " " +
                  el.conditionEnd +
                  " " +
                  "(" +
                  el.type +
                  (el.value ? ":" : "") +
                  "*" +
                  el.value +
                  "*" +
                  (el.valueLast
                    ? " " +
                      el.condition +
                      " " +
                      el.type +
                      ":" +
                      "*" +
                      el.valueLast +
                      "*"
                    : "") +
                  ")";
              else
                string =
                  string +
                  " " +
                  el.conditionEnd +
                  " " +
                  "(" +
                  el.type +
                  (el.value ? ":" : "") +
                  el.value +
                  (el.valueLast
                    ? " " +
                      el.condition +
                      " " +
                      el.type +
                      ":" +
                      "*" +
                      el.valueLast +
                      "*"
                    : "") +
                  ")";
            }
            if (this.time) {
              this.listQuery.startTime = this.time[0];
              this.listQuery.endTime = this.time[1];
            } else {
              this.listQuery.startTime = null;
              this.listQuery.endTime = null;
            }
            this.listQuery.keyword = string;
            //标准
            if(this.listQuery.criterionStatus!=null){
              if(this.listQuery.criterionStatus.length>0){
                this.listQuery.criterionStatus=this.listQuery.criterionStatus.join(",")
              }
            }
            
            
          }
        });
        this.getList()
      }
      
      
    },
    resetBtn() {
      this.listQuery= {
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        dataSources: null,
        resourceType: this.listQuery.resourceType,
        download: null,
        criterionStatus:[]
      },
      this.question = [
        {
          type: "name",
          value: "",
          condition:"&&",
          valueLast: "",
          searchType: "1"
        }
      ];
      this.listQuery.startTime = null;
      this.listQuery.endTime = null;
      this.listQuery.keyword = null;
      this.time = [];
      this.listQuery.dataSources = null;
      this.getList();
    },
    searchRelated() {
      //检索
      this.getDialogList();
    },
    // 翻页
    pagesizeFun2(val) {
      this.relatedForm.pageSize = val;
      this.getDialogList();
    },
    currentPageFun2(val) {
      this.relatedForm.pageNum = val;
      this.getDialogList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleNodeClick(data) {
      //点击树节点获取table数据
      //this.listQuery.diyTypeId = data.id;
      this.listQuery.code = data.code;
      this.getList();
    },
    //切换
    handleClick(tab,event) {
      this.tabName=tab.name;
      this.listLoading = true;
      this.time=null;//重置时间插件
      this.listQuery={
        pageNum: 1,
        pageSize: this.listQuery.pageSize,//不重新赋值，切换分页，接口默认反10；
        dataSources: null,
        resourceType: 1,
        download: null,
        typesettingList:"",
        numberCopyright:null,
        status:null,
        isPaintBook:null,
        isCooperationBook:null,
        startTime:null,
        endTime:null
      }
      if(tab.name!="1*"){
        this.listQuery.resourceType = Number(tab.name)
      }else{
        this.listQuery.resourceType = 1;
        this.listQuery.typesettingList="*"
      }
      this.question=[
        {
          type: "name",
          value: "",
          condition: "&&",
          valueLast: "",
          searchType: "1"
        }
      ];
      // if(tab.name=='14'){//切换条问默认选中条文
      //   this.question[0].type="article";
      // }
      this.getList();
    }
  }
};
</script>


<style>
/* .plancon .el-table__footer-wrapper,
.plancon .el-table__header-wrapper {
  display: none !important;
} */
.excelDialog .el-dialog {
  width: 600px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -253px;
  margin-top: -220px !important;
}
.excelDialog .el-checkbox + .el-checkbox {
  margin: 0;
}
.excelDialog .el-checkbox {
  width: 120px;
  float: left;
  margin: 0;
}
</style>

<style lang="less" scoped>
#box{
    .el-main{
      flex-basis:100%;
    }
    .prfooter.opend{
      width: calc(100% - 420px);
    }
    .prfooter.closed{
      width: calc(100% - 276px);
    }
    .formlist .el-form-item{
      margin-right:12px
    }
    
  }
.searchDiv:after {
  display: table;
  content: "";
  clear: both;
}
p {
  margin: 0;
  padding: 0;
}
.prmiddle {
  margin-top: 30px;
}
.iconlist {
  height: 40px;
  line-height: 40px;
  padding: 0px 21px;
  background: rgba(245, 247, 250, 1);
  border: 1px solid #dcdfe6;
  em {
    font-style: normal;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: #848aa1;
  }
  span {
    margin-right: 21px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: #848aa1;
    cursor: pointer;
    .el-icon-back{
      font-weight: 800;
      font-size: 12px;
      transform: rotate( -90deg )
    }
  }
  .marginleft{
      margin-right:0px;
    }
  .blue {
    color: #02b4d0;
  }
}
.pullleft {
  float: left;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.exportExcelDialog .el-dialog{
    width:550px;
    // height:500px;
    position:absolute;
    left:50%;
    top:50%;
    margin-left:-253px;
    margin-top:-300px !important;
  }
  .downloadSty{
    padding-left: 12px;
    font-size: 12px;
    margin-bottom: 30px;
  }
.iconright {
  // width: 340px;
  float: right;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.rowico {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../assets/img/rowico.png") no-repeat;
}
.listico{
  display:inline-block;
  width:14px;
  height:14px;
  background:url("../../assets/img/listIcon2.png") no-repeat;    
}
.rowCheck{
  background:url("../../assets/img/rowIcon2.png") no-repeat;
}
.tableCheck{
  background:url("../../assets/img/listico.png") no-repeat;
}
.marginleft{
  margin-left:20px;
  cursor: pointer;
}
.plancon {
  background: #fff;
  padding: 16px;
  width: 100%;
  // height: 500px;
  // overflow: scroll;
  min-width: 1000px;
}
.content {
  border-bottom: 1px solid #ccc;
  display: flex;
  padding-top: 20px;
  &:last-child {
    border-bottom: 0;
  }
}
.list {
  width: 100%;

  .pic {
    width: 121px;
    height: 121px;
    margin: 0 10px;
  }
  .info {
    flex: 1;
    h1 {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      height: 60px;
      line-height: 20px;
    }
    h6,
    p {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
    }
    h6 {
      height: 38px;
      line-height: 18px;
      margin-top: 8px;
    }
    h6 em {
      font-style: normal;
      margin-right: 50px;
      color: #bbbbbb;
      display: inline-block;
      margin-bottom: 25px;
    }
    p {
      height: 36px;
      line-height: 18px;
      margin-top: 15px;
      color: #7e7e7e;
    }
  }
  .el-checkbox {
    clear: both;
  }
  .el-checkbox {
    float: left;
    margin-top: 45px;
  }
}
.matrix{
  padding-left: 3%;
  padding-top:10px;
  overflow: hidden;
  width: 100%;
}
.matrixList {
  width: 17%;
  height: 355px;
  padding: 10px 20px;
  text-align: center;
  margin-bottom: 30px;
  float: left;
  margin-right: 3%;
  box-sizing: padding-box;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 3px 3px #e5e5e5;
  }
  .el-checkbox {
    float: left;
    margin-right:0px;
  }
  .image {
    height: 160px;
    width: 120px;
    margin-bottom: 18px;
    display: inline-block;
    margin-top: 20px;
  }
  .text {
    line-height: 20px;
    margin-bottom: 26px;
    height: 40px;
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .btn {
    height: 30px;
    border: 1px solid rgba(235, 238, 245, 1);
    color: #409eff;
    line-height: 30px;
    &:hover{
      color: #fff;
      background: rgba(64, 158, 255, 1);
    }
  }
}
.infoicon {
  margin-right: 28px;
  float: right;
  margin-bottom: 14px;
}
.red {
  color: #f56c6c;
}
.intro {
  line-height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-right: 28px;
  margin-bottom: 20px;
}
.infoicon {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.resources {
  display: inline-block;
  width: 16px;
  height: 18px;
  background: url("../../assets/img/resourceico.png") no-repeat;
  margin-right: 3px;
  vertical-align: text-top
}
.dwico {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: url("../../assets/img/downloadico.png") no-repeat;
  margin-right: 3px;
  vertical-align: text-top
}
.bluecolor {
  color: #409eff;
  cursor: pointer;
}
.green {
  color:#404761;
    width: 100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    cursor:pointer;
    &:hover{
      color:#02B4D0;
      text-decoration:underline;
    }
}
.prfooter {
  .marginLeft {
    margin-left: 10px;
  }
  .el-checkbox {
    color: #ffffff;
  }
  span {
    color: #ffffff;
  }
}
.relatedDialog .el-form-item {
  width: 240px;
  display: inline-block;
}
.relatedDialog .el-select {
  width: 150px;
}
.table {
  margin-top: 10px;
}
.relatedDialog .el-input {
  width: 150px;
}
.resource-type {
  display: inline-block;
  padding: 0 30px;
  height: 70px;
  line-height: 70px;
  // display:flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  .left {
    margin-left: 70px;
    float: left;
    .type {
      padding: 0 20px;
      // font-size:14px;
      color: 14px;
    }
    .active {
      color: #02b4d0;
    }
  }
  .right {
    float: right;
    color: #02b4d0;
    cursor: pointer;
  }
}
</style>