<template>
    <div id="about">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>关于我们</span></div>
        <div class="about">
            <span>版本信息</span>
            <span>1.1.1</span>
        </div>
        <div class="main-item">
            <router-link to="/exemption">
                <span>免责声明</span>
                <img src="../../assets/images/next.png" class="next">
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "about"
    }
</script>

<style scoped lang="less">
    #about {
        min-height: 100%;
        background: #f2f2f2;
    }

    .about {
        width: 100%;
        height: 88px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        box-sizing: border-box;
        background: white;
        span {
            font-size: 28px;
        }
    }

    .main-item {
        height: 88px;
        padding:0 20px;
        box-sizing: border-box;
        background: white;
        a {
            box-shadow:0px -1px 0px 0px rgba(153,153,153,0.3);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        span {
            font-size: 28px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            padding-left: 10px;
        }
        .next {
            width: 20px;
            height: 34px;
            vertical-align: middle;
            margin-top: 7px;
        }
    }


</style>