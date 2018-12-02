<template>
    <div>
        <div class="wo-search">
            <div class="wo-back" @click="goBack()">
                <i class="iconfont">&#xe600;</i>
            </div>
            <div>
                <van-col span="18" offset="4" class="reset">
                    <van-search
                            v-model="value"
                            placeholder="请输入搜索关键词"
                            @search="onClick"
                    />
                </van-col>
            </div>
        </div>
        <div class="wo-tab">
            <van-col span="24">
                <van-row>
                    <van-tabs v-model="active" swipeable class="reset" @click="onClick()">
                        <van-tab v-for="oTab in oTabs" :title="oTab.text">
                        </van-tab>
                    </van-tabs>
                    <div class="woIcon " @click="chooseTypeDiv('show')">
                        <div class="btn-more">
                        </div>
                    </div>
                </van-row>
                <van-row v-if="states_show"><!--  style="height: 40px;"-->
                    <van-tabs class="reset1" animated swipeable v-model="active1" @click="onClick1()">
                        <van-tab v-for="sta in woStates[active -1].states" :title="sta.text">
                        </van-tab>
                    </van-tabs>
                </van-row>
            </van-col>
        </div>
        <div class="orderListDiv reset2">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                        v-model="loading"
                        :finished="finished"
                        @load="onLoad"
                >
                    <div v-for="item in woOrderList">
                        <div class="myCard" @click="toDetail(item.order_id)">
                            <van-row>
                                <van-col span="14" class="orderTitle">
                                    <div v-for="type in oTabs" v-if="type.value == item.order_type">
                                        类型：{{type.text}}
                                    </div>
                                </van-col>
                                <div v-for="field in item.fields">
                                    <van-col v-if="field.field == 'receive_date'" span="8" class="orderTime">
                                        {{field.value}}
                                    </van-col>
                                </div>
                                <van-col span="24" class="myLine"></van-col>
                            </van-row>
                            <van-row>
                                <div class="orderCard">
                                    <div class="orderImg">
                                        <div class="orderState1" v-if="item.state.style == 'wo-success'">
                                            {{item.state.text}}
                                        </div>
                                        <div class="orderState2" v-if="item.state.style == 'wo-error'">
                                            {{item.state.text}}
                                        </div>
                                    </div>
                                    <div class="orderInfo">
                                        <p class="goodsName" v-for="field in item.fields">
                                            <span v-if="field.field == 'goods_name'">{{field.value}}</span>
                                        </p>
                                        <p class="orderID" v-for="field in item.fields"
                                           v-if="field.field == 'order_id'">
                                            <span class="fieldName">订单编号：</span>
                                            <span>{{field.value}}</span>
                                        </p>
                                        <p class="contacts" v-for="field in item.fields"
                                           v-if="field.field == 'contact_people'">

                                        </p>
                                        <p class="accNbr" v-for="field in item.fields" v-if="field.field == 'acc_nbr'">
                                            <span>办理号码：</span>
                                            <span>{{field.value}}</span>
                                        </p>
                                    </div>
                                </div>
                            </van-row>
                        </div>
                        <van-row v-if="item.widgets" class="cardFoot">
                            <van-col span="24" class="myLine"></van-col>
                            <div @click="queryEOrder(item.order_id,item.order_type)">
                                <van-col v-for="button in item.widgets" span="8" offset="16" class="lookBtn">
                                    查看受理单
                                </van-col>
                            </div>
                        </van-row>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="nullListDiv" v-if="nullList_show">
            <div class="listIsNull">
            </div>
            <div class="nullListMsg" v-if="active == 0">
                您还没有任何订单
            </div>
            <div class="nullListMsg" v-else>
                暂无此类订单
            </div>
        </div>
        <van-popup v-model="show_choose" position="bottom" :overlay="true">
            <div class="chooseTypeDiv">
                <van-row>
                    <div class="chooseTypeTitle">
                        请选择类型：
                    </div>
                    <div class="cancelBtn"  @click="chooseTypeDiv('cancel')"></div>
                </van-row>
                <van-row>
                    <div class="typeBtn" @click="chooseType('SMZDJ')">预付费实名</div>
                    <div class="typeBtn" @click="chooseType('KDJYSL_1')">宽带开户(先付)</div>
                    <div class="typeBtn" @click="chooseType('KDJYSL_2')">宽带开户(后付)</div>
                    <div class="typeBtn" @click="chooseType('KDJYSL_3')">宽带开户(预约)</div>
                    <div class="typeBtn" @click="chooseType('APPZHWJ')">智慧沃家</div>
                    <div class="typeBtn" @click="chooseType('JKYBKH')">集客异步开户</div>
                    <div class="typeBtn" @click="chooseType('BSS_PZ')">BSS订单拍照</div>
                    <div class="typeBtn" @click="chooseType('TYMBTC')">号卡开户</div>
                </van-row>

            </div>
        </van-popup>
        <van-popup  v-model="show_popup">请登录</van-popup>
    </div>
</template>
<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                msg: '',
                show: false,
                states_show: false,//第二层tab是否展示
                nullList_show: false, //订单列表为空，是否展示
                value: '',
                active: 0,//第一层tab标记
                active1: 0,//第二层tab标记
                loading: false, //列表加载标记
                finished: false, //列表停止加载
                isLoading: false,//下拉加载状态
                show_popup: false,//未登录提示
                show_choose: false,//类型选择器
                start: 0,//加载起始位置
                oTabs: [
                    {text: '全部', value: 'searchPage'},
                    {text: '预付费实名', value: 'SMZDJ'},
                    {text: '宽带开户(先付)', value: 'KDJYSL_1'},
                    {text: '宽带开户(后付)', value: 'KDJYSL_2'},
                    {text: '宽带开户(预约)', value: 'KDJYSL_3'},
                    {text: '智慧沃家', value: 'APPZHWJ'},
                    {text: '集客异步开户', value: 'JKYBKH'},
                    {text: 'BSS订单拍照', value: 'BSS_PZ'},
                    {text: '号卡开户', value: 'TYMBTC'},
                    {text:' ',value:''}
                ],
                woStates: [
                    {
                        type: 'SMZDJ',
                        states: [{text: '登记成功', value: '0'}, {text: '登记失败', value: '1'}, {text: '订单失效', value: '2'}]
                    },
                    {
                        type: 'KDJYSL_1',
                        states: [{text: '等待审核', value: '0'}, {text: '等待竣工', value: '1'}, {
                            text: '交易成功',
                            value: '2'
                        }, {text: '交易失败', value: '3'}]
                    },
                    {
                        type: 'KDJYSL_2',
                        states: [{text: '等待审核', value: '0'}, {text: '等待竣工', value: '1'}, {
                            text: '交易成功',
                            value: '2'
                        }, {text: '交易失败', value: '3'}]
                    },
                    {
                        type: 'KDJYSL_3',
                        states: [{text: '在途订单', value: '0'}, {text: '交易成功', value: '1'}, {text: '交易失败', value: '2'}]
                    },
                    {
                        type: 'APPZHWJ',
                        states: [{text: '等待审核', value: '0'}, {text: '等待竣工', value: '1'}, {
                            text: '交易成功',
                            value: '2'
                        }, {text: '交易失败', value: '3'}]
                    },
                    {
                        type: 'JKYBKH',
                        states: [{text: '等待开户', value: '0'}, {text: '开户成功', value: '1'}]
                    },
                    {
                        type: 'BSS_PZ',
                        states: [{text: '上传成功', value: '0'}, {text: '上传失败', value: '1'}]
                    },
                    {
                        type: 'TYMBTC',
                        states: [{text: '成功', value: '0'}, {text: '失败', value: '1'}]
                    },
                ],
                woOrderList: [],
                partOfList: [],//当前请求新增列表
                testList: [
                    {
                        "order_type": "TYMBTC",
                        "order_id": "WCSAH18112218585701148298",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {
                            "code": "05",
                            "text": "交易成功",
                            "style": "wo-success"
                        },
                        "fields": [
                            {
                                "field": "order_id",
                                "name": "订单编号",
                                "value": "WCSAH18112218585701148298"
                            },
                            {
                                "field": "acc_nbr",
                                "name": "办理号码",
                                "value": "18529452380"
                            },
                            {
                                "field": "goods_name",
                                "name": "",
                                "value": "BSS测试克隆商品"
                            },
                            {
                                "field": "receive_date",
                                "name": "",
                                "value": "2018-11-22 18:58:57"
                            }
                        ],
                        "widgets": [
                            {
                                "type": "button",
                                "title": "查询受理单",
                                "action": "queryEOrder(order.order_id)"
                            }
                        ]
                    },
                    {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112411250053985",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112411250053985"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18600000000"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-24 11:25:00"
                        }, {
                            "field": "goods_name",
                            "name": "",
                            "value": "【营业】1元50套餐测试-副本-传统营业厅"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112319020928615",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112319020928615"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18600000000"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 19:02:10"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112319010234262",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112319010234262"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18589246178"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 19:01:03"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112319004186445",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112319004186445"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18589246178"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 19:00:41"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112319003170528",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112319003170528"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18589246178"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 19:00:31"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112317555972623",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112317555972623"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18602032656"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 17:55:59"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112316095962435",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112316095962435"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18602032273"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 16:09:59"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112316021438832",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112316021438832"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18589246178"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 16:02:15"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112316015710149",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112316015710149"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18589246178"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 16:01:58"
                        }]
                    }, {
                        "order_type": "SMZDJ",
                        "order_id": "SMZ2018112316013223304",
                        "thumb": "build/img/store/realName/idcard.png",
                        "state": {"code": "43", "text": "登记失败", "style": "wo-error"},
                        "fields": [{
                            "field": "order_id",
                            "name": "订单编号",
                            "value": "SMZ2018112316013223304"
                        }, {"field": "acc_nbr", "name": "办理号码", "value": "18589240000"}, {
                            "field": "receive_date",
                            "name": "",
                            "value": "2018-11-23 16:01:32"
                        }]
                    }],
            }
        },
        mounted() {
            this.onLoad();
        },
        methods: {
            goBack() {
                this.$router.back(-1)
            },
            onClick() {
                if (this.active != 0) {
                    this.states_show = true;
                }
                else {
                    this.states_show = false;
                }
                this.active1 = 0;
                this.woOrderList = [];
                this.onLoad();
            },
            onClick1() {
                this.woOrderList = [];
                this.onLoad();
            },
            onLoad() { //上拉加载
                setTimeout(() => {
                    this.finished = false;
                    this.getOrderList();
                    // 加载状态结束
                    this.loading = false;
                    //设置提示展示
                    if (this.partOfList.login == false) {
                        this.nullList_show = false;
                        this.show_popup = true;
                    } else { //合并新增列表
                        this.nullList_show = false;
                        this.woOrderList = this.woOrderList.concat(this.partOfList);
                    }
                    if (this.woOrderList.length == 0) { //打开列表无数据时提示
                        this.nullList_show = true;
                    }
                    // 数据全部加载完成（测试时暂时注掉）
                    if (this.partOfList.length == 0 || this.partOfList.login == false) {
                        this.finished = true;
                    }
                }, 500);
            },
            onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.finished = false;
                    this.isLoading = false;
                    this.woOrderList = [];
                    this.onLoad();
                }, 500);
            },
            //发起请求获取列表数据
            getOrderList() {
                let params = {
                    acc_nbr: '',
                    device: 'phone',
                    limit: 10,
                    start: this.woOrderList.length,
                    stateIndex: this.active1,
                };
                if (this.active != 0) {
                    params.type = this.oTabs[this.active].value;
                }
                let url = this.HOME + "/app-web/woapp/v18/system/order/getOrderList.do";
                axios.get(url, {params: params}).then(res => {
//                    this.partOfList = res.data;
                    //测试
                    this.partOfList = this.testList;
                }, error => {
                    console.log(error.config);
                });
            },
            //点击查看订单详情
            toDetail(orderId) {
                this.$router.push({path: '/orderDetail', query: {orderId: orderId}});
            },
            //查询电子受理单
            queryEOrder(orderId, orderType) {
                alert(orderId + orderType);
                this.$router.push({path: '/orderDetail', query: {orderId: orderId, orderType: orderType}});
            },
            //状态选择器
            chooseTypeDiv(a) {
                if (a=='show'){
                    this.show_choose = true;
                }else if (a=='cancel'){
                    this.show_choose = false;
                }else {
                    this.show_choose = false;
                }
            },
            chooseType(type){
                if(type =='SMZDJ'){
                    this.active = 1;
                }else if(type =='KDJYSL_1'){
                    this.active = 2;
                }else if(type =='KDJYSL_2'){
                    this.active = 3;
                }else if(type =='KDJYSL_3'){
                    this.active = 4;
                }else if(type =='APPZHWJ'){
                    this.active = 5;
                }else if(type =='JKYBKH'){
                    this.active = 6;
                }else if(type =='BSS_PZ'){
                    this.active = 7;
                }else if(type =='TYMBTC'){
                    this.active = 8;
                }else {
                    this.active = 0;
                }
            }
        }
    }

</script>

<style>
    html {
        background-color: rgb(250, 250, 250) !important;
    }

    .wo-search {
        width: 100%;
        height: 45px;
        line-height: 45px;
        background-image: linear-gradient(46deg, #F25550 27%, #FFA683 100%);
        font-size: 16px;
        position: absolute;
        top: 0;
    }

    .wo-search .wo-back {
        width: 40px;
        height: 45px;
        color: #fff;
        line-height: 45px;
        text-align: center;
        position: absolute;
    }

    .reset .van-search {
        background-color: rgba(0, 0, 0, 0) !important;
    }

    .reset .van-tabs__line {
        z-index: 0 !important;
    }

    .wo-tab {
        overflow: hidden;
        margin-top: 45px;
        background: #FFFFFF;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    }

    .reset .van-tabs__wrap--scrollable .van-tab {
        flex: 0 0 auto;
    }

    /*    .reset1 .van-tabs--line .van-tabs__wrap{
            height: 40px !important;
        }*/
    .reset .van-tab {
        padding: 0 10px !important;
        color: #999999 !important;
    }

    .reset1 .van-tab {
        font-size: 12px !important;
        color: #999999 !important;
        line-height: 40px;
    }

    .reset .van-tab--active {
        color: #333333 !important;
        font-size: 15px !important;
    }

    .reset1 .van-tab--active {
        color: #333333 !important;
        font-size: 12px !important;
    }

    .woIcon {
        position: absolute;
        right: 0;
        top: 45px;
        height: 44px;
        width: 40px;
        z-index: 999;
        background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.72) 0%, #FFFFFF 81%);
    }

    .btn-more {
        background: url("../../../assets/img/button_more.png") no-repeat;
        height: 16px;
        width: 16px;
        background-size: 16px 16px;
        background-position: 50% 50%;
        margin-top: 14px;
        margin-left: 12px;
    }

    .nullListDiv {
        z-index: 0;
        height: 130px;
        width: 103px;
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        font-size: 15px;
        text-align: center;
    }

    .listIsNull {
        background: url("../../../assets/img/listIsNull.png") no-repeat;
        height: 110px;
        width: 103px;
        background-size: 100% 100%;
    }

    .nullListMsg {
        margin-top: 0px;
        color: #999999
    }

    .myCard {
        height: 130px;
        background-color: #ffffff;
        margin-top: 10px;
    }

    .myLine {
        background: #EEEEEE;
        height: 1px;
        float: left;
    }

    .orderTitle {
        height: 32px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #333333;
        margin-left: 15px;
        line-height: 32px;
    }

    .orderTime {
        height: 32px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        text-align: right;
        line-height: 32px;
    }

    .orderImg {
        height: 72px;
        width: 72px;
        float: left;
        margin-left: 15px;
        margin-top: 13px;
        background: url("../../../assets/img/ordarImg.png") no-repeat;
        background-size: 100% 100%;
        border-radius: 4px;
        overflow: hidden;
    }

    .orderState1 {
        height: 22px;
        width: 72px;
        margin-top: 50px;
        background-color: #49DF9D;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #FFFFFF;
        text-align: center;
        line-height: 22px;
    }

    .orderState2 {
        height: 22px;
        width: 72px;
        margin-top: 50px;
        background-color: #F95050;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #FFFFFF;
        text-align: center;
        line-height: 22px;
    }

    .orderInfo {
        height: 72px;
        float: left;
        margin-left: 10px;
        margin-top: 13px;
    }

    .goodsName {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        line-height: 12px;
        margin-bottom: 6px;
    }

    .orderID {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #FF8260;
        letter-spacing: 0;
        line-height: 12px;
        margin-bottom: 6px;
    }

    .fieldName {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        line-height: 12px;
        margin-bottom: 6px;
    }

    .accNbr {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        line-height: 12px;
        margin-bottom: 6px;
    }

    .cardFoot {
        height: 40px;
        background-color: #ffffff;
    }

    .lookBtn {
        width: 95px;
        height: 30px;
        background-image: linear-gradient(134deg, #FF8260 50%, #FFC391 100%);
        box-shadow: 0 2px 4px 0 rgba(255, 129, 95, 0.20);
        border-radius: 5px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 30px;
        text-align: center;
        margin-top: 5px;
    }

    .chooseTypeDiv{
        height: 255px;
    }
    .chooseTypeTitle{
        height: 20px;
        width: 84px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:#999999;
        float: left;
        margin-left: 16px;
        line-height: 20px;
        margin-top: 20px;
    }
    .cancelBtn{
        height: 22px;
        width: 22px;
        float: right;
        margin-top: 18px;
        margin-right: 16px;
        background: url("../../../assets/img/button_close2.png") no-repeat;
        background-size: 100% 100%;
    }
    .typeBtn{
        height: 30px;
        width: 40%;
        float: left;
        margin-left: 7%;
        margin-top: 15px;
        background: #F5F5F5;
        border-radius: 5px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #666666;
        text-align: center;
        line-height: 30px;
    }
</style>
