// pages/consign/consign.js
const app = getApp();
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  initData(){
    this.setData({
      login:false,
      auth: '',// 用户认证
      currentTab: 0, //当前tab页index  0:wait待运输;1.transportation运输中；2.complte已完成
      wait: {
        msg: '',
        load: false, //第一次进入相关tab页的时候判断是否需要加载对应的数据
        current_page: 0,//当前加载第几页数据
        last_page: 0,
        total: '',  //数据总量
        data: []
      },
      transportation: {
        load: false,
        msg: '',
        current_page: 0,
        last_page: 0,
        total: '',
        data: []
      },
      complte: {
        load: false,
        msg: '',
        current_page: 0,
        last_page: 0,
        total: '',
        data: []
      }
    })
  },
  data: {
    login: false,
    auth: '',// 用户认证
    currentTab: 0, //当前tab页index  0:wait待运输;1.transportation运输中；2.complte已完成
    wait: {
      load: false, //第一次进入相关tab页的时候判断是否需要加载对应的数据
      msg:'',
      current_page: 0,//当前加载第几页数据
      last_page: 0,
      total: '',  //数据总量
      data: []
    },
    transportation: {
      load: false,
      msg: '',
      current_page: 0,
      last_page: 0,
      total: '',
      data: []
    },
    complte: {
      load: false,
      msg: '',
      current_page: 0,
      last_page: 0,
      total: '',
      data: []
    }
  },
  changTab: function (e) {
    const currentTab = e.target.dataset["tab"];
    if (currentTab != undefined) {
      this.setData({
        currentTab
      })
      let tab = currentTab == 0 ? "wait" : currentTab == 1 ? "transportation" : "complte";
      let { load } = this.data[tab];
      if (!load) {
        this.loadData(currentTab);
      } else {
        this.reloadData(currentTab);
      }
    }
  },
  //待运输项目点击跳转页面
  loadWaitdata(e) {
    var no = e.currentTarget.dataset["no"];
    wx.navigateTo({
      url: `../list/list?orderId=${no}&show=1`
    })
  },
  /**
   * 加载数据 tab区分加载项
   */
  loadData: function (currentTab) {
    const auth = wx.getStorageSync("auth");
    // 加载数据前先判断用户是否已经认证
    if (auth != "") {
      // 加载当前tab页
      let tab = currentTab == 0 ? "wait" : currentTab == 1 ? "transportation" : "complte";
      let url = currentTab == 0 ? `${app.globalData.baseUrl}/orders/cpending` : currentTab == 1 ? `${app.globalData.baseUrl}/orders/ctransporting` : `${app.globalData.baseUrl}/orders/carownerHistory`;

      wx.request({
        url,
        data: {
          page_size: 10,
          page: this.data[tab]["current_page"] + 1,
        },
        header: {
          "Authorization": "Basic " + auth
        },
        success: (res) => {
          if (res.statusCode == 200) {
            
            let { total, current_page, last_page, data } = res.data;
            if (currentTab == 0) {
              this.setData({
                wait: {
                  load: true,
                  msg: '没有相关订单',
                  total,
                  current_page,
                  last_page,
                  data: [...this.data.wait.data, ...data]
                }
              })
            } else if (currentTab == 1) {
              this.setData({
                transportation: {
                  load: true,
                  msg: '没有相关订单',
                  total,
                  current_page,
                  last_page,
                  data: [...this.data.transportation.data, ...data]
                }
              })
            } else {
       
              this.setData({
                complte: {
                  load: true,
                  msg: '没有相关订单',
                  total,
                  current_page,
                  last_page,
                  data: [...this.data.complte.data, ...data]
                }
              })
            }
            wx.hideLoading();
          } else if (res.statusCode == 401){
            util.removeAuthor();
            wx.hideLoading();
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
          }
        }
      })
    }else{
      wx.hideLoading();
    }
  },
  // 如果数据发生了变化，则需要重新渲染页面
  reloadData(currentTab) {
    const auth = wx.getStorageSync("auth");
    // 加载数据前先判断用户是否已经认证
    if (auth != "") {
      // 加载当前tab页
      let tab = currentTab == 0 ? "wait" : currentTab == 1 ? "transportation" : "complte";
      let url = currentTab == 0 ? `${app.globalData.baseUrl}/orders/cpending` : currentTab == 1 ? `${app.globalData.baseUrl}/orders/ctransporting` : `${app.globalData.baseUrl}/orders/carownerHistory`;
      // let hisData = this.data[tab]["data"];
      // let hispic = JSON.stringify(hisData);
      let auth = wx.getStorageSync("auth");
      wx.request({
        url,
        data: {
          page_size: 10,
          page: 1,
        },
        header: {
          "Authorization": "Basic " + auth
        },
        success: (res) => {
          if (res.statusCode == 200) {
            let { total, current_page, last_page, data } = res.data;
            // let pic = JSON.stringify(data);
            // 只有总数发生了变化的情况下才会去重新加载数据
            if (true) {
              if (currentTab == 0) {
                this.setData({
                  wait: {
                    msg: '没有相关订单',
                    load: true,
                    ...res.data
                  }
                })
              } else if (currentTab == 1) {
                this.setData({
                  transportation: {
                    msg: '没有相关订单',
                    load: true,
                    ...res.data
                  }
                })
              } else {
                this.setData({
                  complte: {
                    msg: '没有相关订单',
                    load: true,
                    ...res.data
                  }
                })
              }
            }
            wx.hideLoading();
          } else if (res.statusCode == 401){
            util.removeAuthor();
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '您的登录已过期，需要重新登录',
              showCancel:false,
              success:()=>{
                wx.reLaunch({
                  url: '../consign/consign',
                })
              }
            })
          }
        }
      })
    }else{
      wx.hideLoading();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading();
    const auth = wx.getStorageSync("auth");
    if(auth!=""){
      this.setData({
        auth
      })
      let currentTab = this.data.currentTab;
      let tab = currentTab == 0 ? "wait" : currentTab == 1 ? "transportation" : "complte";
      let { load } = this.data[tab];
      if (!load) {
        this.loadData(currentTab);
      } else {
        this.reloadData(currentTab);
      }
      wx.hideLoading();
    }else{
      this.initData();
      wx.hideLoading();
    }

    this.setData({
      login:true
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    let currentTab = this.data.currentTab;
    let tab = currentTab == 0 ? "wait" : currentTab == 1 ? "transportation" : "complte";
    let { current_page, last_page } = this.data[tab];
    if (current_page < last_page) {
      this.loadData(currentTab);
    }
    wx.hideNavigationBarLoading();
  },
  /**
   * 分享功能
   */
  onShareAppMessage() {
    return {
      title: '筋斗云轿车物流',
      path: '/pages/orderQuery/orderQuery',
      imageUrl: '../../images/logo.png'
    }
  },
  getUserInfo(res){
    const { userInfo } = res.detail;
    if (userInfo != undefined) {
      const { nickName, avatarUrl } = userInfo;
      const login = this.data.login ? 1 : 0;
      wx.navigateTo({
        url: `../login/login?nickName=${nickName}&avatarUrl=${avatarUrl}&login=${login}`,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '授权未通过,部分功能无法使用！',
        showCancel: false
      })
    }
  },
  //下订单
  placeOrder(){
    wx.navigateTo({
      url: '../placeOrder/placeOrder',
    })
  },
  onPullDownRefresh(){ 
    wx.showNavigationBarLoading();
    let currentTab = this.data.currentTab;
    let tab = currentTab == 0 ? "wait" : currentTab == 1 ? "transportation" : "complte";
    this.reloadData(currentTab);
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  }
})