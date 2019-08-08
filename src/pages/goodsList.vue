<template>
    <div id="goodsList">
        <div class="navigation-head"><span class="single">商品展示</span></div>
        <div class="goods-head">
            <ul>
                <li :class="tabArrIndex===index?'goods-head-li active':'goods-head-li'" v-for="(item,index) in tabArr"
                    :index="index" @click="chooseClass(item.id,index)">{{item.name}}
                </li>
            </ul>
        </div>
        <div class="goods-body ">
            <router-link class="goods-item" v-for="(item,index) in goodsList" :to="item.url" :index="index">
                <img :src="ip+item.img" alt="" :class="item.num===0?'goods-img gray':'goods-img'">
                <p class="goods-price">￥{{item.discount}}</p>
                <p class="goods-introduce">{{item.name}}</p>
                <p class="goods-number">数量：{{item.num}}</p>
            </router-link>
        </div>
        <div class="foot-navigation">
            <router-link :to="item.url" v-for="(item,index) in navigationArr" :index="index">
                <img :src="item.img" alt="">
                <div :class="item.status===1?'navigation-name active':'navigation-name'">{{item.name}}</div>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "goodsList",
        data() {
            return {
                tabArr: '',
                tabArrIndex: 0,
                goodsList: '',
                navigationArr: [{
                    img: require("../assets/images/index2.png"),
                    name: '首页',
                    status: 1,
                    url: '/'
                }, {
                    img: require("../assets/images/my1.png"),
                    name: '我的',
                    status: 0,
                    url: '/personage'
                }],
                ip: this.fixedIp(),//固定IP
            }
        },
        created() {
            let url = this.getUrl();
            let loginCode = url.loginCode;
            let unionCode = url.unionCode;
            if (loginCode == null || unionCode == null) {
                alert("请重新扫码")
            } else {
                localStorage.setItem('loginCode', loginCode);
                localStorage.setItem('unionCode', unionCode);
            }
            // localStorage.setItem('loginCode', 'oyny90sezo_XGuyDhLJLS_wDroo0');
            // localStorage.setItem('unionCode', '2046c071720643258dd167caaacb0b33');
            // localStorage.setItem('unionCode', '830bf8c5df254b708678f9940448bfd1');
            this.getList(0);
        },
        methods: {
            chooseClass(id, index) {
                this.tabArrIndex = index;
                this.getList(id);
            },
            getList: function (classId) {
                this.$axios({
                    methods: 'get',
                    url: '/customer/goods/list/' + classId,
                    params: {
                        unionCode: localStorage.getItem('unionCode'),
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        if (classId === 0) {
                            this.tabArr = [{id: 0, name: '全部'}];
                            let arr = data.map((num) => {
                                return {id: num.id, name: num.name}
                            });
                            this.tabArr = [...this.tabArr, ...arr]
                        }
                        this.goodsList = data.reduce((item, next) => {
                            let arr = next.foo.list;
                            arr = arr.map((goods) => {
                                goods.num = goods.foo.num;
                                goods.url = '/goodsDetails?goodsId=' + goods.id;
                                return goods
                            });
                            next = item.concat(arr);
                            return next
                        }, []);
                    } else {
                        alert(res.data.data)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #goodsList {
        height: 100%;
    }

    .goods-head {
        height: 88px;
        overflow-x: auto;
        width: 100%;

        ul {
            height: 100%;
            min-width: 100%;

            .goods-head-li {
                width: 170px;
                line-height: 88px;
                text-align: center;
                position: relative;
                float: left;
                list-style: none;
            }

            .goods-head-li.active {
                color: #F2323F;
            }

            .goods-head-li.active:after {
                display: block;
                content: '';
                width: 80px;
                height: 4px;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                background: #F2323F;
            }
        }

    }

    .goods-body {
        background: #f7f7f7;
        height: calc(~"100% - 288px");
        box-sizing: border-box;
        padding: 20px 30px;
        overflow: scroll;

        .goods-item {
            width: 31%;
            height: 300px;
            background: white;
            border-radius: 12px;
            margin-right: 3.5%;
            margin-bottom: 30px;
            float: left;
            text-align: center;
            box-sizing: border-box;
            padding: 10px;
            overflow: scroll;

            .goods-img {
                width: 150px;
                height: 150px;
            }

            .goods-number {
                font-size: 20px;
                color: #000000;
            }

            .gray {
                -webkit-filter: grayscale(100%);
                -moz-filter: grayscale(100%);
                -ms-filter: grayscale(100%);
                -o-filter: grayscale(100%);
                filter: grayscale(100%);
                filter: gray;
            }

            .goods-price {
                color: #F2323F;
            }

            .goods-introduce {
                color: #333333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 26px;
            }
        }

        .goods-item:nth-child(3n+0) {
            margin-right: 0;
        }
    }
</style>