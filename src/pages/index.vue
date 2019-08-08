<template>
    <div id="index">
        <div class="navigation-head"><span class="single">首页</span></div>
        <div class="head">
            <div class="left">
                <img src="../assets/images/place.png">
                <span>{{address}}</span>
            </div>
            <div class="right">
                <div @click="">查看附近机器</div>
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

        <div class="fun">
            <div class="redPacket">
                <div class="title">抢红包</div>
                <div class="explain">实惠多多</div>
                <img src="../assets/images/red.png">
            </div>
            <div class="recharge">
                <div class="title">充值有礼</div>
                <div class="explain">送积分，享权益</div>
                <img src="../assets/images/recharge.png">
            </div>
            <div class="game">
                <div class="title">幸运大转盘</div>
                <div class="explain">好礼转不停</div>
                <img src="../assets/images/game.png">
            </div>
        </div>

        <!--商品-->
        <div class="goods">
            <div class="title">热销商品</div>
            <div class="goods-item" v-for="(item,index) in goodsList" :key="index" @click="skip(item.id)">
                <img :src="item.img">
                <div class="text">{{item.name}}</div>
                <div class="price">￥{{item.price}}</div>
            </div>
        </div>

        <div class="foot-navigation">
            <router-link :to="item.url" v-for="(item,index) in navigationArr" :index="index">
                <img :src="item.img" alt="">
                <div :class="item.status===1?'navigation-name active':'navigation-name'">{{item.name}}</div>
            </router-link>
            <img src="../assets/images/qrode.png" alt="" class="qrCode" @click="scan">
        </div>
    </div>
</template>

<script>
    import Swiper from "swiper"
    import {MP} from "../assets/map/map";
    import wx from "weixin-js-sdk"

    export default {
        name: "index",
        data() {
            return {
                navigationArr: [{
                    img: require("../assets/images/index2.png"),
                    name: '首页',
                    status: 1,
                    url: '/index'
                }, {
                    img: require("../assets/images/my1.png"),
                    name: '我的',
                    status: 0,
                    url: '/personage'
                }],
                address: '',
                slideshow: [
                    {url: require('../assets/images/bg.jpg')},
                    {url: require('../assets/images/bg1.jpg')},
                ],
                goodsList: [{
                    img: require('../assets/images/baishi.jpg'),
                    name: "百事可乐 Pepsi 汽水碳酸饮料 330ml",
                    price: 4,
                    id: 1
                }, {
                    img: require('../assets/images/cha.jpg'),
                    name: "农夫山泉 茶派茶π果味茶饮料 500ml",
                    price: 6,
                    id: 2
                }, {
                    img: require('../assets/images/hongniu.jpg'),
                    name: "红牛维生素功能饮料250ml",
                    price: 5,
                    id: 3
                }]
            }
        },
        created() {

        },
        mounted() {
            this.initSwiper();
            this.createMap();
        },
        methods: {
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
            // 跳转
            skip(id) {
                this.$router.push({
                    path: '/details',
                    query: {
                        goodsId: id
                    }
                })
            },
            //扫描二维码
            scan() {
                if (/MicroMessenger/.test(window.navigator.userAgent)) {
                    this.$axios({
                        method: 'get',
                        url: "",//需要请求的接口
                        data: {
                            url: ''
                        }
                    }).then((res) => {
                        if (res.data.code === 0) {
                            wx.config({
                                debug: false,
                                appId: res.appId, // 必填,公众号的唯一标识
                                timestamp: res.timeStamp, // 必填,生成签名的时间戳
                                nonceStr: res.nonceStr, // 必填,生成签名的随机串
                                signature: res.signature, // 必填,签名
                                jsApiList: ['scanQRCode'] // 必填,需要使用的JS接口列表
                            });
                            wx.ready(function () {
                                wx.checkJsApi({ // 判断当前客户端版本是否支持指定JS接口
                                    jsApiList: [
                                        'scanQRCode'
                                    ],
                                    success: function (res) { // 以键值对的形式返回，可用true，不可用false。如：{"checkResult":{"scanQRCode":true},"errMsg":"checkJsApi:ok"}
                                        if (res.checkResult.scanQRCode === true) {
                                            wx.scanQRCode({ // 微信扫一扫接口
                                                desc: 'scanQRCode desc',
                                                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                                                scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                                                success: function (res) {
                                                    // 当needResult 为 1 时，扫码返回的结果
                                                    window.location.href = res.resultStr
                                                }
                                            })
                                        } else {
                                            alert('抱歉，当前客户端版本不支持扫一扫')
                                        }
                                    },
                                    fail: function (res) { // 检测getNetworkType该功能失败时处理
                                        alert('fail' + res)
                                    }
                                })
                            });
                        }
                    });
                    /* 处理失败验证 */
                    wx.error(function (res) {
// config 信息验证失败会执行error函数,如签名过期导致验证失败,具体错误信息可以打开config的debug模式查看,也可以在返回的res参数中查看,对于SPA可以在这里更新签名
                        alert('配置验证失败: ' + res.errMsg)
                    })
                } else if (/AlipayClient/.test(window.navigator.userAgent)) {
                    window.AlipayJSBridge.call('scan', {
                        type: 'qr',  // 扫描类型  qr 二维码  / bar 条形码
                        actionType: 'scanAndRoute' // 如果只是扫码,拿到码中的内容，这项不用设置都可以
                    }, function (result) {

                    })
                }
            },
            // 拿到地址
            createMap() {
                if (!localStorage.getItem("map")) {
                    MP("4IU3oIAMpZhfWZsMu7xzqBBAf6vMHcoa").then(BMap => {
                        // 创建Map实例
                        let geolocation = new BMap.Geolocation();
                        let that = this;
                        geolocation.getCurrentPosition(function (r) {
                            if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                                //以指定的经度与纬度创建一个坐标点
                                let pt = new BMap.Point(r.point.lng, r.point.lat);
                                //创建一个地理位置解析器
                                let geoc = new BMap.Geocoder();
                                geoc.getLocation(pt, function (rs) {//解析格式：城市，区县，街道
                                    that.address = rs.address;
                                    localStorage.setItem("map", rs.address)
                                });

                            }
                            else {
                                $(ev.currentTarget).text('定位失败');
                            }
                        }, {enableHighAccuracy: true})//指示浏览器获取高精度的位置，默认false
                    })
                } else {
                    this.address = localStorage.getItem("map");
                }
            }
        },
        destroyed() {
            this.createMap = null
        }
    }
</script>

<style scoped lang="less">
    @import "../../node_modules/swiper/dist/css/swiper.css";

    .navigation-head {
        position: fixed;
        top: 0;
        z-index: 99;
    }

    #index {
        padding-top: 100px;
        box-sizing: border-box;
    }

    .head {
        width: 100%;
        height: 88px;
        position: relative;
        padding: 0 30px;
        box-sizing: border-box;
        line-height: 88px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
            width: 480px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            img {
                width: 27px;
                height: 35px;
                vertical-align: middle;
            }
            span {
                font-size: 28px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                padding-left: 20px;
            }
        }
        .right {
            text-align: right;
            display: flex;
            justify-content: flex-end;
            div {
                font-size: 24px;
                background: #F2323F;
                color: white;
                width: 200px;
                text-align: center;
                height: 60px;
                line-height: 60px;
                border-radius: 12px;
            }
        }
    }

    .swiper-container {
        width: 100%;
        height: 200px;
        img {
            width: 100%;
        }
    }

    .fun {
        width: 700px;
        height: 200px;
        box-sizing: border-box;
        margin: 20px auto;
        display: flex;
        > div {
            flex: 1;
            border: 1px solid #F6F6F6;
            margin: 0 10px;
            border-radius: 8px;
            text-align: center;
            padding-top: 28px;
            .title {
                font-size: 28px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
            }
            .explain {
                font-size: 20px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
            }
        }
        .redPacket img {
            margin-top: 20px;
            width: 76px;
            height: 71px;
        }
        .recharge img {
            margin-top: 20px;
            width: 97px;
            height: 76px;
        }
        .game img {
            margin-top: 20px;
            width: 76px;
            height: 78px;
        }
    }

    .goods {
        .title {
            font-size: 30px;
            color: #333333;
            line-height: 50px;
            padding-left: 20px;
        }
        .goods-item {
            height: 150px;
            display: flex;
            align-items: center;
            padding: 0 30px;
            img {
                width: 100px;
                height: 100px;
            }
            .text {
                font-size: 28px;
                padding-left: 20px;
                width: 450px;
            }
            .price {
                font-size: 28px;
                width: 120px;
                text-align: right;
            }
        }

    }
</style>