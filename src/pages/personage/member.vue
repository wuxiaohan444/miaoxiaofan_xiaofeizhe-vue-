<template>
    <div id="member">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>会员套餐</span></div>
        <div class="head">
            <img :src="info.headImg">
            <span>{{info.name}}</span>
        </div>
        <div class="title">选择会员套餐</div>
        <div class="member-main">
            <div :class="memberIndex===index?'active':''" v-for="(item,index) in memberList" :key="index"
                 @click="choosemember(index)">
                <div class="choose">
                    <img :src="memberIndex===index?require('../../assets/images/choosemoney1.png'):require('../../assets/images/choosemoney.png')">
                </div>
                <div class="content">
                    <span>{{item.name}}</span>
                    <div>￥{{item.money}}</div>
                </div>
            </div>
        </div>
        <!--说明-->
        <div class="explain">
            <div class="icon">i</div>
            <span>{{introduce}}</span>
        </div>
        <!--支付-->
        <div class="payNum">需要支付：{{money}}元</div>
        <!--支付方式-->
        <div class="payType">
            <div class="name" v-show="wxHide">
                <div class="left">
                    <img src="../../assets/images/wxpay.png">
                    <span>微信支付</span>
                </div>
                <div class="right" @click="chooseType(1)">
                    <img :src="payIndex===1?require('../../assets/images/choosePay1.png'):require('../../assets/images/choosePay2.png')">
                </div>
            </div>
            <div class="name" v-show="zfbHide">
                <div class="left">
                    <img src="../../assets/images/zfbpay.png">
                    <span>支付宝支付</span>
                </div>
                <div class="right" @click="chooseType(2)">
                    <img :src="payIndex===2?require('../../assets/images/choosePay1.png'):require('../../assets/images/choosePay2.png')">
                </div>
            </div>
            <div class="name">
                <div class="left">
                    <img src="../../assets/images/yue.png">
                    <span>余额支付</span>
                </div>
                <div class="right" @click="chooseType(0)">
                    <img :src="payIndex===0?require('../../assets/images/choosePay1.png'):require('../../assets/images/choosePay2.png')">
                </div>
            </div>
        </div>

        <div class="pay" @click="pay">立即支付</div>
    </div>
</template>

<script>
    export default {
        name: "member",
        data() {
            return {
                payIndex: 1,
                memberList: '',
                memberIndex: 0,
                introduce: '',//文字说明
                info: '',
                money: '',
                type: "",//续费还是开通类型
                memberPackageId: '',
                customerMemberId: '',
                payDate: '',
                wxHide: true,
                zfbHide: true,
            }
        },
        created() {
            if (/MicroMessenger/.test(window.navigator.userAgent)) {
                this.zfbHide = false;
            } else if (/AlipayClient/.test(window.navigator.userAgent)) {
                this.wxHide = false;
            } else {
                this.zfbHide = false;
                this.wxHide = false;
            }
            this.getInfo();
            this.getMember();
            this.getHasMember();
        },
        methods: {
            getMember() {
                this.$axios({
                    method: 'get',
                    url: '/customer/memberPackage/list',
                    params: {

                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.memberList = res.data.data;
                        this.introduce = res.data.data[0].content;
                        this.money = res.data.data[0].money;
                        this.memberPackageId = res.data.data[0].id
                    }
                })
            },
            choosemember(index) {
                this.memberIndex = index;
                this.introduce = this.memberList[index].content;
                this.money = this.memberList[index].money;
                this.memberPackageId = this.memberList[index].id
            },
            // 支付方法
            chooseType(index) {
                this.payIndex = index;
            },
            pay() {
                if (this.payIndex === 0) {
                    this.balancePay();
                }
                if (this.payIndex === 1) {
                    this.wxPay()
                }
                if (this.payIndex === 2) {
                    this.zfbPay()
                }
            },
            //个人信息
            getInfo() {
                this.$axios({
                    method: 'get',
                    url: '/customer/customer/userInfo',
                    params: {

                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.data.phone !== null) {
                            this.info = res.data.data;
                            if (res.data.data.headImg.substring(0, 1) === "/") {
                                this.info.headImg = this.fixedIp() + res.data.data.headImg
                            } else {
                                this.info.headImg = res.data.data.headImg;
                            }
                        } else {
                            this.info.headImg = require("../../assets/images/headimg.png");
                        }

                    }
                })
            },
            //查看个人套餐开通情况
            getHasMember() {
                this.$axios({
                    method: 'get',
                    url: '/customer/member/info',
                    params: {

                    }
                }).then((res) => {
                        if (res.data.code === 0) {
                            this.type = 2;
                            this.customerMemberId = res.data.data.id
                        } else {
                            this.type = 1
                        }
                    }
                )
            },
            // 余额开通套餐
            balancePay() {
                if (this.type === 1) {
                    this.$axios({
                        method: 'post',
                        url: "/customer/member/balancePay",
                        data: this.$qs.stringify({

                            memberPackageId: this.memberPackageId,
                        })
                    }).then((res) => {
                        if (res.data.code === 0) {
                            alert("购买成功")
                        }
                    })
                } else if (this.type === 2) {
                    this.$axios({
                        method: 'post',
                        url: "/customer/member/balancePayRenew",
                        data: this.$qs.stringify({

                            memberPackageId: this.memberPackageId,
                            id: this.customerMemberId
                        })
                    }).then((res) => {
                        if (res.data.code === 0) {
                            alert("购买成功")
                        }
                    })
                }

            },
            // 微信付款
            wxPay() {
                this.$axios({
                    method: 'post',
                    url: "/customer/member/pay",
                    data: this.$qs.stringify({

                        memberPackageId: this.memberPackageId,
                        id: this.customerMemberId
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.payDate = res.data.data;
                        if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                            } else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                            }
                        } else {
                            this.onBridgeReady();
                        }
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }
                })
            },
            //支付宝支付
            zfbPay() {
                this.$axios({
                    method: 'post',
                    url: "/customer/member/pay",
                    data: this.$qs.stringify({

                        memberPackageId: this.memberPackageId,
                        id: this.customerMemberId
                    })
                }).then((res) => {
                    const div = document.createElement('div');
                    div.innerHTML = res.data;//此处form就是后台返回接收到的数据
                    document.body.appendChild(div);
                    document.forms[0].submit();
                })
            },
            // 微信支付需要的方法
            onBridgeReady() {
                WeixinJSBridge.invoke('getBrandWCPayRequest', {
                    "appId": this.payDate.appId, //公众号名称，由商户传入
                    "timeStamp": this.payDate.timeStamp, //时间戳，自1970年以来的秒数
                    "nonceStr": this.payDate.nonceStr, //随机串
                    "package": this.payDate.package,
                    "signType": this.payDate.signType, //微信签名方式：
                    "paySign": this.payDate.paySign //微信签名
                }, function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        alert("购买成功")
                    } else {
                        alert("支付失败！");
                    }
                });
            },

        }
    }
</script>

<style scoped lang="less">
    .head {
        height: 120px;
        background: #4D5667;
        display: flex;
        align-items: center;
        font-size: 30px;
        color: white;
        img {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            border: 1px solid #ffffff;
            margin: 0 40px;
        }
    }

    .title {
        font-size: 28px;
        line-height: 88px;
        padding-left: 40px;
    }

    .member-main {
        display: flex;
        padding: 0 10px;
        > div {
            flex: 1;
            width: 216px;
            height: 216px;
            background: rgba(223, 227, 234, 1);
            border-radius: 8px;
            margin: 0 10px;
            position: relative;
            .choose {
                width: 50px;
                height: 50px;
                position: absolute;
                right: 10px;
                top: 10px;
                img {
                    width: 50px;
                    height: 50px;
                }
            }
            .content {
                color: rgba(102, 102, 102, 1);
                text-align: center;
                position: absolute;
                top: 60px;
                left: 50%;
                transform: translateX(-50%);
                width: 100%;
                span {
                    font-size: 32px;
                }
                div {
                    font-size: 28px;
                }

            }

        }
        div.active {
            background: linear-gradient(90deg, rgba(230, 210, 194, 1), rgba(226, 180, 130, 1));
        }

    }

    /*说明*/
    .explain {
        color: #999999;
        font-size: 26px;
        padding: 20px 30px;
        .icon {
            background: #E3BD96;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            color: white;
            text-align: center;
            display: inline-block;
            vertical-align: top;
            margin-right: 10px;
        }
        span {
            display: inline-block;
            width: 630px;
        }
    }

    .payNum {
        font-size: 28px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 88px;
        padding: 0 30px;
    }

    .payType {
        padding: 0 30px;
        font-size: 28px;
        .name {
            height: 88px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .left {
            display: flex;
            align-items: center;
            img {
                width: 45px;
                height: 45px;
                margin-right: 20px;
            }
        }
        .right img {
            width: 45px;
            height: 45px;
        }
    }

    .pay {
        width: 690px;
        height: 88px;
        background: linear-gradient(90deg, rgba(234, 203, 179, 1), rgba(227, 157, 82, 1));
        border-radius: 44px;
        font-size: 28px;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        line-height: 88px;
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
    }

    .register {
        border: none;
        box-shadow: none;
        position: static;
        font-size: 32px;
        color: #F2323F;
    }

    .button-hover {
        background: #FAFAFC;
    }
</style>