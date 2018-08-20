const util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login:false, //用户是否已经登入
    waitMsg:"获取密码",//获取密码等待状态
    disablePwd:false,//密码下发成功后灰化获取密码按钮
    message:""//用户姓名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    const { nickName, avatarUrl,login} = options; 
    if (login!==undefined){
      let title = login == 1 ? "更改手机号" : "登录";
      wx.setNavigationBarTitle({
        title
      })
    }

    util.getLocalUserInfo(this);
    if (nickName && avatarUrl) {
      this.setData({
        nickName,
        headimgurl: avatarUrl
      })
    }
  },
  // 新设手机号码提交表单
  formSubmit(e) {
    this.submitForm(e.detail.value); 
  },
  // 修改用户信息提交表单
  modifyUserInfo(e){
    this.submitForm(e.detail.value);
  },
  // 提交表单
  submitForm(values){
    const { phone, password, nickname } = values;
    if (nickname.trim() == "" || phone.trim() == "" || password.trim() == "") {
      wx.showModal({
        title: '提示',
        content: nickname.trim() == "" ? "姓名不能为空" : phone.trim() == "" ? "手机号不能为空" : "密码不能为空",
        showCancel: false
      })
    } else {
      // 校验通过
      wx.showLoading();
      new Promise((resolve,reject)=>{
         wx.login({
           success:(res)=>{
             resolve(res);
           }
         }) 
      }).then((result)=>{
        wx.request({
          url: `${app.globalData.baseUrl}/users/wxlogin`,
          method: "POST",
          data: {
            nickname,
            phone,
            password,
            headimgurl: this.data.headimgurl,
            jscode: result.code
          },
          success: (res) => {
            if (res.statusCode == 200 && res.data["status_code"] == 0) {
              // 保存用户相关信息到本地
              let auth = util.base64.encode(`${phone}:${password}`);
              let userInfo = { ...res.data, phone };
              wx.setStorageSync("userInfo", userInfo);
              wx.setStorageSync("auth", auth);
              wx.hideLoading();
              wx.navigateBack();
            } else if (res.statusCode == 500 || res.statusCode ==20000){
              wx.hideLoading();
              wx.showModal({
                title: '系统提示',
                content: '系统故障，请稍后再试！',
                showCancel: false,
              })
            } else {
              wx.hideLoading();
              wx.showModal({
                title: '系统提示',
                content: res.data.message,
                showCancel: false,
              })
            }
          },
          fail: () => {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '网络超时，请稍后再试',
              showCancel: false
            })
          }
        })
      }).catch(()=>{
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '网络超时，请稍后再试',
          showCancel: false
        })
      })
    }
  },
  // 点击姓名后面的按钮清空message
  deleteName(){
    this.setData({
      "userInfo.message":""
    })
  },
  deletePhone(){
    this.setData({
      newphone: ""
    })
  },
  changeNewPhone(e){
    const { value } = e.detail;
    this.setData({
      newphone:value.trim()
    })
  },
  //姓名与message双向绑定
  saveChangeName(e){
    const {value} = e.detail;
    this.setData({
      message:value
    })
  },
  // 获取验证码
  getPwd(){
    //点击获取密码时直接先灰化按钮
    if (this.data.disablePwd){
      return;
    }

    if (!util.regPhone(this.data.newphone)){
        wx.showModal({
          title: '提示',
          content: '请输入正确手机号码',
          showCancel: false
        })
        return false;
    }

    this.setData({
      disablePwd: true
    })
    wx.request({
      url: `${this.data.baseUrl}/logincode`,
      data:{
        phone: this.data.newphone
      },
      success:(res)=>{
        if (res.statusCode == 200 && res.data["status_code"] == 0){
          let times = 60;
          let cla = setInterval(()=>{
            this.setData({
              waitMsg:`剩余${--times}秒`,
              disablePwd:true
            })
            
            if(times==0){
              clearInterval(cla);
              this.setData({
                waitMsg: "获取密码",
                disablePwd: false
              })
            }
          },1000)
        }else{
          wx.showModal({
            title: '提示',
            content: '获取密码失败，请稍后再试',
            showCancel: false
          })
          this.setData({
            waitMsg: "获取密码",
            disablePwd: false
          })
        }
      },
      fail:()=>{
        this.setData({
          waitMsg: "获取密码",
          disablePwd: false
        })
      }
    })
  },
  })