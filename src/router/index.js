import Vue from 'vue';
import Router from 'vue-router';
import index from '@/pages/index';
import goodsList from '@/pages/goodsList';
import goodsDetails from '@/pages/goodsDetails';
import payType from '@/pages/payType';
import shipment from '@/pages/shipment';
import draw from '@/pages/draw';
import wxDraw from '@/pages/wxDraw';
import feedback from '@/pages/feedback';
import details from '@/pages/details';

import personage from '@/pages/personage/personage'
import order from '@/pages/personage/order'
import drawOrder from '@/pages/personage/drawOrder'
import coupon from '@/pages/personage/coupon'
import bill from '@/pages/personage/bill'
import recharge from '@/pages/personage/recharge'
import member from '@/pages/personage/member'
import phone from '@/pages/personage/phone'
import about from '@/pages/personage/about'
import info from '@/pages/personage/info'
import exemption from '@/pages/personage/exemption'

Vue.use(Router);
export default new Router({
    base: '/',
    // mode: 'history',
    routes: [
        {
            path: '/',
            name: 'goodsList',
            component: goodsList,
        },
        {
            path: '/goodsDetails',
            name: 'goodsDetails',
            component: goodsDetails
        }, {
            path: '/payType',
            name: 'payType',
            component: payType
        }, {
            path: '/shipment',
            name: 'shipment',
            component: shipment
        }, {
            path: '/draw',
            name: 'draw',
            component: draw
        }, {
            path: '/wxDraw',
            name: 'wxDraw',
            component: wxDraw
        }, {
            path: '/index',
            name: 'index',
            component: index
        }, {
            path: '/personage',
            name: 'personage',
            component: personage
        }, {
            path: '/order',
            name: 'order',
            component: order
        },
        {
            path: '/drawOrder',
            name: 'drawOrder',
            component: drawOrder

        }, {
            path: '/coupon',
            name: 'coupon',
            component: coupon
        }, {
            path: '/bill',
            name: 'bill',
            component: bill
        }, {
            path: '/recharge',
            name: 'recharge',
            component: recharge
        }, {
            path: '/member',
            name: 'member',
            component: member
        }, {
            path: '/phone',
            name: 'phone',
            component: phone
        }, {
            path: '/about',
            name: 'about',
            component: about
        }, {
            path: '/feedback',
            name: 'feedback',
            component: feedback
        }, {
            path: '/info',
            name: 'info',
            component: info
        }, {
            path: '/details',
            name: 'details',
            component: details
        },{
            path:'/exemption',
            name:'exemption',
            component:exemption
        }
    ]
})