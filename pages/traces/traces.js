const app = getApp();
wx.hideShareMenu();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { orderId } = options;
    this.setData({
      orderId
    });

    wx.request({
      url: `${app.globalData.baseUrl}/open/orders/${orderId}/traces`,
      success: (res) => {
        if (res.statusCode == 200) {
          this.setData({
            traces: res.data
          })
        } else {
          this.setData({
            traces: null
          })
        }
      },
      fail: () => {
        this.setData({
          traces: null
        })
      }
    })

  }
})