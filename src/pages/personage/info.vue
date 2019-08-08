<template>
    <div id="info">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>个人信息</span></div>
        <div class="info-box">
            <div class="info-box-item">
                <img :src="headImg" alt="">
                <span>编辑头像</span>
                <input type="file" class="file" @change="changepic($event)">
            </div>
            <div class="info-box-item">
                <h5>昵称</h5>
                <label>
                    <input type="text" v-model="info.name" class="name">
                </label>
            </div>
            <div class="info-box-item">
                <h5>性别</h5>
                <label>
                    <select name="" id="" v-model="info.sex" class="sex" style="direction:rtl">
                        <option value="1">男</option>
                        <option value="2">女</option>
                    </select>
                </label>
            </div>
        </div>
        <div class="btn" @click="save">确认保存</div>
    </div>
</template>

<script>
    export default {
        name: "info",
        data() {
            return {
                headImg: '',
                headImgData: '',
                info: '',
            }
        },
        created() {
            this.getInfo();
        },
        methods: {
            getInfo() {
                this.$axios({
                    method: 'get',
                    url: '/customer/customer/userInfo',
                    params: {

                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.info = res.data.data;
                        this.headImgData = res.data.headImg;
                        if (res.data.data.headImg.substring(0, 1) === "/") {
                            this.headImg = this.fixedIp() + res.data.data.headImg
                        } else {
                            this.headImg = res.data.data.headImg;
                        }
                    }
                })
            },
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
                        this.headImg = this.fixedIp() + res.data.data;
                        this.headImgData = res.data.data;
                    }

                })

            },
            // 保存修改
            save() {
                this.$axios({
                    method: 'post',
                    url: "/customer/customer/updateUserInfo",
                    data: this.$qs.stringify({

                        value: localStorage.getItem('loginCode'),
                        sex: this.info.sex,
                        name: this.info.name,
                        headImg: this.headImgData
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        alert("修改成功")
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #info {
        min-height: 100%;
        background: #f2f2f2;
        .info-box {
            background: white;
            padding: 0 30px;
            box-sizing: border-box;
            .info-box-item {
                height: 100px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                box-shadow: 0 1px 0 0 rgba(223, 223, 223, 1);
                img {
                    width: 84px;
                    height: 84px;
                    border-radius: 50%;
                }
                .file {
                    width: 120px;
                    position: absolute;
                    right: 0;
                    opacity: 0;
                }
                .name, .sex {
                    width: 120px;
                    text-align: right;
                    color: #999999;
                    border: none;
                    outline: none;
                }
                span {
                    font-size: 26px;
                    color: #999999;
                }
                h5 {
                    font-size: 26px;
                }
            }
        }
        .btn {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 88px;
            background: rgba(255, 255, 255, 1);
            text-align: center;
            align-items: center;
            line-height: 88px;
            font-size: 26px;
            color: #F2323F;
        }
    }
</style>