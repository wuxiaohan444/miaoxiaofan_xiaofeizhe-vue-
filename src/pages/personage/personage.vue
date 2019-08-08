<template>
    <div id="personage">
        <div class="navigation-head"><span class="single">个人中心</span></div>
        <div class="head">
            <div>
                <img class="headImg" :src="headImg">
                <span v-show="nameHide">{{info.name}}</span>
                <button class="register" v-show="registerHide" @click="register">注册/登录</button>
            </div>
            <div v-show="editHide">
                <router-link to="/info">编辑</router-link>
            </div>
        </div>
        <!--充值会员 -->
        <!--<div class="member">-->
        <!--<div class="circle">-->
        <!--<div class="content">-->
        <!--<div class="title"><span class="span">优享会员</span> <span class="endTime span">{{endTime}}</span>-->
        <!--</div>-->
        <!--<div class="dredge">-->
        <!--<router-link to="/member">{{memberText}}</router-link>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--账户信息-->
        <!--<div class="info">-->
        <!--<div class="info-item">-->
        <!--<div class="number">{{balance}}</div>-->
        <!--<div class="text">账户余额</div>-->
        <!--</div>-->
        <!--<div class="info-item">-->
        <!--<router-link to="coupon/coupon">-->
        <!--<div class="number">{{redPacketLen}}</div>-->
        <!--<div class="text">优惠券</div>-->
        <!--</router-link>-->
        <!--</div>-->

        <!--<div class="info-item">-->
        <!--<div class="number">{{point}}</div>-->
        <!--<div class="text">积分</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--主体内容-->
        <div class="main">
            <div class="main-item">
                <router-link to="/order" class="">
                    <div>
                        <img src="../../assets/images/consume.png" class="mark">
                        <span>我的订单</span>
                    </div>
                    <img src="../../assets/images/next.png" class="next">
                </router-link>
            </div>

            <!--<div class="main-item">-->
            <!--<router-link to="/coupon">-->
            <!--<img src="../../assets/images/coupon.png" class="mark">-->
            <!--<span>优惠券</span>-->
            <!--<img src="../../assets/images/next.png" class="next">-->
            <!--</router-link>-->
            <!--</div>-->
            <!--<div class="main-item">-->
            <!--<router-link to="/recharge">-->
            <!--<img src="../../assets/images/zaixian.png" class="mark">-->
            <!--<span>在线充值</span>-->
            <!--<img src="../../assets/images/next.png" class="next">-->
            <!--</router-link>-->
            <!--</div>-->
            <!--<div class="main-item">-->
            <!--<router-link to="/bill">-->
            <!--<img src="../../assets/images/zd.png" class="mark">-->
            <!--<span>充值记录</span>-->
            <!--<img src="../../assets/images/next.png" class="next">-->
            <!--</router-link>-->
            <!--</div>-->

            <div class="main-item">
                <a href="tel:156xxxxxxx">
                    <div>
                        <img src="../../assets/images/kefu.png" class="mark">
                        <span>联系客服</span>
                    </div>
                    <img src="../../assets/images/next.png" class="next">
                </a>
            </div>
            <div class="main-item">
                <router-link to="/about">
                    <div>
                        <img src="../../assets/images/about.png" class="mark">
                        <span>关于我们</span>
                    </div>

                    <img src="../../assets/images/next.png" class="next">
                </router-link>
            </div>
        </div>
        <div class="foot-navigation">
            <router-link :to="item.url" v-for="(item,index) in navigationArr" :index="index">
                <img :src="item.img" alt="">
                <div :class="item.status===1?'navigation-name active':'navigation-name'">{{item.name}}</div>
            </router-link>
            <!--<img src="../../assets/images/qrode.png" alt="" class="qrCode" @click="scan">-->
        </div>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk'

    export default {
        name: "personage",
        data() {
            return {
                navigationArr: [{
                    img: require("../../assets/images/index1.png"),
                    name: '首页',
                    status: 0,
                    url: '/?loginCode=' + localStorage.getItem("loginCode") + "&unionCode=" + localStorage.getItem("unionCode")
                }, {
                    img: require("../../assets/images/my2.png"),
                    name: '我的',
                    status: 1,
                    url: '/personage'
                }],
                headImg: '',
                nameHide: true,
                registerHide: false,
                editHide: false,
                info: '',
                memberText: '开通套餐',
                endTime: '',
                redPacketLen: 0,
                balance: '',
                point: '',
            }
        },
        created() {
            this.getInfo();
        },
        methods: {
            // 个人信息
            getInfo() {
                this.$axios({
                    method: 'get',
                    url: '/customer/customer/userInfo',
                    params: {

                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.balance = data.customerAccount.balance;
                        if (res.data.data.headImg !== null) {
                            this.info = res.data.data;
                            this.registerHide = false;
                            this.nameHide = true;
                            this.editHide = true;
                            if (res.data.data.headImg.substring(0, 1) === "/") {
                                this.headImg = this.fixedIp() + res.data.data.headImg
                            } else {
                                this.headImg = res.data.data.headImg;
                            }
                            this.point = this.info.customerPoint === null ? '0' : this.info.customerPoint.point;
                        } else {
                            this.headImg = require("../../assets/images/headimg.png");
                            this.registerHide = true;
                            this.editHide = false;
                        }
                    }
                })
            },
            register() {
                window.location.href = this.fixedIp() + '/thirdParty/info?returnUrl=' + encodeURIComponent('https://qianniu.miaowbuy.com/h5/customer/#/personage');
            },
            //查看优惠券
            // getTicket() {
            //     this.$axios({
            //         method: 'post',
            //         url: "/customer/ticket/list",
            //         data: this.$qs.stringify({
            //
            //         })
            //     }).then((res) => {
            //         if (res.data.code === 0) {
            //             this.redPacketLen = res.data.data.length
            //         } else {
            //             this.redPacketLen = 0
            //         }
            //
            //     });
            // },

            //套餐
            // member() {
            //     this.$axios({
            //         method: 'get',
            //         url: '/customer/member/info',
            //         params: {
            //
            //         }
            //     }).then((res) => {
            //         if (res.data.code === 0) {
            //             this.memberText = '立即续费';
            //             this.endTime = "到期时间：" + res.data.data.endTime.substring(0, 10)
            //         } else {
            //
            //         }
            //
            //     })
            // },
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
        }
    }
</script>

<style scoped lang="less">
    .head {
        width: 100%;
        height: 160px;
        text-align: center;
        background: white;
        box-sizing: border-box;
        display: flex;
        font-size: 30px;
        justify-content: space-between;
        align-items: center;
        > div {
            padding: 0 40px;
            span {
                padding: 0 20px;
            }
            .register {
                color: #F23441;
                display: inline-block;
                background: white;
                font-size: 30px;
                border-color: white;
                outline: none;
                border: none;
            }
            a {
                color: #333333;
            }
        }
        div:last-child {
            color: #F23441;
        }
        .headImg {
            width: 96px;
            height: 96px;
            border: 1px solid #f5f5f6;
            border-radius: 50%;
            vertical-align: middle;

        }
    }

    /*账户信息*/
    .info {
        width: 100%;
        height: 100px;
        display: flex;
        margin: 0 auto;
        background: white;
        > .info-item {
            flex: 1;
            text-align: center;
            margin: 0 10px;
            padding-top: 15px;
            box-sizing: border-box;
            .number {
                font-size: 28px;
                font-family: MicrosoftYaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
            }
            .text {
                font-size: 24px;
                font-family: MicrosoftYaHei;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
            }
        }
    }

    /*主体内容*/
    .main {
        border-top: 20px solid #f2f2f2;
        background: white;
        .main-item {
            padding: 0 20px;
            box-sizing: border-box;
            height: 88px;
            a {
                display: flex;
                box-shadow: 0 1px 0 0 rgba(153, 153, 153, 0.3);
                height: 100%;
                width: 100%;
                align-items: center;
                justify-content: space-between;
                .mark {
                    width: 48px;
                    height: 48px;
                    vertical-align: middle;
                }
                span {
                    font-size: 28px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    padding-left: 10px;
                }
                .next {
                    width: 20px;
                    height: 34px;
                    vertical-align: middle;
                    float: right;
                    margin-top: 7px;
                }
            }
        }

    }

    /*会员*/
    .member {
        background: #F2F2F2;
        width: 100%;
        height: 140px;
        .circle {
            width: 100%;
            height: 120px;
            background: white;
            border-radius: 0 0 50% 50%;
            overflow: hidden;
            position: relative;
            .content {
                background: #4D5667;
                width: 690px;
                height: 100px;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                padding: 0 20px;
                justify-content: space-between;
                box-sizing: border-box;
                padding-top: 10px;
                .title .span {
                    background: linear-gradient(0deg, rgba(198, 153, 105, 1) 0%, rgba(198, 153, 105, 1) 1.2939453125%, rgba(255, 255, 255, 1) 50%, rgba(198, 153, 105, 1) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 28px;
                }
                .title .endTime {
                    font-size: 28px;
                    padding-left: 30px;

                }
                .dredge {
                    width: 130px;
                    height: 40px;
                    background: rgba(199, 155, 108, 1);
                    border-radius: 20px;
                    text-align: center;
                    line-height: 40px;
                    margin-top: 10px;
                    a {
                        font-size: 24px;
                        color: white;
                    }
                }
            }
        }
    }
</style>