<template>
    <div id="draw">
        <div class="navigation-head"><img src="../assets/images/back.png" alt="" class="back"
                                          @click="back"><span>抽奖</span>
        </div>
        <div class="draw_head">
            <img src="../assets/images/title.png" alt="">
        </div>
        <!--付款样式-->
        <div class="payment">
            <div class="turntable">
                <span>本次中奖概率</span>
                <p class="probability">{{per}}%</p>
            </div>
            <!--按钮区-->
            <div class="button">
                <button :class="luckIndex===1?'one choose ':'one'" @click="chooseMoney(1)">一元嗨</button>
                <button :class="luckIndex===3?'one choose ':'one'" @click="chooseMoney(3)">三元嗨</button>
                <button :class="luckIndex===5?'one choose ':'one'" @click="chooseMoney(5)">五元嗨</button>
            </div>
            <!--商品信息-->
            <div class="goods_info">
                <img :src="productImg" alt="">
                <div>
                    <span>抽奖价：￥</span><span class="cj">{{luckPrice}}</span>
                    <p class="goods-price">商品价：<span>￥{{discount}}</span></p>
                </div>
            </div>
            <div class="btn">
                <!--<button class="start one" name="1" v-show="wxHide" @click="play(1)">嗨一吧</button>-->
                <!--<button class="start one" name="2" v-show="zfbHide" @click="play(2)">嗨一吧</button>-->
                <button class="start one" @click="play(7)">嗨一吧</button>
                <!--<button class="start two" name="0" @click="play(0)">余额嗨一吧</button>-->
            </div>
        </div>
        <div class="look">
            <div :class="chooseIndex===1?'unselected choose':'unselected'" @click="cut"></div>
            <span>我已阅读并同意用户条款</span>
            <a href="javascript:;" @click="look">点击查看</a>
        </div>
        <!--用户条例-->
        <div class="rules" v-show="rulesShow">
            <h5>汇嗨购服务协议</h5>
            <div class="agree" @click="agree">同意</div>
            <p>
                欢迎申请使用xx科技有限公司（以下简称“本公司”）提供的汇嗨购有奖平台服务（“汇嗨购”指用户使用微信或支付宝支付一、三、五元购买对应金币，即可参与汇嗨购活动），请您（下列简称为“用户”）仔细阅读以下内容。如用户不同意本服务条款任意内容，请勿继续使用汇嗨购。如用户通过扫码进入点击汇嗨购并勾选“我已阅读并同意《服务协议》”，即表示用户与本公司已达成协议，自愿接受本服务条款的所有内容。此后，用户不得以未阅读本服务条款内容作任何形式的抗辩。</p>
            <p> 一、用户使用汇嗨购的前提条件 </p>
            <p>1、用户通过扫描售货机屏幕或者机身的二维码，微信或支付宝支付一、三、五元购买对应金币后获得参与汇嗨购活动资格。</p>
            <p>2、用户在使用汇嗨购时须具备相应的权利能力和行为能力，能够独立承担法律责任，如果用户在18周岁以下，必须在父母或监护人的监护下使用。</p>
            <p>二、用户管理</p>
            <p>1、用户ID 用户扫码进入后，经过第三方授权登录（微信或支付宝）汇嗨购时，本公司会为每位用户生成一个帐户ID，作为其使用汇嗨购服务的唯一身份标识，用户需对其帐户项下的所有行为负责。</p>
            <p>2、用户资料 用户在使用汇嗨购时个人资料均来源于微信或支付宝，用户资料包括但不限于个人用户头像、昵称、性别等信息。
                若用户帐号ID或帐号头像、昵称等资料存在违法信息的，本公司有权采取暂停使用等措施。</p>
            <p>3、用户应当保证在使用汇嗨购的过程中遵守诚实信用原则，不扰乱汇嗨购的正常秩序，不得通过使用他人帐户、一人使用多个帐户、使用程序自动处理等非法方式损害他人或本公司的利益。 </p>
            <p>4、若用户存在任何违法或违反本服务协议约定的行为，本公司有权视用户的违法或违规情况适用以下一项或多项处罚措施：</p>
            <p>（1）责令用户改正违法或违规行为； </p>
            <p>（2）中止、终止部分或全部服务；</p>
            <p>（3）取消用户汇嗨购资格；</p>
            <p>（4）符合法律法规规定的情况下，本公司认为合适的其他措施。 若用户的行为造成本公司及其关联公司损失的，用户还应承担赔偿责任。</p>
            <p> 三、汇嗨购的规则</p>
            <p>1、释义 用户需选择购买商品后支付一、三、五元购买对应金币后直接参与活动，结果由系统随机产生，存在质疑者请勿参与！</p>
            <p>2、本公司承诺遵循公平、公正、公开的原则运营汇嗨购，确保所有用户在汇嗨购中享受同等的权利与义务。 </p>
            <p>3、用户知悉，除本协议另有约定外，无论是否获得商品，用户用于参与汇嗨购的金额不能退回；其完全了解参与汇嗨购活动的存在风险，本公司不保证用户参与汇嗨购一定会获得商品。</p>
            <p>4、用户通过参与汇嗨购获得的商品，如有质量问题，请致电联系客服。</p>
            <p>5、如果下列情形发生，本公司有权取消用户在嗨购大咖相关服务：</p>
            <p>（1）因不可抗力，本系统发生故障或遭受第三方攻击，或发生其他本公司无法控制的情形；</p>
            <p>（2）根据本公司已经发布的或将来可能发布或更新的各类规则和规定取消的。</p>
            <p>四、本服务协议的修改 </p>
            <p>
                用户知晓本公司不时公布或修改的与本服务协议有关的规则、条款及公告是本服务协议的组成部分。本公司有权在必要时通过在汇嗨购内发出公告等合理方式修改本服务协议，用户在享受各项服务时，应及时查阅了解修改的内容，并自觉遵守本服务协议。用户如继续使用本服务协议涉及的服务，则视为对修改内容的同意，如发生争议，以最新的服务协议为准；用户在不同意修改内容的情况下，有权停止使用本服务协议涉及的服务。
                如用户对本规则内容有任何疑问，可拨打客服电话（400-762-3323）。</p>
        </div>
        <loading v-show="loadingShow"></loading>
    </div>
</template>

<script>
    import loading from '../component/loading'

    export default {
        name: "draw",
        data() {
            return {
                productImg: '',
                per: '0',
                goodsId: '',
                luckPrice: 1,//抽奖价格
                luckIndex: 1,
                discount: '',//商品价格
                wxHide: true,
                zfbHide: true,
                rulesShow: false,
                chooseIndex: 1,
                control: true,
                payType: 7,
                luckDrawId: '',
                payDate: '',
                controlPay: true,
                loadingShow: false,
                returnUrl: this.returnUrl()
            }
        },
        created() {
            this.goodsId = this.$route.query.goodsId;
            localStorage.setItem("goodsId", this.goodsId);
            if (localStorage.getItem("again") == 1) {
                this.luckIndex = localStorage.getItem("luckIndex") ? +localStorage.getItem("luckIndex") : 1;
                localStorage.removeItem('again');
                this.$axios({
                    method: 'get',
                    url: '/customer/goods/detail/' + this.goodsId,
                    params: {

                        unionCode: localStorage.getItem('unionCode'),
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.productImg = this.fixedIp() + res.data.data.goods.img;
                        this.discount = res.data.data.goods.discount;
                        localStorage.setItem("price", this.discount);
                        this.$axios({
                            method: 'get',
                            url: '/customer/luckDraw/random',
                            params: {

                                unionCode: localStorage.getItem('unionCode'),
                                price: localStorage.getItem("luckMoney") ? localStorage.getItem("luckMoney") : this.luckPrice
                            }
                        }).then((res) => {
                            if (res.data.code === 0) {
                                this.luckPrice = res.data.data;
                                let per = (this.luckPrice * 100 / localStorage.getItem("price")).toFixed(1);
                                this.per = per >= 100 ? 100 : per;
                                localStorage.setItem("probability", this.per);
                                this.play(this.payType);
                            } else {
                                alert(res.data.data)
                            }
                        })
                    } else {
                        alert(res.data.data)
                    }
                });

            } else {
                this.goodsDetails();
                sessionStorage.setItem("goodsDetail", '1');
                localStorage.removeItem("luckMoney");
                localStorage.removeItem("luckIndex");
            }

        },
        components: {loading},
        mounted() {
            // if (sessionStorage.getItem("draw") === '1') {
            //     sessionStorage.removeItem("draw");
            //     if (window.history && window.history.pushState) {
            //         history.pushState(null, null, document.URL);
            //         window.addEventListener('popstate', this.back, false);
            //     }
            // }
        },
        methods: {
            // 商品信息
            goodsDetails() {
                this.$axios({
                    method: 'get',
                    url: '/customer/goods/detail/' + this.goodsId,
                    params: {

                        unionCode: localStorage.getItem('unionCode'),
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.productImg = this.fixedIp() + res.data.data.goods.img;
                        this.discount = res.data.data.goods.discount;
                        this.getRandomMoney(this.luckPrice);
                        localStorage.setItem("price", this.discount);
                    } else {
                        alert(res.data.data)
                    }
                })
            },
            // 选择金额
            chooseMoney(index) {
                this.luckIndex = index;
                this.getRandomMoney(index);
                localStorage.setItem("luckMoney", index);
                localStorage.setItem("luckIndex", this.luckIndex)
            },
            play(type) {
                if (this.control) {
                    if (this.controlPay) {
                        this.controlPay = false;
                        this.loadingShow = true;
                        this.payType = type;
                        this.$axios({
                            method: 'post',
                            url: "/customer/h5Pay/luck",
                            data: this.$qs.stringify({
                                loginCode: localStorage.getItem("loginCode"),
                                unionCode: localStorage.getItem("unionCode"),
                                luckPrice: this.luckPrice,
                                goodsId: this.goodsId,
                                payType: this.payType,
                                returnUrl: this.returnUrl + "/wxDraw"
                            })
                        }).then((res) => {
                            if (res.data.code === 0) {
                                this.loadingShow = false;
                                this.luckDrawId = res.data.data.consumeTypeId;
                                if (res.data.data.notPay) { //无需支付，直接调走
                                    window.location.href = this.returnUrl + '/wxDraw?consumeTypeId=' + this.luckDrawId;
                                } else {
                                    switch (this.payType) {
                                        case 0: //余额支付
                                            this.controlPay = true;
                                            window.location.href = this.returnUrl + '/wxDraw?consumeTypeId=' + this.luckDrawId;
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
                                                            window.location.href = that.returnUrl + '/wxDraw?consumeTypeId=' + that.luckDrawId;
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
                                this.controlPay = true;
                                this.loadingShow = false;
                            }
                        })
                    }
                } else {
                    alert("请同意协议")
                }
            },
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
                        window.location.href = this.returnUrl + '/wxDraw?consumeTypeId=' + this.luckDrawId;
                    } else {
                        this.controlPay = true;
                        alert("支付失败！");
                    }
                });
            },

            // 查看
            look() {
                this.rulesShow = true;
            },
            //同意
            agree() {
                this.rulesShow = false;
                this.chooseIndex = 1;
            },
            cut() {
                this.chooseIndex = this.chooseIndex === 1 ? 2 : 1;
                this.control = this.chooseIndex === 1;
            },
            back() {
                this.$router.push({
                    path: '/goodsDetails',
                    query: {
                        goodsId: this.goodsId
                    }
                })
            },
            getRandomMoney(price) {
                this.$axios({
                    method: 'get',
                    url: '/customer/luckDraw/random',
                    params: {

                        unionCode: localStorage.getItem('unionCode'),
                        price: price
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.luckPrice = res.data.data;
                        let per = (this.luckPrice * 100 / this.discount).toFixed(1);
                        this.per = per >= 100 ? 100 : per;
                        localStorage.setItem("probability", this.per);
                    } else {
                        alert(res.data.data)
                    }
                })
            }
        },
        // destroyed() {
        //     window.removeEventListener('popstate', this.back, false);
        // }
    }
</script>

<style scoped lang="less">
    #draw {
        width: 100%;
        min-height: 100%;
        background: url("../assets/images/bg.png");
        background-size: 100% 100%;
        padding-bottom: 100px;
        box-sizing: border-box;
    }

    .draw_head {
        width: 220px;
        text-align: center;
        padding-top: 50px;
        margin: 0 auto;
        img {
            width: 100%;
        }
    }

    //付款样式
    .payment {
        margin: 150px auto;
        width: 580px;
        height: 410px;
        background: url("../assets/images/bg2.png");
        background-size: 100% 100%;
        position: relative;
        .turntable {
            width: 460px;
            height: 220px;
            background: #FFF2DF;
            border-radius: 230px 230px 0 0;
            position: absolute;
            left: 50%;
            top: -115px;
            transform: translateX(-50%);
            text-align: center;
            padding-top: 30px;
            box-sizing: border-box;
            span {
                font-size: 30px;
                color: #C1640B;
            }
            .probability {
                color: #FF2E48;
                font-size: 88px;
                padding-top: 10px;
            }
        }
        .button {
            position: absolute;
            top: 150px;
            left: 80px;
            button {
                font-size: 24px;
                width: 100px;
                height: 70px;
                margin: 0 20px;
                background: #FFEDBB;
                border: none;
                border-radius: 15px;
                color: #FB304D;
                outline: none;
            }
            .choose {
                background: #FEDC7B;
            }
        }
        .goods_info {
            position: absolute;
            width: 330px;
            height: 170px;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            img {
                width: 100px;
                height: 100px;
                margin-right: 5px;
            }
            span {
                color: #F13738;
            }
            .goods-price {
                color: #999999;
                text-decoration: line-through;
                font-size: 28px;
                span {
                    color: #999999;
                }
            }
        }
        .btn {
            display: flex;
            position: absolute;
            left: 50%;
            top: 450px;
            transform: translateX(-50%);
            width: 600px;
            align-items: center;
            justify-content: center;
            .start {
                background: #FFCC69;
                height: 80px;
                border: none;
                outline: none;
                color: #F03637;
                padding: 10px 40px;
                font-size: 32px;
                border-radius: 40px;
                font-weight: 700;
                margin: 0 10px;
            }
        }

    }

    //查看条款
    .look {
        height: 100px;
        width: 100%;
        line-height: 100px;
        background: rgba(0, 0, 0, .4);
        position: fixed;
        bottom: 0;
        color: white;
        font-size: 32px;
        .unselected {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #eeeeee;
            display: inline-block;
            vertical-align: middle;
            margin: 0 20px;
        }
        .choose {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: url("../assets/images/right.png");
            background-size: 100% 100%;
            display: inline-block;
            vertical-align: middle;
            margin: 0 20px;
        }
        a {
            color: #60A6EC;
            float: right;
            padding-right: 20px;
        }
    }

    //用户条例
    .rules {
        width: 100%;
        height: 100%;
        background: white;
        position: fixed;
        top: 0;
        padding: 0 20px;
        box-sizing: border-box;
        overflow: scroll;
        padding-bottom: 30px;
        h5 {
            text-align: center;
            padding: 20px 0;
        }
        p {
            font-size: 32px;
            line-height: 50px;
        }
        .agree {
            color: #60A6EC;
            font-size: 32px;
            text-align: right;
        }
    }
</style>