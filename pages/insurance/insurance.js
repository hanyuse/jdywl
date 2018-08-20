const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    const { orderId } = options;
    this.setData({
      src: `${app.globalData.baseUrl}/open/insurance/show/${orderId}`
    })
  }
})