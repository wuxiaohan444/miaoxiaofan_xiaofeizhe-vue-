<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        created() {
            if (!'defineProperty' in Object) {
                alert('当前浏览器版本较低');
            }
        }
    }
</script>

<style lang="less">
    * {
        padding: 0;
        margin: 0;
    }

    a {
        text-decoration: none;
    }

    body, html, #app {
        color: #333333;
        height: 100%;
    }

    h1, h2, h3, h4, h5 {
        font-weight: 500;
    }

    li {
        list-style: none;
    }

    /*头部*/
    .navigation-head {
        height: 100px;
        width: 100%;
        background: #4D5667;
        color: white;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding-left: 10px;
        .single {
            padding-left: 20px;
        }
        .back {
            width: 50px;
        }
    }

    /*底部*/
    .foot-navigation {
        height: 100px;
        width: 100%;
        position: fixed;
        bottom: 0;
        background: white;
        display: flex;
        /*display: none;*/
        box-shadow: 0 -2px 0 0 rgba(153, 153, 153, 0.3);
        > a {
            flex: 1;
            text-align: center;
            img {
                display: block;
                width: 60px;
                height: 60px;
                margin: 0 auto;
            }
            .navigation-name {
                font-size: 24px;
                color: #333333;
            }
            .navigation-name.active {
                color: #F2323F;
            }
        }
        .qrCode {
            position: absolute;
            left:50%;
            top: -30px;
            transform: translateX(-50%);
            width: 120px;
            height: 120px;
        }
    }

</style>
