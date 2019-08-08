<template>
    <div id="phone">
        <div class="phone-box">
            <img src="../../assets/images/title1.png" alt="">
            <div class="box-row">
                <input type="text" placeholder="手机号" title="" class="phone" v-model="phone">
            </div>
            <div class="box-row">
                <input type="text" placeholder="验证码" title="" class="code" v-model="code">
                <div class="getCode" @click="getCode">{{codeText}}</div>
            </div>
        </div>
        <div class="btn" @click="login">登录</div>
    </div>
</template>

<script>
    export default {
        name: "phone",
        data() {
            return {
                phone: '',
                code: '',
                codeText: '获取验证码',
                count: 60,
                control: true
            }
        },
        methods: {
            getCode() {
                if (this.control) {
                    this.control = false;
                    this.$axios({
                        method: 'post',
                        url: "/customer/customer/getVerifyCode",
                        data: this.$qs.stringify({

                            phone: this.phone,
                        })
                    }).then((res) => {
                        if (res.data.code === 0) {
                            let timer = setInterval(() => {
                                this.count--;
                                this.codeText = this.count + '秒后重试';
                                if (this.count === 0) {
                                    this.control = true;
                                    this.count = 60;
                                    this.codeText = "获取验证码";
                                    clearInterval(timer)
                                }
                            }, 1000)
                        } else {
                            this.control = true;
                            alert(res.data.data)
                        }
                    })
                }
            },
            login() {
                this.$axios({
                    method: 'post',
                    url: "/customer/customer/checkVerifyCode",
                    data: this.$qs.stringify({

                        phone: this.phone,
                        verifyCode: this.code
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$router.push({
                            path: '/personage',
                        })
                    } else {
                        alert(res.data.data)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .phone-box {
        width: 500px;
        margin: 100px auto;
        img {
            width: 145px;
            height: 43px;
            display: block;
            margin: 0 auto;
        }
        .box-row {
            display: flex;
            height: 99px;
            box-shadow: 0 2px 0 0 rgba(153, 153, 153, 0.5);
            margin-bottom: 2px;
            align-items: center;
            input {
                border: none;
                outline: none;
                height: 100%;
            }
            .getCode {
                font-size: 28px;
                color: #B1B1B1;
            }

        }
    }

    .btn {
        width: 500px;
        height: 88px;
        background: rgba(149, 156, 168, 1);
        border-radius: 44px;
        margin: 100px auto;
        text-align: center;
        line-height: 88px;
        color: white;
    }

    .btn.active {
        background: #F2323F;
    }
</style>