<template>
    <div id="wxDraw">
        <loading v-show="loadingShow"></loading>
        <slotMachine v-if="drawShow"></slotMachine>
    </div>
</template>

<script>
    import slotMachine from '../component/slotMachine'
    import loading from '../component/loading'

    export default {
        name: "wxDraw",
        components: {
            slotMachine, loading
        },
        data() {
            return {
                drawShow: false,
                loadingShow: true,
                luckDrawId:''
            }
        },
        created() {
            sessionStorage.setItem("draw", '1');
            let url = this.getUrl();
            this.luckDrawId = url.consumeTypeId;
            this.getStatus();
        },
        methods: {
            getStatus() {
                this.$axios({
                    method: 'get',
                    url: "/customer/luckDraw/query/" + this.luckDrawId,
                    params: {

                        unionCode: localStorage.getItem('unionCode'),
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.data.end) {
                            if (res.data.data.status > 1) {
                                this.loadingShow = false;
                                this.drawShow = true;
                            } else {
                                alert("支付失败")
                            }
                        } else {
                            setTimeout(() => {
                                this.getStatus();
                            }, 1000)
                        }
                    } else {
                        alert(res.data.data);
                        this.loadingShow = false;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    #wxDraw {
        width: 100%;
        height: 100%;
        background: url("../assets/images/bg.png");
        background-size: 100% 100%;
    }
</style>