const util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    srv:0,
    types:"",
    search:"",
    origin:[],
    des:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // 通过types判断 0表示始发地，1表示目的地
    const {types,origin} = options;
    let title = "大板运输"
    let url = "";
    let data = {};
    this.setData({
      types,
      search: "",
      origin: [],
      des:[]
    })
    if(types==0){
      // 始发地
      url = `${app.globalData.baseUrl}/price/origins`;
      title = "选择始发地";
      data = {
        srv: this.data.srv
      }
    } else if (types == 1){
      // 目的地
      if (origin == undefined || origin == "" || origin=='-1')return;
      url = `${app.globalData.baseUrl}/price/destinations`;
      title = "选择目的地";
      data = {
        srv: this.data.srv,
        origin
      }
    }
    wx.setNavigationBarTitle({
      title
    })


    wx.request({
      url,
      data,
      success:(res)=>{
        if(res.statusCode==200){
          if (types==0){
            this.setData({
              origin: res.data.prices
            })
          }else{
            this.setData({
              des: res.data.prices
            })
          }    
        }
      }
    })
  },
  changeSearch(e){
    let {value} = e.detail;
    this.setData({
      search: value.trim()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  setValue(e){
    let {place} = e.currentTarget.dataset;
    let pages = getCurrentPages();
    let page = pages[pages.length-2];
    if(page!=undefined){
      if (this.data.types == 0 && page.data.orgin != place){
        page.setData({
          orgin: place,
          destination:"-1",
          addtionalsrv:0,
          hasAddtion:0,  //重新选择始发地后先灰化增值服务，待选择目的地后再做判断是否放开
          calPrice:0,  //隐藏费用
          totalBill:0  //总费用清零
        })
      } else if (this.data.types == 1 && page.data.destination != place){
        page.setData({
          destination: place
        })
        page.calPrice({...page.data})
        // 根据始发地和目的地获取线路信息
        wx.request({
          url: `${app.globalData.baseUrl}/price/route`,
          data: {
            origin: page.data.orgin,
            destination: place
          },
          success:(res)=>{
            if(res.statusCode==200){
              const { addtionalSrv } = res.data;
              // 0代表无增值服务，通过hasAddtion来控制下单页面增值服务是否灰化
              let hasAddtion = addtionalSrv==0?0:1;
              page.setData({
                addtionalsrv:0,
                hasAddtion
              })
            }

          }
        })
      }
      wx.navigateBack();
    }
  }
})