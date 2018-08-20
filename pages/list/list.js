const util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    init:false,
    unshow:true, //true不展示，false展示
    share:0  //是否分享打开
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      unshow: true
    })
    wx.showLoading({
      title: "查询中...",
      mask: true
    })
    let { orderId, detail, show, share, save} = options;
    //是从分享跳转
    if (share !== undefined && share ==1){
      this.setData({
        share
      })  
    }

    let url = `${app.globalData.baseUrl}/open/orders/${orderId}`;
    let auth = wx.getStorageSync("auth");
    let header = {};
    this.setData({
      orderId
    })

    // 查看订单详情
    if(show!=undefined&&show==1){
      url = `${app.globalData.baseUrl}/orders/show/${orderId}`;
      header = {
        "Authorization": "Basic " + auth
      }
      this.setData({
        unshow:false
      })
    }


    wx.request({
      url,
      header,
      success: (result)=>{
        if (result.statusCode == 200) {
          this.setData({
            init:true,
            ...result.data
          });
          wx.hideLoading();
          //如果是输入订单查询则将订单号放入本地缓存
          if(save!=1)return;
          let history = wx.getStorageSync("history");
          //设置图片
          const {vins} = result.data
          let url = "";
          if (vins!=undefined&&vins.length>0){
            const {images} = vins[0];
            if (images != undefined && images.length>0){
               url =  images[0].url;
            }
          }
          result.data.url = url;
          result.data.checkTime = util.formatTime();
          let trace = result.data.trace;
          if (trace.length>10){
            trace = trace.substring(0,9) + "...";
          }
          result.data.trace = trace;

          if (history != undefined && history!=""){
            history = util.checkArrayKey(result.data, history);
          }else{
            history = [];
            history[0] = result.data; 
          }
          wx.setStorageSync("history", history);

        } else if (result.statusCode == 401){
          wx.hideLoading();
          util.removeAuthor();
          wx.showModal({
            title: '提示',
            content: '登入信息已失效，请重新登入',
            showCancel: false,
            success: () => {
              wx.reLaunch({
                url: '../userInfo/userInfo'
              })
            }
          })
        }else{
          wx.hideLoading();
          wx.showModal({
            title: "提示",
            content: "未查询到相关订单信息",
            showCancel: false,
            confirmColor: "#E64340",
            success:()=>{
              wx.navigateBack();
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: "提示",
          content: "网络异常，请稍后再试",
          showCancel: false,
          confirmColor: "#E64340",
          success: () => {
            wx.navigateBack();
          }
        })
      }
    })
  },
  callPhone: function (e) {
    let phone = e.currentTarget.dataset["phone"];
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // 查看图片
  showPic() {
    wx.navigateTo({
      url: '../img/img?orderId=' + this.data.id,
    })
  },
  // 查看历史轨迹
  showHistory() {
    wx.navigateTo({
      url: '../traces/traces?orderId=' + this.data.id,
    })
  },
  // 保险
  showInsurance() {
    wx.navigateTo({
      url: '../insurance/insurance?orderId=' + this.data.id,
    })
  },
  onShareAppMessage() {
    return {
      title: '筋斗云轿车物流',
      path: `/pages/list/list?orderId=${this.data.orderId}&share=1`,
    }
  },
  reurnBack(){
    wx.reLaunch({
      url: '../orderQuery/orderQuery',
    })
  }
})