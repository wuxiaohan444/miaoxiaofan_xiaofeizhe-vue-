<template>
    <div id="shipment">
        <div class="navigation-head"><img src="../assets/images/back.png" alt="" class="back" @click="$router.back(-1)"><span>出货</span>
        </div>
        <div class="await" v-show="await">
            <div class="cartoon">loading
                <div class="comma">...</div>
            </div>
            <p>正在出货中，请稍等</p>
            <!--<p class="line-up">前面还有<span>{{awaitNum}}</span>人在排队中</p>-->
            <!--<p class="line-up">预计还要<span>{{awaitNum}}</span>分钟</p>-->
        </div>
        <div class="success" v-show="successShow">
            <img src="../assets/images/success.png" alt="">
            <p>恭喜，出货成功，请拿好您的商品！</p>
            <!--<div class="orderNo">-->
            <!--订单号：<span>{{orderNo}}</span>-->
            <!--</div>-->
            <button type="button" class="bank go" @click="back">返回首页</button>
        </div>

        <div class="error" v-show="errorShow">
            <img src="../assets/images/error.png" alt="">
            <p class="error-info"><span></span></p>
            <p class="error-no"><span></span></p>
            <p style="color: #F24A6B">出货异常!</p>
            <div class="orderNo">
                <p>订单号：<span>{{orderNo}}</span></p>
                <div>({{failMsg}})</div>
            </div>
            <button type="button" class="bank feedback" style="margin-right: 20px" @click="feedback"
                    v-show="isLuck===0">退款
            </button>
            <button type="button" class="bank feedback" @click="back">回到首页</button>
        </div>
    </div>
</template>

<script>
    import loading from '../component/loading'

    export default {
        name: "shipment",
        data() {
            return {
                successShow: false,
                errorShow: false,
                await: true,
                orderId: '',
                orderNo: '',
                time: '',
                realPrice: '',
                point: '',
                awaitNum: '',
                failMsg: '',
                isLuck: ''
            }
        },
        components: {
            loading
        },
        created() {
            let url = this.getUrl();
            this.orderId = url.consumeTypeId;
            this.shipment()
        },

        mounted() {
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', this.back, false);
            }
        },

        methods: {
            // 查询是否出货
            shipment() {
                this.$axios({
                    method: 'get',
                    url: "/customer/order/getOrderStatus",
                    params: {

                        orderId: this.orderId
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.awaitNum = res.data.data.index;
                        this.orderNo = res.data.data.no;
                        this.isLuck = res.data.data.isLuck;
                        if (res.data.data.index < 0) {
                            this.await = false;
                            if (res.data.data.status === 9) {
                                this.errorShow = false;
                                this.successShow = true;
                            } else {
                                this.failMsg = res.data.data.failMsg;
                                this.errorShow = true;
                                this.successShow = false;
                            }
                        } else {
                            setTimeout(() => {
                                this.shipment();
                            }, 1000)
                        }
                    } else {
                        this.await = false;
                        this.errorShow = true;
                        this.successShow = false;
                        this.failMsg = res.data.data
                    }
                })
            },
            // 查看积分
            getPoint() {
                this.$axios({
                    method: 'get',
                    url: "/customer/customerPoint/getShow",
                    params: {

                        pointRuleType: "3",
                        realPrice: this.data.realPrice
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.code === 0) {
                            this.point = 1;
                            this.getRed();
                        }
                    }
                })
            },
            // 查看红包
            getRed() {
                this.$axios({
                    method: 'get',
                    url: "/customer/ticket/getShow",
                    params: {

                        type: '3',
                        realPrice: this.data.realPrice
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.code === 0) {
                            this.discount = 1
                        }
                        if (this.point === 1 || this.discount === 1) {
                            wx.navigateTo({
                                url: "../paySuccess/paySuccess?type=3&realPrice=" + this.data.realPrice
                            })
                        }
                    }
                })
            },
            //返回
            back() {
                this.$router.push({
                    path: '/',
                    query: {
                        loginCode: localStorage.getItem("loginCode"),
                        unionCode: localStorage.getItem("unionCode")
                    }
                })
            },
            //反馈(退款)
            feedback() {
                this.$axios({
                    method: 'post',
                    url: "/customer/h5Pay/orderRefund",
                    data: this.$qs.stringify({
                        loginCode: localStorage.getItem("loginCode"),
                        unionCode: localStorage.getItem("unionCode"),
                        orderId: this.orderId
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        alert('退款成功');
                        this.back();
                    } else {
                        alert(res.data.data)
                    }
                })

            },
        },
        destroyed() {
            window.removeEventListener('popstate', this.back, false);
            clearInterval(this.time);
        }
    }
</script>

<style scoped lang="less">
    .await {
        text-align: center;
        font-size: 34px;
        color: #450643;
        margin: 200px auto;
        P {
            line-height: 50px;
        }
        .cartoon {
            width: 200px;
            height: 200px;
            background: #eab803;
            margin: 20px auto;
            border-radius: 50%;
            text-align: center;
            padding: 0 20px;
            box-sizing: border-box;
            padding-top: 70px;
        }
        .line-up {
            font-size: 28px;
            span {
                color: #F24A6B;
            }
        }
        .comma {
            animation: myturn linear 1s infinite;
            line-height: 30px;
            overflow: hidden;
            margin: 0 auto;
        }
        @keyframes myturn {
            0% {
                width: 0;
            }
            100% {
                width: 30px;
            }
        }

    }

    .success, .error {
        text-align: center;
        font-size: 36px;
        color: #450643;
        margin: 200px auto;
        img {
            width: 372px;
            height: 140px;
        }
        p {
            font-size: 20px;
            color: rgba(71, 119, 233, 1);
        }
        button {
            width: 160px;
            height: 60px;
            border-radius: 30px;
            border: 2px solid rgba(60, 110, 232, 1);
            font-size: 26px;
            color: rgba(66, 119, 233, 1);
            background: white;
            margin-top: 30px;
        }
    }

    .orderNo {
        font-size: 26px;
        width: 100%;
        color: #9FA5B3;
        div {
            color: #F24A6B;
        }
    }

    .wxOrder {
        font-size: 20px;
        text-align: center;
        color: #9FA5B3;
    }
</style>