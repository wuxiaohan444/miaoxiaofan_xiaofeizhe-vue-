<template>
    <div id="coupon">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>我的优惠券</span></div>
        <div class="coupon-main">
            <div class="main-item" v-for="(item,index) in couponList" :key="index">
                <p class="coupon-price">￥<span>{{item.foo.ticket.discountMoney}}</span></p>
                <p class="coupon-name">{{item.foo.ticket.name}}</p>
                <p class="coupon-condition">{{item.foo.ticket.useFullMoney}}</p>
                <div class="coupon-time">有效期：{{item.foo.ticket.getStartTime}} 至{{item.foo.ticket.getEndTime}}</div>
            </div>
        </div>
        <div class="coupon-no" v-show="noShow">暂无红包</div>
    </div>
</template>

<script>
    export default {
        name: "coupon",
        data() {
            return {
                couponList: [],
                noShow: false
            }
        },
        created() {
            this.$axios({
                method: 'post',
                url: '/customer/ticket/list',
                data: this.$qs.stringify({

                })
            }).then((res) => {
                if (res.data.code === 0) {
                    let data = res.data.data;
                    data = data.map((num) => {
                        if (num.foo.ticket.useFullMoney === null) {
                            num.foo.ticket.useFullMoney = num.foo.ticket.useFullMoney === null ? "无使用门槛" : '满' + num.foo.ticket.useFullMoney + '元使用'
                        }
                        return num
                    });
                    this.couponList = data;
                } else {
                    this.noShow = true;
                }
            })
        },
        methods: {}
    }
</script>

<style scoped lang="less">
    .navigation-head {
        position: fixed;
        top: 0;
        z-index: 999;
    }

    #coupon {
        background: #f2f2f2;
        min-height: 100%;
        padding-top: 100px;
        box-sizing: border-box;
    }

    .coupon-main {
        padding: 0 30px;
        .main-item {
            background: white;
            width: 100%;
            height: 300px;
            margin-top: 20px;
            border-radius: 8px;
            position: relative;
            .coupon-price {
                color: #F2323F;
                font-weight: 700;
                font-size: 30px;
                position: absolute;
                left: 72px;
                top: 50px;
                span {
                    font-size: 100px;
                }
            }
            .coupon-name {
                position: absolute;
                top: 60px;
                left: 240px;
                font-size: 28px;
            }
            .coupon-condition {
                position: absolute;
                top: 100px;
                left: 240px;
                font-size: 20px;
                color: #666666;
            }
            .coupon-time {
                width: 650px;
                height: 50px;
                color: #999999;
                font-size: 24px;
                line-height: 50px;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                border-top: 1px dashed #999999;
            }

        }
    }

    .coupon-no {
        font-size: 32px;
        text-align: center;
        line-height: 200px;
    }
</style>