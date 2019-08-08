<template>
    <div class="wait-on">
        <div id="wh-loading"></div>
        <div class="text">{{title}}</div>
    </div>
</template>

<script>
    export default {
        name: "loading",
        data(){
            return{
                title:'正在查询中...'
            }
        }
    }
</script>

<style scoped lang="less">
    .wait-on{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.4);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
        .text{
            color: white;
            text-align: center;
            position: absolute;
            left: 50%;
            top:55%;
            transform: translateX(-50%) translateY(-50%);
        }
        #wh-loading {
            position: absolute;
            left: 50%;
            top:50%;
            transform: translateX(-50%) translateY(-50%);
            width: 2px;
            height: 2px;
            border-radius: 1px;
            box-shadow: 0 -12px 0 3px #f2f2f2, /*上*/
            0 12px 0 1px #f7f7f7, /*下*/
            -12px 0 0 1px #f7f7f7, /*左*/
            12px 0 0 1px #f7f7f7, /*右*/
                -9px -9px 0 1px #f7f7f7, /*左上*/
                9px -9px 0 2px #f7f7f7, /*右上*/
            -9px 9px 0 1px #f7f7f7, /*左下*/
            9px 9px 0 1px #f7f7f7/*右下*/;
            animation: loading 2s linear 0s infinite;
            -webkit-animation: loading 2s linear 0s infinite;
            -o-animation: loading 2s linear 0s infinite;
            -moz-animation: loading 2s linear 0s infinite;
        }

        @keyframes loading {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        @-webkit-keyframes loading {
            from {
                -webkit-transform: rotate(0deg);
            }
            to {
                -webkit-transform: rotate(360deg);
            }
        }

        @-o-keyframes loading {
            from {
                -o-transform: rotate(0deg);
            }
            to {
                -o-transform: rotate(360deg);
            }
        }

        @-moz-keyframes loading {
            from {
                -moz-transform: rotate(0deg);
            }
            to {
                -moz-transform: rotate(360deg);
            }
        }
    }
</style>