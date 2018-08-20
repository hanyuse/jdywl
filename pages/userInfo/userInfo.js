const util = require("../../utils/util.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    util.getLocalUserInfo(this);
  },
  getUserInfo(res) {
    const { userInfo } = res.detail;
    if (userInfo != undefined) {
      const { nickName, avatarUrl } = userInfo;
      const login = this.data.login?1:0;
      wx.navigateTo({
        url: `../login/login?nickName=${nickName}&avatarUrl=${avatarUrl}&login=${login}`
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '授权未通过,部分功能无法使用！',
        showCancel:false
      })
    }
  },
  loginout(){
    util.removeAuthor();
    wx.reLaunch({
      url: 'userInfo',
    })
  },
  service(){
    wx.navigateTo({
      url: "../service/service"
    })
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