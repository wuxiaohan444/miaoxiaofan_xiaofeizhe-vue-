<template>
    <div id="recharge">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>充值</span></div>
        <div class="recharge-box">
            <div class="box-main">
                <h5>充值金额</h5>
                <div>
                    <span>￥</span><input type="text" v-model="money" title=""/>
                </div>
            </div>
        </div>

        <div class="btn" @click="recharge">充值</div>
    </div>
</template>

<script>
    export default {
        name: "recharge",
        data() {
            return {
                money: '',
                payType: 1,
                payDate: '',
                returnUrl: this.returnUrl
            }
        },
        created() {
            if (/MicroMessenger/.test(window.navigator.userAgent)) {
                this.payType = 1;
            } else if (/AlipayClient/.test(window.navigator.userAgent)) {
                this.payType = 2;
            }
        },
        methods: {
            recharge() {
                this.$axios({
                    method: 'post',
                    url: "/customer/h5Pay/recharge",
                    data: this.$qs.stringify({

                        money: this.money,
                        returnUrl: this.returnUrl + "/recharge",
                        payType: this.payType
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.payDate = res.data.data.payData;
                        if (res.data.data.notPay) {

                        } else {
                            switch (this.payType) {
                                case 1:
                                    if (typeof WeixinJSBridge === "undefined") {
                                        if (document.addEventListener) {
                                            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                                        } else if (document.attachEvent) {
                                            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                                            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                                        }
                                    } else {
                                        this.onBridgeReady();
                                    }
                                    break;
                                case 2:
                                    const div = document.createElement('div');
                                    div.innerHTML = this.payDate;//此处form就是后台返回接收到的数据
                                    document.body.appendChild(div);
                                    document.forms[0].submit();
                                    break;
                            }
                        }

                    } else {
                        alert(res.data.data)
                    }

                })
            },
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
                        // window.reload();
                    } else {
                        alert("支付失败！");
                    }
                });
            },
        }
    }
</script>

<style scoped lang="less">
    #recharge {
        min-height: 100%;
        background: #f2f2f2;
        .recharge-box {
            width: 690px;
            height: 300px;
            background: white;
            margin: 30px auto;
            border-radius: 8px;
            .box-main {
                padding: 30px;
                box-sizing: border-box;
                h5 {
                    font-size: 28px;
                    line-height: 100px;
                }
                div {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #CDCDCD;
                    font-size: 60px;
                    input {
                        width: 100%;
                        height: 100px;
                        outline: none;
                        border: none;
                        font-size: 40px;
                    }
                }

            }
        }
        .btn {
            width: 500px;
            height: 80px;
            background: #F2323F;
            color: white;
            text-align: center;
            line-height: 80px;
            border-radius: 15px;
            margin: 80px auto;
        }
    }
</style>