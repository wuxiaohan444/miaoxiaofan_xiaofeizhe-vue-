<template>
    <div id="goodsDetails">
        <div class="navigation-head"><img src="../assets/images/back.png" alt="" class="back"
                                          @click="back()"><span>商品详情</span>
        </div>
        <div class="detail-main">
            <div class="goods-info">
                <img :src="goodsInfo.img" alt="" class="goods-img">
                <div class="goods-name">
                    <p>{{goodsInfo.name}}</p>
                    <p>售价￥<span>{{goodsInfo.discount}}</span></p>
                </div>
                <div class="draw" @click="toDraw"><img src="../assets/images/cj.png"></div>
            </div>
            <div class="pay-box" v-show="1===2">
                <div class="choose-title">
                    <h5>选择优惠方式</h5>
                    <p>注：会员积分和红包不可同时使用</p>
                </div>
                <div class="choose-main">
                    <div class="choose-item" data-type="item.type" v-for="(item,index) in wayArr" :key="index"
                         @click="choose(index,item.type)">
                        <div class="left">
                            <div :class="wayArrIndex===index?'choose-radio active':'choose-radio'">
                                <div :class="wayArrIndex===index?'point active':'point'"></div>
                            </div>
                            <div class="choose-name">{{item.title}}</div>

                        </div>
                        <div class="right">{{item.state}}</div>
                    </div>
                </div>
            </div>
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in slideshow" :key="index">
                        <img :src="item.url" alt="">
                    </div>
                </div>
                <!-- 如果需要分页器 -->
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <div class="foot">
            <div class="check">
                合计：<span>￥</span><span class="real-price">{{price}}</span>
            </div>
            <div class="buy" @click="buy">立即购买</div>
        </div>
        <div class="red-packet-list" v-show="redPacketHide">
            <div class="couponItem" v-for="(item,index) in redPacketList" :key="index"
                 @click="chooseRedPacket(item.foo.customerTicketId)">
                <div class="price oldPrice">￥
                    <span>{{item.discountMoney}}</span>
                </div>
                <div class="couponRight">
                    <div class="couponName">{{item.name}}</div>
                    <div class="rule">
                        {{item.foo.ticket.useFullMoney==null?"无使用门槛":'满'+item.foo.ticket.useFullMoney+'元使用'}}
                    </div>
                </div>
                <div class="couponTime">
                    有效期：{{item.getStartTime}}至{{item.getEndTime}}
                </div>
            </div>
        </div>
        <loading v-show="loadingShow"></loading>
    </div>
</template>

<script>
    import Swiper from "swiper"
    import loading from '../component/loading'

    export default {
        name: "goodsDetails",
        data() {
            return {
                goodsId: '',
                goodsInfo: "",
                wayArr: [
                    {title: '不使用优惠券', state: '', type: ''},
                    {title: '会员积分', state: '可用积分0', type: 2},
                    {title: '优惠券', state: '无可用', type: 1},
                ],//付款方式
                wayArrIndex: 0,
                oldPrice: '',
                price: '',
                customerMemberId: '',
                info: '',
                reduceType: '',
                redPacketLen: '',
                redPacketList: '',
                redPacketHide: false,
                discountId: '',
                payType: 7,
                payDate: '',
                returnUrl: this.returnUrl(),
                controlPay: true,
                loadingShow: false,
                slideshow: [
                    {url: require('../assets/images/banner.png')},
                    {url: require('../assets/images/banner1.png')},
                ],
            }
        },
        components: {loading},
        created() {
            //判断是支付宝还是微信
            this.goodsId = this.$route.query.goodsId;
            // 拿到商品信息
            this.$axios({
                methods: 'get',
                url: '/customer/goods/detail/' + this.goodsId,
                params: {

                    unionCode: localStorage.getItem('unionCode'),
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    res.data.data.goods.img = this.fixedIp() + res.data.data.goods.img;
                    this.oldPrice = res.data.data.goods.discount;
                    this.goodsInfo = res.data.data.goods;
                }
            });
            this.getPrice();
        },
        mounted() {
            this.initSwiper();
            // if(sessionStorage.getItem("goodsDetail")==='1'){
            //     sessionStorage.removeItem("goodsDetail");
            //     if (window.history && window.history.pushState) {
            //         history.pushState(null, null, document.URL);
            //         window.addEventListener('popstate', this.back, false);
            //     }
            // }
        },
        methods: {
            choose(index, type) {
                this.wayArrIndex = index;
                let id = index;
                this.reduceType = type;
                if (id === 0) {
                    this.getPrice();
                } else if (id === 1) {
                    this.getPrice()
                } else if (id === 2) {
                    if (this.redPacketLen > 0) {
                        this.redPacketHide = false
                    }
                }
            },
            // 算价格
            getPrice() {
                this.$axios({
                    method: 'post',
                    url: "/customer/h5Pay/calculate",
                    data: this.$qs.stringify({

                        goodsId: this.goodsId
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.price = res.data.data;
                    }
                });
            },

            // 立即购买(按钮)
            buy() {
                //跳转支付方式页
                this.$router.push({
                    path: '/payType',
                    query: {
                        goodsId: this.goodsId,
                        realPrice:this.price,
                        goodsName:this.goodsInfo.name
                    }
                });

                //当前页直接支付
                // if (this.controlPay) {
                //     this.controlPay = false;
                //     this.loadingShow = true;
                //     this.payment()
                // }
            },
            payment() {
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
                        this.loadingShow = false;
                        if (res.data.data.notPay) {
                            this.controlPay = true;
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
                                                that.controlPay = true;
                                                if ("9000" == data.resultCode) {
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
                        alert(res.data.data);
                        this.loadingShow = false;
                        this.controlPay = true;
                    }
                })
            },
            toDraw() {
                this.$router.push({
                    name: 'draw',
                    query: {
                        goodsId: this.goodsId,
                    }
                })
            },
            back() {
                this.$router.push({
                    path: '/',
                    query: {

                        unionCode: localStorage.getItem('unionCode'),
                    }
                })
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

            //轮播图
            initSwiper() {
                new Swiper('.swiper-container', {
                    loop: true,
                    observer: true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true,//修改swiper的父元素时，自动初始化swiper
                    autoplay: {
                        disableOnInteraction: false,   // 手动滑动后继续自动播放
                    },
                    speed: 500,
                    // 如果需要分页器
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                    }
                })
            },
        },
        // destroyed() {
        //     window.removeEventListener('popstate', this.back, false);
        // }
    }
</script>

<style scoped lang="less">
    @import "../../node_modules/swiper/dist/css/swiper.css";

    #goodsDetails {
        height: 100%;
        background: #f1f1f1;
        box-sizing: border-box;
    }

    .detail-main {
        padding: 0 20px;
        padding-top: 20px;
        .goods-info {
            height: 580px;
            width: 100%;
            background: white;
            border-radius: 12px;
            position: relative;
            .goods-img {
                position: absolute;
                width: 300px;
                height: 300px;
                display: block;
                left: 50%;
                top: 100px;
                transform: translateX(-50%);
            }
            .goods-name {
                position: absolute;
                bottom: 0;
                p {
                    line-height: 60px;
                    padding-left: 20px;
                    font-size: 32px;
                    span {
                        color: #F2323F;
                        font-size: 36px;
                    }
                }
            }
            .draw {
                position: absolute;
                top: 120px;
                right: 50px;
                width: 110px;
                img {
                    width: 100%;
                    animation: mymove 2s infinite;
                }
                @keyframes mymove {
                    0% {
                        transform: rotateZ(-20deg);
                    }
                    50% {
                        transform: rotateZ(20deg);
                    }
                    100% {
                        transform: rotateZ(-20deg);
                    }
                }
            }
        }
        .pay-box {
            width: 100%;
            height: 300px;
            background: white;
            border-radius: 12px;
            margin-top: 30px;
            .box-address {
                line-height: 80px;
                display: flex;
                align-items: center;
                padding: 0 30px;
                box-shadow: 0 1px 0 0 rgba(153, 153, 153, 0.3);
                img {
                    width: 30px;
                }
                span {
                    font-size: 30px;
                    padding-left: 10px;
                }
            }
            .choose-title {
                text-align: center;
                h5 {
                    font-size: 26px;
                    font-weight: 400;
                    color: #333333;
                    line-height: 50px;
                }
                p {
                    font-size: 20px;
                    color: rgba(153, 153, 153, 1);
                }
            }
            .choose-main {
                padding: 0 30px;
                .choose-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 60px;
                    .left {
                        display: flex;
                        align-items: center;
                        .choose-radio {
                            width: 24px;
                            height: 24px;
                            background: rgba(0, 6, 103, 0);
                            border: 2px solid rgba(153, 153, 153, 1);
                            border-radius: 50%;
                            position: relative;
                            > div {
                                width: 14px;
                                height: 14px;
                                border-radius: 50%;
                                background: white;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translateX(-50%) translateY(-50%);
                            }
                            > div.active {
                                background: #F2323F;
                            }
                        }
                        .choose-radio.active {
                            border: 2px solid #F2323F;
                        }
                        .choose-name {
                            font-size: 26px;
                            color: rgba(51, 51, 51, 1);
                            padding-left: 20px;
                        }
                    }
                    .right {
                        font-size: 20px;
                        color: rgba(153, 153, 153, 1);
                    }
                }
            }
        }
        .swiper-container {
            margin: 20px 0;
            width: 100%;
            height: 360px;
            border-radius: 10px;
            img {
                width: 100%;
                border-radius: 10px;
            }
        }
    }

    .foot {
        position: fixed;
        bottom: 0;
        width: 100%;
        left: 0;
        height: 90px;
        border-top: 1px solid #cccccc;
        box-sizing: border-box;
        background: #F8F8F8;
        z-index: 9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .check {
            font-size: 32px;
            padding-left: 30px;
            span {
                color: #ff2c47;
            }
        }
        .buy {
            background: #ff2c47;
            color: white;
            float: right;
            height: 100%;
            width: 260px;
            line-height: 90px;
            font-size: 30px;
            text-align: center;
        }
    }

    /*红包*/
    .red-packet-list {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        background: #F2F2F2;
        z-index: 10;
        .couponItem {
            width: 690px;
            height: 300px;
            background: white;
            border-radius: 8px;
            position: relative;
            margin: 0 auto;
            margin-bottom: 20px;
            .about {
                position: absolute;
                left: 568px;
                top: 20px;
                width: 112px;
                height: 36px;
                background: rgba(252, 250, 236, 1);
                border-radius: 4px;
                font-size: 20px;
                font-weight: 400;
                color: rgba(242, 50, 63, 1);
                line-height: 36px;
                text-align: center;
            }
            .couponImg {
                position: absolute;
                width: 92px;
                height: 92px;
                border-radius: 50%;
                right: 30px;
                top: 42px;
            }
            .price {
                position: absolute;
                left: 72px;
                top: 87px;
                font-size: 30px;
                font-weight: bold;
                color: rgba(242, 50, 63, 1);
                span {
                    font-size: 82px;
                }
            }
            .oldPrice {
                color: #F2323F;
            }
            .couponRight {
                position: absolute;
                top: 60px;
                left: 278px;
                .couponName {
                    font-size: 28px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1)
                }
                .rule {
                    font-family: MicrosoftYaHei;
                    font-weight: 400;
                    font-size: 20px;
                    color: rgba(102, 102, 102, 1);
                    padding-top: 5px;
                }
            }
            .couponTime {
                height: 50px;
                width: 650px;
                box-sizing: border-box;
                line-height: 50px;
                font-size: 24px;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                bottom: 0;
                left: 20px;
                position: absolute;
                border-top: 1px dashed #E6E8EA;
            }

        }
    }

</style>