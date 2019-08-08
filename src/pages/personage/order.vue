<template>
    <div id="order">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back" @click="back"><span>我的订单</span>
        </div>
        <div class="tab-name">
            <div class="active">普通订单</div>
            <div @click="$router.push('/drawOrder')">抽奖订单</div>
        </div>
        <div class="order-main">
            <div class="order-main-item" v-for="(item,index) in orderList" :key="index">
                <div class="item-title"><h5>{{item.createTime}}</h5>
                    <h5 :class="item.status>= 2?item.status<9?'active':'':''" v-if="item.status!==13">
                        {{item.orderStatusText}}</h5>
                    <h5 v-if="item.status===13" class="button" @click="now(item.deviceId,item.id)">一键取货</h5>
                </div>
                <div class="item-goods" v-for="(goods,index) in item.foo.orderDetail" :key="index">
                    <img :src="ip+goods.foo.goods.img" alt="" class="goods-img">
                    <div class="goods-name">{{goods.foo.goods.name}}</div>
                    <div class="goods-price">
                        <h5>￥{{goods.foo.goods.discount}}</h5>
                        <p>×1</p>
                    </div>
                </div>
                <div class="item-foot">
                    <div class="item-order-no">订单号：{{item.no}}</div>
                    <div class="item-foot-count">
                        <span>合计：</span>
                        <span>￥{{item.discount}}</span>
                    </div>
                    <div class="item-foot-practical">
                        <span>实付：</span>
                        <p>
                            <span class="goods-realPrice">￥{{item.realPrice}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="order-foot" v-show="footHide">{{footText}}</div>
        </div>
        <div class="order-modal" v-show="modalShow">
            <div class="modal-box" v-show="modalShow">
                <h5>提示</h5>
                <div class="address">
                    <p><span>编号：</span>{{no}}</p>
                    <p><span>地址：</span>{{address}}</p>
                </div>
                <div class="hint">
                    <p>操作【一键取货】商品即刻出货，确认你在售货机旁边，并进行取货</p>
                </div>
                <div class="btn">
                    <button @click="cancel">取消</button>
                    <button @click="continu" class="affirm">继续</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "order",
        data() {
            return {
                page: 1,
                orderList: [],
                footHide: false,
                footText: '',
                control: true,
                ip: this.fixedIp(),
                luckDrawId: '',
                modalShow: false,
                address: '',
                no: '',
                orderId: '',
                returnUrl: this.returnUrl()
            }
        },
        created() {
            this.getList();
            window.addEventListener('scroll', this.getScroll);
        },
        mounted() {
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', this.back, false);
            }
        },
        methods: {
            getList() {
                this.$axios({
                    method: 'get',
                    url: '/customer/order/selectOrder',
                    params: {

                        isLuckDraw: 0,
                        page: this.page,
                        limit: 10,
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let rows = res.data.rows;

                        rows = rows.map((num) => {
                            switch (num.status) {
                                case -1:
                                    num.orderStatusText = '删除';
                                    break;
                                case 0:
                                    num.orderStatusText = '未支付';
                                    break;
                                case 1:
                                    num.orderStatusText = '支付失败';
                                    break;
                                case 2:
                                    num.orderStatusText = '支付成功';
                                    break;
                                case 3:
                                    num.orderStatusText = '发送指令失败';
                                    break;
                                case 4:
                                    num.orderStatusText = '发送指令成功';
                                    break;
                                case 5:
                                    num.orderStatusText = '无确认指令';
                                    break;
                                case 6:
                                    num.orderStatusText = '确认指令失败';
                                    break;
                                case 7:
                                    num.orderStatusText = '确认指令成功';
                                    break;
                                case 8:
                                    num.orderStatusText = '出货失败';
                                    break;
                                case 9:
                                    num.orderStatusText = '出货成功';
                                    break;
                                case 10:
                                    num.orderStatusText = '无需出货';
                                    break;
                                case 11:
                                    num.orderStatusText = '货道状况异常';
                                    break;
                                case 13:
                                    num.orderStatusText = '一键取货';
                                    break;

                            }
                            return num
                        });

                        this.orderList = [...this.orderList, ...rows];
                        if (res.data.rows.length < 10) {
                            this.footHide = true;
                            this.footText = '已经到底了';
                            this.control = false
                        } else {
                            this.control = true;
                        }
                    } else {
                        this.control = false
                    }
                })
            },
            getScroll() {
                //可滚动容器的高度
                let innerHeight = document.querySelector('.order-main').clientHeight;
                let outerHeight = document.documentElement.clientHeight;
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
                if (innerHeight - scrollTop < (outerHeight + 100) && this.control === true) {
                    this.control = false;
                    this.page++;
                    this.getList();
                }
            },
            back() {
                this.$router.push({
                    path: '/personage'
                })
            },
            now(deviceId, id) {
                this.orderId = id;
                this.$axios({
                    method: 'get',
                    url: "/customer/device/infoById",
                    params: {

                        unionCode: localStorage.getItem('unionCode'),
                        deviceId: deviceId
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.address = data.address;
                        this.no = data.no;
                        this.modalShow = true;
                    } else {
                        alert(res.data.data)
                    }
                });
            },
            cancel() {
                this.modalShow = false
            },
            continu() {
                this.$axios({
                    method: 'POST',
                    url: "/customer/order/takeOut",
                    data: this.$qs.stringify({

                        unionCode: localStorage.getItem('unionCode'),
                        id: this.orderId
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        window.location.href = this.returnUrl + '/shipment?consumeTypeId=' + this.orderId;
                    } else {
                        alert(res.data.data)
                    }
                })
            }
        },
        beforeDestroy() {
            window.removeEventListener("scroll", this.getScroll);
            window.removeEventListener('popstate', this.back, false);
        },
    }
</script>

<style scoped lang="less">
    .navigation-head {
        position: fixed;
        top: 0;
    }

    #order {
        min-height: 100%;
        background: #f2f2f2;
        padding-top: 200px;
        .tab-name {
            width: 100%;
            height: 100px;
            background: white;
            line-height: 88px;
            font-size: 30px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            display: flex;
            position: fixed;
            top: 100px;
            div {
                flex: 1;
                text-align: center;
                height: 88px;
            }
            .active {
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                position: relative;
            }
            .active:after {
                content: '';
                position: absolute;
                width: 32px;
                height: 6px;
                background: rgba(242, 50, 63, 1);
                border-radius: 3px;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }
        }
        .order-main {
            .order-main-item {
                background: white;
                margin-top: 20px;
                .item-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 58px;
                    padding: 0 30px;
                    box-shadow: 0 1px 0 0 rgba(153, 153, 153, 0.3);
                    h5 {
                        color: #999999;
                    }
                    .active {
                        color: #ff661b;
                    }
                    .button {
                        outline: none;
                        background: white;
                        width: 136px;
                        height: 50px;
                        background: rgba(242, 50, 63, 1);
                        border-radius: 4px;
                        color: white;
                        font-size: 22px;
                        text-align: center;
                        line-height: 50px;
                    }
                }
                .item-goods {
                    display: flex;
                    align-items: center;
                    padding: 0 30px;
                    height: 120px;
                    .goods-img {
                        width: 100px;
                        height: 100px;
                    }
                    .goods-name {
                        font-size: 30px;
                        flex: 2;
                        padding: 0 20px;
                    }
                    .goods-price {
                        text-align: right;
                        h5 {
                            font-size: 30px;
                        }
                        p {
                            color: #999999;
                            font-size: 28px;
                        }
                    }
                }
                .item-foot {
                    box-shadow: 0 -1px 0 0 rgba(153, 153, 153, 0.3);
                    padding: 0 30px;
                    .item-order-no {
                        line-height: 60px;
                        font-size: 28px;
                        color: #999999;
                    }
                    .item-foot-count {
                        height: 80px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 28px;
                    }
                    .item-foot-practical {
                        height: 80px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-weight: 700;
                        span {
                            font-weight: 500;
                        }
                        .goods-realPrice {
                            color: #F2323F;
                        }
                    }
                }
                .item-draw {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 28px;
                    .button {
                        outline: none;
                        background: white;
                        padding: 10px 20px;
                        border: 1px solid #cccccc;
                        border-radius: 10px;
                    }
                }
            }
            .order-foot {
                line-height: 100px;
                text-align: center;
            }
        }
        .order-modal {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .4);
            position: fixed;
            top: 0;
            left: 0;
            .modal-box {
                width: 500px;
                height: 500px;
                background: white;
                border-radius: 10px;
                margin: 300px auto;
                position: relative;
                h5 {
                    font-size: 36px;
                    font-weight: bold;
                    color: rgba(255, 255, 255, 1);
                    line-height: 122px;
                    text-align: center;
                    background: url("../../assets/images/tishi.png");
                    background-size: 100% 100%;
                }
                .hint {
                    width: 400px;
                    height: 61px;
                    font-size: 22px;
                    color: rgba(153, 153, 153, 1);
                    margin: 0 auto;
                    margin-top: 50px;
                    position: relative;
                    display: flex;
                    p {
                        width: 380px;
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
                .address {
                    width: 400px;
                    height: 74px;
                    font-size: 30px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    line-height: 46px;
                    margin: 40px auto;
                }
                .btn {
                    position: absolute;
                    bottom: 20px;
                    width: 100%;
                    height: 68px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 50px;
                    box-sizing: border-box;
                    button {
                        outline: none;
                        width: 180px;
                        border: 2px solid rgba(102, 102, 102, 1);
                        border-radius: 34px;
                        font-size: 28px;
                        font-weight: bold;
                        color: rgba(102, 102, 102, 1);
                        background: white;
                    }
                    .affirm {
                        color: white;
                        background: rgba(255, 71, 74, 1);
                        font-weight: 700;
                        border: 2px solid rgba(255, 71, 74, 1);
                    }
                }
            }
        }
    }

</style>