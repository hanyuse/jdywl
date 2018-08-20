const util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_no: "",
    history:[],
    hasHistory:false
  },
  // 扫描二维码
  sanCode() {
     wx.scanCode({
       success: (data) => {
         try{
           let jdyqr = util.getQueryString(data.result, "jdyqr");
           let arr = jdyqr.split("@");
           let orderId = arr[1];
           wx.navigateTo({
             url: `../list/list?orderId=${orderId}`
           })
         }catch(e){
           wx.showModal({
             title: "提示",
             content: "请扫描筋斗云物流二维码图片",
             showCancel: false,
             confirmColor: "#E64340"
           })
         }
       }
     })
  },
  changeNo(e) {
    let {value} = e.detail;
    this.setData({
      order_no: value.trim()
    })
    return value;
  },
  searchOrder() {
    let val = this.data.order_no;
    if (val.length!=19) {
      wx.showModal({
        title: "提示",
        content: "请输入正确的19位单号",
        showCancel: false,
        confirmColor: "#E64340"
      })
    } else {
      wx.navigateTo({
        url: '../list/list?orderId=' + val.toUpperCase() + '&save=1' //save表示从订单号查询跳转
      })
    }    
  },
  searchHistoty(res){
    const {orderno} = res.currentTarget.dataset;
    wx.navigateTo({
      url: '../list/list?orderId=' + orderno + '&save=1' //save表示从订单号查询跳转
    })
  },
  resetVal() {
    this.setData({
      order_no: ""
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.resetVal();
    let history = wx.getStorageSync("history");
    if (history != undefined && history != "") {
      this.setData({
        history,
        hasHistory:true
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title:'筋斗云轿车物流',
      path:'/pages/orderQuery/orderQuery',
      imageUrl:'../../images/logo.png'
    }
  }
})