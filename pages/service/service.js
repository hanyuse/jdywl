// pages/service/service.js
wx.hideShareMenu();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'15910550165',
    service:'13651217220'
  },
  callPhone: function (e) {
    let phone = e.currentTarget.dataset["phone"];
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
})