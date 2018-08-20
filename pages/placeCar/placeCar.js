// pages/placeCar/placeCar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    const { types } = options;
    this.setData({
      types
    })
    let title = types == 0 ? "选择车型" : "增值服务介绍";
    wx.setNavigationBarTitle({
      title
    })
  },
  // 设置下单时的轿车类型
  setBrandValue(e){
    const { brand} = e.currentTarget.dataset;
    let value = brand == 0 ? "大型SUV" : brand == 1 ? "标准SUV" : brand == 2 ? "标准轿车" : "";
    let pages = getCurrentPages();
    let page = pages[pages.length-2];
    page.setData({
      brand: value
    })
    page.calPrice({ ...page.data, brand: value});
    wx.navigateBack();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '筋斗云轿车物流',
      path: '/pages/orderQuery/orderQuery',
      imageUrl: '../../images/logo.png'
    }
  }
})