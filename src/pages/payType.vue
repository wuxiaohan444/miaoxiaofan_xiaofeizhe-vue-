<template>
    <div id="payType">
        <div class="navigation-head"><img src="../assets/images/back.png" alt="" class="back" @click="$router.back(-1)"><span>支付方式</span>
        </div>
        <div class="order-info">
            <div class="goods-info">
                <h5>￥<span>{{realPrice}}</span></h5>
                <p>{{goodsName}}</p>
            </div>
        </div>
        <!--支付方式-->
        <div class="pay-type">
            <div class="item" data-payType="1" v-show="wxHide" @click="chooseType(0)">
                <div class="left">
                    <img src="../assets/images/wxpay.png" alt="">
                    <span>微信支付</span>
                </div>
                <div class="right">
                    <img src="../assets/images/choosePay2.png" alt="" class="choose" v-if="chooseIndex!==0">
                    <img src="../assets/images/choosePay3.png" alt="" class="choose" v-if="chooseIndex===0">
                </div>
            </div>
            <div class="item" data-payType="2" v-show="zfbHide" @click="chooseType(1)">
                <div class="left">
                    <img src="../assets/images/zfbpay.png" alt="">
                    <span>支付宝支付</span>
                </div>
                <div class="right">
                    <img src="../assets/images/choosePay2.png" alt="" class="choose" v-if="chooseIndex!==1">
                    <img src="../assets/images/choosePay3.png" alt="" class="choose" v-if="chooseIndex===1">
                </div>
            </div>
            <div class="item" data-payType="0" @click="chooseType(2)" v-show="balanceShow">
                <div class="left">
                    <img src="../assets/images/yue.png" alt="">
                    <span>余额支付</span>
                    <span class="balance" style="color: #7F7F7F">({{balance}})</span>
                </div>
                <div class="right">
                    <img src="../assets/images/choosePay2.png" alt="" class="choose" v-if="chooseIndex!==2">
                    <img src="../assets/images/choosePay3.png" alt="" class="choose" v-if="chooseIndex===2">
                </div>
            </div>
            <div class="item" data-payType="0" @click="chooseType(5)">
                <div class="left">
                    <img src="../assets/images/miao.png" alt="">
                    <span>秒到支付</span>
                </div>
                <div class="right">
                    <img src="../assets/images/choosePay2.png" alt="" class="choose" v-if="chooseIndex!==5">
                    <img src="../assets/images/choosePay3.png" alt="" class="choose" v-if="chooseIndex===5">
                </div>
            </div>
            <div class="item" data-payType="0" @click="chooseType(7)">
                <div class="left">
                    <img src="../assets/images/shouqian.jpg" alt="">
                    <span>收钱吧支付</span>
                </div>
                <div class="right">
                    <img src="../assets/images/choosePay2.png" alt="" class="choose" v-if="chooseIndex!==7">
                    <img src="../assets/images/choosePay3.png" alt="" class="choose" v-if="chooseIndex===7">
                </div>
            </div>
        </div>
        <!--立即支付-->
        <div class="payment" @click="payment">立即支付</div>
    </div>
</template>

<script>
    export default {
        name: "payType",
        data() {
            return {
                wxHide: true,
                zfbHide: true,
                chooseIndex: '',
                goodsName: '',
                realPrice: '',
                goodsId: "",
                orderId: '',
                returnUrl: this.returnUrl(),
                payType: 1,
                balance: '',
                balanceShow: false,
                controlPay: true
            }
        },
        created() {
            //判断是支付宝还是微信
            if (/MicroMessenger/.test(window.navigator.userAgent)) {
                this.zfbHide = false;
                this.chooseIndex = 0;
            } else if (/AlipayClient/.test(window.navigator.userAgent)) {
                this.wxHide = false;
                this.chooseIndex = 1;
            } else {
                this.zfbHide = false;
                this.wxHide = false;
            }
            this.goodsName = this.$route.query.goodsName;
            this.realPrice = this.$route.query.realPrice;
            this.goodsId = this.$route.query.goodsId;
            this.info();
        },
        methods: {
            chooseType(index) {
                this.chooseIndex = index;
            },
            payment() {
                if (this.chooseIndex === 0) {
                    this.payType = 1 //微信
                } else if (this.chooseIndex === 1) {
                    this.payType = 2 //支付宝
                } else if (this.chooseIndex === 2) {
                    this.payType = 0 //余额
                } else if (this.chooseIndex === 5) {
                    this.payType = 5 //秒到
                } else if (this.chooseIndex === 7) {
                    this.payType = 7 //收钱吧
                }
                this.Pay();
            },
            // 付款
            Pay: function () {
                if (this.controlPay) {
                    this.controlPay = false;
                    this.$axios({
                        method: 'post',
                        url: "/customer/h5Pay/order",
                        data: this.$qs.stringify({
                            loginCode: localStorage.getItem("loginCode"),
                            unionCode: localStorage.getItem("unionCode"),
                            goodsId: this.goodsId,
                            payType: this.payType,
                            returnUrl: this.returnUrl + "/shipment"
                        })
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.orderId = res.data.data.consumeTypeId;
                            if (res.data.data.notPay) {
                                window.location.href = this.returnUrl + '/shipment?consumeTypeId=' + this.orderId;
                            } else {
                                switch (this.payType) {
                                    case 0: //余额支付
                                        this.controlPay = true;
                                        window.location.href = this.returnUrl + '/shipment?consumeTypeId=' + this.orderId;
                                        break;
                                    case 1: //微信支付
                                        this.wxPay(res.data.data.payData);
                                        break;
                                    case 2: //支付宝支付
                                        this.zfbPay(res.data.data.payData);
                                        break;
                                    case 5: //秒到支付
                                        let newData = res.data.data.payData;
                                        if (newData.payType === 1) {
                                            this.controlPay = true;
                                            window.location.href = newData.preparePayInfo
                                        } else if (newData.payType === 0) {
                                            let that = this;
                                            if (/MicroMessenger/.test(window.navigator.userAgent)) {
                                                this.wxPay(JSON.parse(newData.preparePayInfo))
                                            } else if (/AlipayClient/.test(window.navigator.userAgent)) {
                                                AlipayJSBridge.call("tradePay", {
                                                    tradeNO: JSON.parse(newData.preparePayInfo).tradeNO
                                                }, function (data) {
                                                    //支付成功后data.resultCode是900
                                                    if ("9000" == data.resultCode) {
                                                        that.controlPay = true;
                                                        window.location.href = that.returnUrl + '/shipment?consumeTypeId=' + that.orderId;
                                                    }
                                                });
                                            }
                                        }
                                        break;
                                    case 7: //收钱吧
                                        this.controlPay = true;
                                        let data = res.data.data.payData;
                                        window.location.href = data;
                                        break;
                                }
                            }
                        } else {
                            alert(res.data.data)
                        }
                    })
                }
            },
            // 微信支付
            wxPay(data) {
                this.payDate = data;
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
            },
            //支付宝支付
            zfbPay(data) {
                const div = document.createElement('div');
                div.innerHTML = data;//此处form就是后台返回接收到的数据
                document.body.appendChild(div);
                document.forms[0].submit();
                this.controlPay = true;
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
                }, (res) => {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        this.controlPay = true;
                        window.location.href = this.returnUrl + '/shipment?consumeTypeId=' + this.orderId;
                    } else {
                        this.controlPay = true;
                        alert("支付失败")
                    }
                });
            },
            // 个人
            info() {
                this.$axios({
                    method: 'get',
                    url: "/customer/customer/userInfo",
                    params: {

                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.balance = data.customerAccount.balance;
                        if (this.balance > 0) {
                            this.balanceShow = true
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    //订单信息
    .order-info {
        width: 100%;
        height: 240px;
        background: white;
        padding: 30px;
        box-sizing: border-box;
        .goods-info {
            text-align: center;
            h5 {
                color: #333333;
                font-weight: 500;
                font-size: 30px;
                span {
                    font-size: 70px;
                }
            }
            p {
                font-size: 24px;
                color: rgba(153, 153, 153, 1);
                line-height: 43px;
            }
        }
        .discount-info {
            font-size: 24px;
            color: rgba(153, 153, 153, 1);
            line-height: 43px;
        }
        .integral-info {
            font-size: 24px;
            color: rgba(153, 153, 153, 1);
            line-height: 43px;
        }
    }

    //支付方式
    .pay-type {
        background: white;
        padding: 0 30px;
        .item {
            display: flex;
            height: 88px;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #f2f2f2;
            .left {
                display: flex;
                align-items: center;
                img {
                    width: 45px;
                    height: 45px;
                }
                span {
                    font-size: 28px;
                    color: rgba(51, 51, 51, 1);
                    padding-left: 24px;
                }
            }
            .right {
                display: flex;
                align-items: center;
                img {
                    width: 48px;
                    height: 48px;
                }
            }
        }
    }

    .payment {
        width: 690px;
        height: 90px;
        background: rgba(242, 50, 63, 1);
        font-size: 30px;
        font-weight: 400;
        color: rgba(254, 254, 254, 1);
        text-align: center;
        line-height: 90px;
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
    }

</style>