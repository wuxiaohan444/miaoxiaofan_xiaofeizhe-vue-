<template>
    <div id="bill">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>充值记录</span></div>
        <div class="month">
            <div class='content1'>
                <div class="body-item" v-for="(item,index) in billList" :key="index">
                    <div class="item-icon">
                        <img src="../../assets/images/headimg.png">
                    </div>
                    <div class="item-main">
                        <div class="content">账户充值</div>
                        <div class="time">{{item.createTime}}</div>
                    </div>
                    <div class="item-money">{{item.recharge}}</div>
                </div>
            </div>
            <div class="order-foot" v-show="footHide">{{footText}}</div>
        </div>
        <div class="bill-no" v-show="noShow">暂无数据</div>
    </div>
</template>

<script>
    export default {
        name: "bill",
        data() {
            return {
                billList: [],
                page: 1,
                footHide: false,
                footText: '',
                control: true,
                noShow: false
            }
        },
        created() {
            this.getBillList()
        },
        methods: {
            getBillList() {
                this.$axios({
                    method: 'get',
                    url: '/customer/recharge/chargeList',
                    params: {

                        page: this.page,
                        limit: 10,
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.rows.length === 0) {
                            this.noShow = true;
                        } else {
                            let rows = res.data.rows;
                            this.billList = [...this.orderList, ...rows];
                            if (res.data.rows.length < 10) {
                                this.footHide = true;
                                this.footText = '已经到底了';
                                this.control = false
                            } else {
                                this.control = true;
                            }
                        }
                    }else{
                        alert(res.data.data)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .month {
        height: 100%;
        .content1 {
            .body-item {
                height: 140px;
                display: flex;
                position: relative;
                .item-icon {
                    width: 146px;
                    text-align: center;
                    padding-top: 30px;
                    box-sizing: border-box;
                    image {
                        width: 80px;
                        height: 80px;
                    }
                }
                .item-main {
                    width: 574px;
                    padding-top: 20px;
                    border-bottom: 1px solid #f2f2f2;
                    box-sizing: border-box;
                    .content {
                        font-size: 28px;
                        font-weight: 400;
                        color: #333333;
                        line-height: 50px;
                    }
                    .time {
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 50px;
                    }
                }
                .item-money {
                    font-weight: 400;
                    font-size: 34px;
                    position: absolute;
                    top: 50%;
                    right: 30px;
                    transform: translateY(-50%);
                }
            }
            .order-foot {
                line-height: 100px;
                text-align: center;
            }
        }
    }
    .bill-no{
        text-align: center;
        line-height: 200px;
        font-size: 30px;
    }
</style>