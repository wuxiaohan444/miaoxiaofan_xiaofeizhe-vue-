import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './utils/rem'
import axios from 'axios'
import qs from 'qs'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers['Authorization'] = localStorage.getItem("loginCode");

const env = "test";
let environment = (imageUrlPrefix, returnUrl) => {
    return {
        imageUrlPrefix: imageUrlPrefix,
        returnUrl: returnUrl
    };
};

const link = {
    test: environment('https://b156.com.cn/customer', 'https://b156.com.cn/h5/customer/#'),
    dev: environment('https://bianli.miaowbuy.com/customer', 'https://bianli.miaowbuy.com/h5/customer/#'),
    prod: environment('https://qianniu.miaowbuy.com/customer', 'https://qianniu.miaowbuy.com/h5/customer/#')
}[env];


Vue.prototype.fixedIp = function () {//固定ip
    return link.imageUrlPrefix;
};


Vue.prototype.getUrl = function () {
    let url = window.location.href;
    url = decodeURIComponent(url.substring(url.lastIndexOf("?") + 1));
    let index;
    if ((index = url.indexOf("#")) > 0)
        url = url.substring(0, index);
    let params = {}, param;
    url.split("&").forEach(v => {
        let index;
        if ((index = v.indexOf("=")) > 0) {
            params[v.substring(0, index)] = v.substring(index + 1);
        }
    });
    return params;
};

Vue.prototype.returnUrl = function () {
    return link.returnUrl;
};

Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;


new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
