<template>
    <div id="feedback">
        <div class="feedback-box">
            <div class="feedback-item">
                <h5>未出货异常</h5>
                <ul>
                    <li :class="chooseIndex===0?'active':''" @click="choose(0)">商品未出货</li>
                    <li :class="chooseIndex===1?'active':''" @click="choose(1)">其他</li>
                </ul>
            </div>
            <div class="feedback-item">
                <h5>拍照上传故障问题，方便快速排查问题</h5>
                <div class="update" v-show="updateHide">
                    <span>+</span>
                    <input type="file" @change="changepic($event)">
                </div>
                <img :src="ip+img" alt="" v-show="imgHide">
            </div>
            <div class="feedback-row">
                <span class="title">联系方式</span>
                <input type="text" placeholder="请填写您的联系方式" v-model="phone">
            </div>
            <div class="feedback-row" v-show="specificHide">
                <span class="title">故障描述</span>
            </div>
            <div class="feedback-info" v-show="specificHide">
                <textarea placeholder="请填写具体故障信息"></textarea>
            </div>
            <div class="btn" @click="save">确认提交</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "feedback",
        data() {
            return {
                img: '',
                updateHide: true,
                imgHide: false,
                chooseIndex: 0,
                phone: '',
                specificHide: false,
                no: '',
                ip: this.fixedIp()
            }
        },
        created() {
            this.$axios({
                method: 'get',
                url: '/customer/customer/userInfo',
                params: {

                }
            }).then((res) => {
                if (res.data.code === 0) {
                    if (res.data.data.phone !== null) {
                        this.phone = res.data.data.phone;
                    }
                }
            })
        },
        methods: {
            // 上传照片
            changepic(e) {
                let file = e.target.files[0];
                let formData = new FormData();
                formData.append('file', file);
                this.$axios({
                    method: 'post',
                    url: "/customer/file/upload?loginCode=" + localStorage.getItem('loginCode'),
                    data: formData
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.updateHide = false;
                        this.imgHide = true;
                        this.img = res.data.data;
                    } else {
                        alert(res.data.data);
                    }
                })
            },
            choose(index) {
                this.chooseIndex = index;
                this.specificHide = index !== 0;
            },
            save() {
                this.$axios({
                    method: 'post',
                    url: "/customer/customerFeedback/insert",
                    data: this.$qs.stringify({
                        loginCode: localStorage.getItem("loginCode"),
                        phone: this.phone,
                        img: this.img,
                        no: this.no
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        alert("反馈成功");
                        this.$router.push({
                            path: '/',
                            query: {
                                loginCode: localStorage.getItem("loginCode"),
                                unionCode: localStorage.getItem("unionCode")
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #feedback {
        min-height: 100%;
        background: #f2f2f2;
    }

    .feedback-box {
        background: white;
        padding: 30px;
        box-sizing: border-box;
        .feedback-item {
            h5 {
                line-height: 80px;
                color: #999999;
            }
            ul {
                display: flex;
                li {
                    width: 30%;
                    height: 70px;
                    background: rgba(255, 255, 255, 1);
                    border: 1px solid rgba(192, 192, 192, 1);
                    border-radius: 35px;
                    text-align: center;
                    line-height: 70px;
                    font-size: 26px;
                    color: #666666;
                    margin: 10px;
                }
                .active {
                    color: #F2323F;
                    border: 1px solid rgba(242, 50, 63, 1);
                    border-radius: 35px;
                }
            }
            .update {
                height: 108px;
                position: relative;
                span {
                    display: block;
                    width: 108px;
                    height: 108px;
                    color: #999999;
                    font-size: 100px;
                    border: 1px solid #999999;
                    font-weight: 300;
                    text-align: center;
                    line-height: 108px;
                }
                input {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 108px;
                    height: 108px;
                    opacity: 0;
                }
            }
            img {
                width: 108px;
                height: 108px;
            }
        }
        .feedback-row {
            height: 80px;
            display: flex;
            align-items: center;
            font-size: 28px;
            .title {
                width: 170px;
            }
            input {
                outline: none;
                border: none;
            }
        }
        .feedback-info {
            textarea {
                resize: none;
                width: 690px;
                height: 186px;
                line-height: 50px;
                padding: 20px;
                box-sizing: border-box;
                border-radius: 8px;
                border: 1px solid rgba(192, 192, 192, 1);
            }
        }
        .btn {
            width: 300px;
            height: 88px;
            background: rgba(149, 156, 168, 1);
            border-radius: 44px;
            font-size: 28px;
            color: white;
            text-align: center;
            line-height: 88px;
            margin: 30px auto;
        }
    }
</style>