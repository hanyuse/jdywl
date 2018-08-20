const app = getApp();
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
    wx.hideShareMenu();
    const { orderId } = options;
    this.setData({
      orderId
    })
    wx.request({
      url: `${app.globalData.baseUrl}/open/orders/${orderId}/carPhotos`,
      success: (res) => {
        if (res.statusCode == 200) {
          this.setData({
            car: res.data
          })
        } else {
          this.setData({
            car: null
          })
        }
      },
      fail: () => {
        this.setData({
          car: null
        })
      }
    })
  },
  // 预览图片
  showOrigin(e) {
    const { url } = e.target.dataset;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  }
})