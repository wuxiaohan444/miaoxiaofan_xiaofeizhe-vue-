<template>
    <div id="details">
        <div class="navigation-head"><img src="../assets/images/back.png" alt="" class="back" @click="$router.back(-1)"><span>商品详情</span>
        </div>
        <!--头部信息-->
        <div class="head">
            <div class="headImg">
                <img class="goodsImg" :src="goodsInfo.img">
            </div>
            <div class="goodsName">{{goodsInfo.name}}</div>
            <div class="price">售价 ￥ <span>{{goodsInfo.price}}</span></div>
        </div>
        <!--立即支付-->
        <div class="buy" @click="pay">请扫码开门</div>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk'

    export default {
        name: 'detail',
        data() {
            return {
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
                },
                    {
                        img: require('../assets/images/hongniu.jpg'),
                        name: "红牛维生素功能饮料250ml",
                        price: 5,
                        id: 3
                    },
                    {
                        img: require('../assets/images/jiaduobao.jpg'),
                        name: "加多宝 凉茶植物饮料 茶饮料 310ml",
                        price: 5,
                        id: 4
                    }
                ],
                goodsInfo: ''
            }
        },
        created() {
            let goodsId = this.$route.query.goodsId;
            for (let i = 0; i < this.goodsList.length; i++) {
                if (goodsId == this.goodsList[i].id.toString()) {
                    this.goodsInfo = this.goodsList[i]
                }
            }
        },

        methods: {
            pay() {
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
            }
        }
    }
</script>
<style lang="less" scoped>
    #details {
        background: #4d5667;
        min-height: 100%;
    }

    .head {
        width: 690px;
        height: 580px;
        background: white;
        margin: 0 auto;
        border-radius: 8px;
        position: relative;
        .headImg {
            width: 100%;
            text-align: center;
            height: 420px;
            line-height: 420px;
            img {
                width: 333px;
                height: 370px;
                vertical-align: middle;
            }
        }
        .goodsName {
            font-size: 30px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            padding-left: 30px;
            line-height: 68px;
        }

        .price {
            font-size: 24px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            padding-left: 30px;
            line-height: 68px;
            span {
                font-size: 36px;
                color: #F2323F;
            }
        }

    }

    /*立即支付*/
    .buy {
        width: 100%;
        height: 90px;
        margin-top: 20px;
        position: fixed;
        bottom: 0;
        background: #595CA1;
        color: white;
        line-height: 90px;
        text-align: center;
        font-size: 28px;
    }
</style>