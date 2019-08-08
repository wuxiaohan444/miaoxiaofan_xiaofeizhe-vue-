<template>
    <div id="slotMachine">
        <div class="navigation-head"><img src="../assets/images/back.png" alt="" class="back" @click="$router.back(-1)"><span>抽奖</span>
        </div>
        <div class="draw_head">
            <img src="../assets/images/title.png" alt="">
        </div>
        <div class="wh-big_box" v-show="boxShow">
            <div class="wh-draw-bg"><img src="../assets/images/luckDraw.png" alt=""></div>
            <div class="wh-box">
                <div class="wh-item one">
                    <ul :style="{transform:'translateY('+count1+'px)'}">
                        <li><img :src="productImg" alt="" class="product"></li>
                        <li><img src="../assets/images/1.jpg" alt=""></li>
                        <li><img src="../assets/images/2.jpg" alt=""></li>
                        <li><img src="../assets/images/3.jpg" alt=""></li>
                        <li><img src="../assets/images/4.jpg" alt=""></li>
                        <li><img :src="productImg" alt="" class="product"></li>
                    </ul>
                </div>
                <div class="wh-item two">
                    <ul :style="{transform:'translateY('+count2+'px)'}">
                        <li><img :src="productImg" alt="" class="product"></li>
                        <li><img src="../assets/images/1.jpg" alt=""></li>
                        <li><img src="../assets/images/2.jpg" alt=""></li>
                        <li><img src="../assets/images/3.jpg" alt=""></li>
                        <li><img src="../assets/images/4.jpg" alt=""></li>
                        <li><img :src="productImg" alt="" class="product"></li>
                    </ul>
                </div>
                <div class="wh-item three">
                    <ul :style="{transform:'translateY('+count3+'px)'}">
                        <li><img :src="productImg" alt="" class="product"></li>
                        <li><img src="../assets/images/1.jpg" alt=""></li>
                        <li><img src="../assets/images/2.jpg" alt=""></li>
                        <li><img src="../assets/images/3.jpg" alt=""></li>
                        <li><img src="../assets/images/4.jpg" alt=""></li>
                        <li><img :src="productImg" alt="" class="product"></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="draw_modal" v-show="modalShow">
            <!--中奖-->
            <div class="win" v-show="successShow">
                <div class="win-title"><span>恭喜你!</span></div>
                <div class="goods-img"><img :src="productImg" alt=""></div>
                <div class="hint">
                    <p>请注意，商品只能存<span>3天</span></p>
                </div>
                <div class="win-btn">
                    <div @click="now">立即取</div>
                    <div @click="later">稍后取</div>
                </div>
            </div>
            <!--稍后取-->
            <div class="win" v-show="laterShow">
                <img src="../assets/images/loser-close.png" alt="" class="close quit" @click="quit">
                <div class="win-title"><span>恭喜你!</span></div>
                <div class="goods-img"><img :src="productImg" alt=""></div>
                <p class="my-order">
                    该订单保存在<span>我的-我的订单</span>里面，您稍后可以进行取货！
                </p>
                <div class="again" @click="again">再嗨一把</div>
            </div>
            <div class="loser" v-show="errorShow">
                <div class="loser-main">
                    <img src="../assets/images/loser-close.png" alt="" class="close quit" @click="quit">
                    <h5>没中奖~</h5>
                    <p>最重要的就是玩的开心咯！</p>
                </div>
                <div class="again" @click="again">再玩一次</div>
            </div>
        </div>
        <!--查看-->
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
            <p>2、用户资料 用户在使用汇嗨购时个人资料均来源于微信或支付宝，用户资料包括但不限于个人用户头像、昵称、性别等信息。 若用户帐号ID或帐号头像、昵称等资料存在违法信息的，本公司有权采取暂停使用等措施。</p>
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
    </div>
</template>

<script>
    export default {
        name: "slotMachine",
        data() {
            return {
                goodsId: '',
                luckDrawId: '',
                luckPrice: '',
                productImg: '',
                count1: -440,
                count2: -440,
                count3: -440,
                rulesShow: false,
                chooseIndex: 1,
                successShow: false,
                errorShow: false,
                modalShow: false,
                boxShow: true,
                laterShow: false,
                bigBoxShow: true,
                returnUrl: this.returnUrl(),
            }
        },
        created() {
            let url = this.getUrl();
            this.luckDrawId = url.consumeTypeId;
            this.goodsDetails();
            this.result();
        },
        methods: {
            // 动画
            cartoon(a, b, c, d) {
                let s1 = 0, s2 = 0, s3 = 0;
                let timer1 = setInterval(() => {
                    this.count1 += 4;
                    s1++;
                    if (this.count1 === 0) {
                        this.count1 = -440;
                    }
                    if (s1 === (440 + a * 44)) {
                        s1 = 0;
                        clearInterval(timer1);
                    }
                }, 1);

                let timer2 = setInterval(() => {
                    this.count2 += 4;
                    s2++;
                    if (this.count2 === 0) {
                        this.count2 = -440;
                    }
                    if (s2 === (440 + b * 44)) {
                        s2 = 0;
                        clearInterval(timer2);
                    }
                }, 1);

                let timer3 = setInterval(() => {
                    this.count3 += 4;
                    s3++;
                    if (this.count3 === 0) {
                        this.count3 = -440;
                    }
                    if (s3 === (440 + c * 44)) {
                        s3 = 0;
                        clearInterval(timer3);
                        setTimeout(() => {
                            if (d === 0) {
                                this.successShow = true;
                                this.errorShow = false;
                                this.modalShow = true;
                            } else {
                                this.successShow = false;
                                this.errorShow = true;
                                this.modalShow = true;
                            }
                        }, 500);
                    }
                }, 1)
            },
            //商品详情
            goodsDetails() {
                this.$axios({
                    method: 'get',
                    url: "/customer/goods/detail/" + localStorage.getItem('goodsId'),
                    params: {

                        unionCode: localStorage.getItem('unionCode'),
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.productImg = this.fixedIp() + res.data.data.goods.img
                    } else {
                        alert(res.data.data)
                    }
                })
            },
            // 中奖结果
            result: function () {
                this.$axios({
                    method: 'get',
                    url: "/customer/luckDraw/getResult",
                    params: {

                        unionCode: localStorage.getItem('unionCode'),
                        luckDrawId: this.luckDrawId
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.data.go === 1) {
                            setTimeout(() => {
                                this.result();
                            }, 1000)
                        } else {
                            this.bigBoxShow = false;
                            if (res.data.data.hit === 1) { //中奖
                                this.cartoon(0, 5, 10, 0);
                            } else { //未中奖
                                this.cartoon(this.getRandomOne(), this.getRandomTwo(), 9, 1);
                            }
                        }
                    } else {
                        this.cartoon(this.getRandomOne(), this.getRandomTwo(), 9, 1);
                        alert(res.data.data)
                    }
                })
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
            },
            quit() {
                this.$router.push({
                    path: '/draw',
                    query: {
                        goodsId: localStorage.getItem('goodsId')
                    }
                });
            },
            // 再玩一次
            again() {
                this.$router.push({
                    path: '/draw',
                    query: {
                        goodsId: localStorage.getItem('goodsId')
                    }
                });
                localStorage.setItem("again", 1)
            },
            // 马上取
            now() {
                this.$axios({
                    method: 'POST',
                    url: "/customer/luckDraw/luckOpen",
                    data: this.$qs.stringify({

                        unionCode: localStorage.getItem('unionCode'),
                        luckDrawId: this.luckDrawId
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$axios({
                            method: 'get',
                            url: "/customer/luckDraw/selectOrderId",
                            params: {

                                unionCode: localStorage.getItem('unionCode'),
                                luckDrawId: this.luckDrawId
                            }
                        }).then((res) => {
                            if (res.data.code === 0) {
                                window.location.href = this.returnUrl + '/shipment?consumeTypeId=' + res.data.data;
                            } else {
                                alert(res.data.data)
                            }
                        });
                    } else {
                        alert(res.data.data)
                    }
                });
            },
            // 以后取
            later() {
                this.successShow = false;
                this.laterShow = true;
            },
            // 计算概率
            getRandomOne() {
                let rand = Math.random();
                if (localStorage.getItem("price") <= 6) {
                    return 0
                } else {
                    if (rand < localStorage.getItem("probability") / 100 * 10) return 0;
                    return 2
                }
            },
            getRandomTwo() {
                let rand = Math.random();
                if (localStorage.getItem("price") <= 6) {
                    if (rand < 0.8) return 5;
                    return 6
                } else {
                    if (rand < localStorage.getItem("probability") / 100 * 5) return 5;
                    return 6
                }
            }
        }
    }
</script>

<style scoped lang="less">
    #slotMachine {
        width: 100%;
        height: 100%;
        background: url("../assets/images/bg.png");
        background-size: 100% 100%;
    }

    .draw-gift {
        display: block;
        margin: 100px auto;
        width: 400px;
        animation: slideshow 2s linear infinite;
    }

    @keyframes slideshow {
        0% {
            transform: rotateZ(20deg);
        }
        50% {
            transform: rotateZ(-20deg);
        }
        100% {
            transform: rotateZ(20deg);
        }
    }

    .draw_head {
        width: 260px;
        margin: 20px auto;
        img {
            width: 100%;
        }
    }

    //付款样式
    .payment {
        margin: 150px auto;
        width: 600px;
        height: 450px;
        background: url("../assets/images/bg2.png");
        background-size: 100% 100%;
        position: relative;
        .turntable {
            width: 480px;
            height: 230px;
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
                font-size: 90px;
                padding-top: 30px;
            }
        }
        .button {
            position: absolute;
            top: 170px;
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
            width: 500px;
            height: 170px;
            line-height: 170px;
            left: 60px;
            bottom: 15px;
            padding-left: 90px;
            box-sizing: border-box;
            img {
                width: 100px;
                height: 100px;
                vertical-align: middle;
            }
            span {
                color: #F13738;
                font-size: 32px;
            }
        }
        .start {
            position: absolute;
            bottom: -130px;
            left: 50%;
            transform: translateX(-50%);
            background: #FFCC69;
            border: none;
            outline: none;
            color: #F03637;
            padding: 10px 40px;
            font-size: 32px;
            border-radius: 40px;
            font-weight: 700;
        }
    }

    //动画主体
    .wh-big_box {
        background-size: 100% 100%;
        width: 100%;
        position: relative;
        height: 400px;
        .wh-draw-bg {
            width: 320px;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            img {
                width: 100%;
            }
        }
        .wh-box {
            width: 250px;
            height: 88px;
            display: flex;
            background-size: 100% 100%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 157px;
            border: 5px solid #FDCF0C;
            border-left: none;
            border-right: none;
            .wh-item {
                flex: 1;
                border: 1px solid #eab803;
                overflow: hidden;
                ul {
                    transform: translateY(-500px);
                    li {
                        height: 88px;
                    }
                }
            }
            .item:first-child {
                border-right: 0;
            }
            .item:last-child {
                border-left: 0;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    //中奖结果
    .draw_modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        > div {
            position: fixed;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            color: #ff2c47;
            font-size: 34px;
        }
        .win {
            width: 480px;
            height: 560px;
            background: #FFFFFF;
            position: relative;
            border-radius: 8px;
            .hint {
                width: 400px;
                height: 61px;
                font-size: 22px;
                color: rgba(153, 153, 153, 1);
                margin: 20px auto;
                position: relative;
                display: flex;
                p {
                    width: 380px;
                    span {
                        color: #ff2c47;
                    }
                }
            }
            .hint::before {
                content: '!';
                display: inline-block;
                float: left;
                width: 30px;
                height: 30px;
                background: rgba(255, 71, 74, 1);
                border-radius: 50%;
                text-align: center;
                color: white;
                margin-right: 10px;
            }
            .close {
                position: absolute;
                right: 10px;
                top: 10px;
            }
            .win-title {
                width: 480px;
                height: 120px;
                border-radius: 4px 4px 0px 0px;
                font-size: 36px;
                font-weight: 700;
                color: white;
                background: #FF484A;
                text-align: center;
                line-height: 120px;
            }
            .my-order {
                font-size: 24px;
                color: #666666;
                padding: 0 40px;
                box-sizing: border-box;
                span {
                    text-decoration: underline;
                }
            }
            .again {
                width: 336px;
                height: 68px;
                background: rgba(255, 71, 74, 1);
                border-radius: 34px;
                text-align: center;
                line-height: 68px;
                font-size: 28px;
                color: white;
                margin: 20px auto;
            }
            .goods-img {
                width: 198px;
                height: 198px;
                margin: 30px auto;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .win-btn {
                display: flex;
                justify-content: space-between;
                padding: 0 40px;
                box-sizing: border-box;
                div {
                    width: 180px;
                    height: 68px;
                    border: 2px solid rgba(102, 102, 102, 1);
                    border-radius: 34px;
                    font-size: 28px;
                    font-weight: bold;
                    color: rgba(102, 102, 102, 1);
                    line-height: 68px;
                    text-align: center;
                }
            }
        }
        .loser {
            background: white;
            width: 480px;
            height: 560px;
            text-align: center;
            box-sizing: border-box;
            border-radius: 15px;
            .loser-main {
                width: 100%;
                height: 441px;
                background: url("../assets/images/loser.png");
                background-size: 100% 100%;
                position: relative;
                .close {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                }
                h5 {
                    font-size: 38px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 1);
                    position: absolute;
                    top: 62px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                p {
                    font-size: 26px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 1);
                    position: absolute;
                    top: 124px;
                    left: 50%;
                    width: 100%;
                    transform: translateX(-50%);
                }
            }
            .again {
                width: 336px;
                height: 68px;
                background: rgba(238, 15, 59, 1);
                border-radius: 34px;
                font-size: 28px;
                color: rgba(255, 255, 255, 1);
                line-height: 68px;
                transform: translateX(72px) translateY(30px);
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

    .orderNo {
        display: flex;
        font-size: 16px;
        justify-content: center;
        width: 100%;
    }

    .wxOrder {
        font-size: 20px;
        text-align: center;
    }
</style>