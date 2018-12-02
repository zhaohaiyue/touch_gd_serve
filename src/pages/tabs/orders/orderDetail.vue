<template>
    <div>
        <div class="head">
            <div class="wo-back" @click="goBack()">
                <i class="iconfont">&#xe600;</i>
            </div>
            <div class="myTitle"> 订单详情</div>
        </div>
        <div  class="orderDetail">
            <div v-for="section in orderDetail.content">
                <div class="detailTitle">{{section.title}}</div>
                <div class="field" v-for="field in section.fields">
                    <div class="detailName">{{field.name}}</div>
                    <div class="detailValue">
                        <div v-if="field.field == 'acc_nbr'">{{field.value }}</div>
                        <div v-if="field.field == 'customer_name'">{{field.value }}</div>
                        <div v-if="field.field == 'deliveryMobile'">{{field.value }}</div>
                        <div v-if="field.field == 'deliveryName'">{{field.value }}</div>
                        <div v-if="field.field == 'contactPeople'">{{field.value }}</div>
                        <div v-if="field.field == 'phone1'">{{field.value }}</div>
                        <div v-if="field.field == 'phone2'">{{field.value }}</div>
                        <div v-if="field.field == 'mobile'">{{field.value }}</div>
                        <div v-if="field.field == 'card_address'">{{field.value }}</div>
                        <div v-if="field.field == 'address'">{{field.value }}</div>
                        <div v-if="field.field == 'contact_people'">{{field.value }}</div>
                        <div v-if="field.field == 'contact_phone'">{{field.value }}</div>
                        <div v-if="field.field != 'customer_name' &&
                                field.field != 'acc_nbr' &&
                                field.field != 'deliveryMobile' &&
                                field.field != 'deliveryName' &&
                                field.field != 'contactPeople' &&
                                field.field != 'phone1' &&
                                field.field != 'phone2' &&
                                field.field != 'mobile' &&
                                field.field != 'contact_people' &&
                                field.field != 'contact_phone' &&
                                field.field != 'address' &&
                                field.field != 'card_address'">{{field.value}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                orderDetail: {
                    "type": "SMZDJ",
                    "content": [
                        {
                            "title": "订单信息",
                            "fields": [
                                {
                                    "field": "app_version",
                                    "name": "App版本",
                                    "value": "2.23.0"
                                },
                                {
                                    "field": "order_id",
                                    "name": "订单编号",
                                    "value": "SMZ2018042011193489510"
                                }
                            ]
                        },
                        {
                            "title": "实名制信息",
                            "fields": [
                                {
                                    "field": "acc_nbr",
                                    "name": "办理号码",
                                    "value": "13060823922"
                                },
                                {
                                    "field": "customer_name",
                                    "name": "办理姓名",
                                    "value": "赵青"
                                }
                            ]
                        }
                    ],
                    "success": true
                },
            }
        },
        mounted(){
            this.encryptPhone(this.orderDetail.content[1].fields[0].value)
            console.log(this.encryptPhone(this.orderDetail.content[1].fields[0].value))

        },
        methods: {
            goBack() {
                this.$router.back(-1)
            },
            encryptPhone( phone ){
                let phone1 = (phone != undefined ? phone.replace(/\s/g, '') : '');
                if(phone1.length == 11) {
                    return phone1.replace(/(\d{3})(\d{4})(\d{4})/, '$1******$3');
                } else {
                    return phone1;
                }
            },
            encryptName( name ){
                let words = name.split('');
                if (words.length > 1) {
                    words.forEach(function (word, index) {
                        if (index == 0) {
                            words[index] = word;
                        } else {
                            words[index] = '*';
                        }
                    })
                }
                return words.join('');
            }
        },
        created: function () {

        }
    }

</script>
<style>
    html {
        background-color: rgb(250, 250, 250) !important;
    }
    .myTitle{
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #FFFFFF;
        letter-spacing: -0.48px;
        text-align: center;
    }
    .head {
        width: 100%;
        height: 45px;
        line-height: 45px;
        background-image: linear-gradient(46deg, #F25550 27%, #FFA683 100%);
        font-size: 16px;
        position: absolute;
        top: 0;
    }

    .wo-back {
        width: 40px;
        height: 45px;
        color: #fff;
        line-height: 45px;
        text-align: center;
        position: absolute;
    }

    .detailTitle {
        width: 100%;
        height: 32px;
        bottom: 0;
        right: 0;
        color: #999999;
        background-color: #f0efed;
        border-top: 1px solid #ddd;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        line-height: 32px;
    }

    .orderDetail {
        margin-top: 45px;
    }

    .field{
        width: 100%;
        height: 32px;
        font-size: 16px;
        line-height: 32px;
    }
    .detailName{
        border-right: 1px solid #f0efed;
        border-bottom: 1px solid #f0efed;
        color: #999999;
        width: 40%;
        height: 32px;
        font-size: 14px;
        line-height: 32px;
        text-align: center;
        float: left;
    }
    .detailValue{
        color: #999999;
        width: 60%;
        height: 32px;
        font-size: 14px;
        line-height: 32px;
        text-align: left;
        float: left;
        border-bottom: 1px solid #f0efed;
    }
</style>