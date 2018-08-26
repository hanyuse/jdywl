const util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   * -1统一代表用户未填写相关数据，要做必输校验
   */
  data: {
    
    srv:0,
    orgin:-1,
    destination:-1,
    oldcar:0,//是否二手车
    brand:"", //轿车类型
    car_num: "",
    totalCarPrice:"",
    hasAddtion:0,//是否有增值服务
    addtionalsrv:0, //0无，1托运并监管
    date:-1,
    if_invoice:0, //是否需要发票。0否，1 是
    delivery_type: 0, //是否送货上门 0否，1 是
    totalBill:0,
    marketPrice:0,
    insurance:0,
    deposit:0,
    deliveryFee:0,
    invoice:0,
    srvFee:0,
    calPrice:0 //是否已经计算过费用，用来控制运费等数据项的展示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },
  choice(){
    wx.navigateTo({
      url: '../place/place?types=0',
    })
  },
  choiceDes(){
    wx.navigateTo({
      url: `../place/place?types=1&origin=${this.data.orgin}`,
    })
  },
  // 选择轿车类型
  choiceBrand(){
    wx.navigateTo({
      url: '../placeCar/placeCar?types=0',
    })
  },
  carNumChange(e){
    this.setData({
      car_num:e.detail.value
    })
    // setData是异步函数，防止未设置成功而导致数据计算错误
    this.calPrice({ ...this.data, car_num: e.detail.value});
  },
  totalCarPriceChange(e){
    this.setData({
      totalCarPrice: e.detail.value
    })

    this.calPrice({ ...this.data, totalCarPrice: e.detail.value });
  },
  // 增值服务提醒
  remind(){
    wx.navigateTo({
      url: '../placeCar/placeCar?types=1',
    })
  },
  //新旧车选择
  changeCarType(e){
    const { oldcar } = e.currentTarget.dataset;
    this.setData({
      oldcar
    })
    this.calPrice({ ...this.data, oldCar: oldcar });
  },
  // 托运并监管
  changeSupervise(e){
    const { addtionalsrv } = e.currentTarget.dataset;
    const hasAddtion = this.data.hasAddtion;
    if (hasAddtion=="1"){
      this.setData({
        addtionalsrv
      })
      this.calPrice({ ...this.data, addtionalSrv:addtionalsrv });
    }
    
  },
  //价格计算
  calPrice(data){
   
    const { brand, car_num, totalCarPrice, orgin, destination, oldcar, addtionalsrv, if_invoice, delivery_type} = data;
    if (brand == "" || car_num <= 0 || totalCarPrice < 10000 || orgin == -1 || destination==-1){
      this.setData({
        calPrice:0,
        totalBill:0
      })
      return;  
    }
    wx.request({
      url: `${app.globalData.baseUrl}/price/calPrice`,
      data:{
        brand,
        car_num,
        totalCarPrice,
        origin: orgin,
        destination,
        oldCar:oldcar,
        addtionalSrv: addtionalsrv,
        if_invoice,
        delivery_type
      },
      success:(res)=>{
        this.setData({ ...this.data, ...res.data, calPrice:1});
      }
    })


  },
  invoiceChange(e){
    const { value } = e.detail;
    this.setData({
      if_invoice: value ? 1 : 0
    })
    this.calPrice({ ...this.data, if_invoice: value ? 1 : 0 });
  },
  deliveryChange(e){
    const {value} = e.detail;
     this.setData({
       delivery_type: value?1:0
     })
    this.calPrice({ ...this.data, delivery_type: value ? 1 : 0});
  },
  //启运日期
  bindDateChange(e){
    const {value} = e.detail;
    this.setData({
      date:value
    })
  },
  // 提交表单
  submitOrder(e){
    const { origin, destination, brand, car_num, totalCarPrice, sendtime, receiver_name, receiver_phone} = e.detail.value;
    const {formId} = e.detail
    if (origin==-1){
      wx.showModal({
        title: '提示',
        content: '请选择正确的始发地',
        showCancel:false
      })
      return false;
    }

    if (destination==-1){
      wx.showModal({
        title: '提示',
        content: '请选择正确的目的地',
        showCancel: false
      })
      return false;
    }

    if (brand==""){
      wx.showModal({
        title: '提示',
        content: '请选择轿车类型',
        showCancel: false
      })
      return false;
    }

    if (car_num==""||car_num<=0){
      wx.showModal({
        title: '提示',
        content: '请输入正确的轿车数量',
        showCancel: false
      })
      return false;
    }

    if (totalCarPrice == "" || totalCarPrice<=0){
      wx.showModal({
        title: '提示',
        content: '请输入正确的轿车总价',
        showCancel: false
      })
      return false;
    } else if (totalCarPrice > 0){
      if (totalCarPrice < 10000 || totalCarPrice>50000000){
        wx.showModal({
          title: '提示',
          content: '轿车总价范围在1万到5000万元之间',
          showCancel: false
        })
        return false;
      }
    }
 
    if (sendtime==""){
      wx.showModal({
        title: '提示',
        content: '请选择正确的启运日期',
        showCancel: false
      })
      return false;
    }

    if (receiver_name==""){
      wx.showModal({
        title: '提示',
        content: '请输入收车人姓名',
        showCancel: false
      })
      return false;
    }

    if (receiver_phone.trim() == "") {
      wx.showModal({
        title: '提示',
        content: '请输入收车人手机',
        showCancel: false
      })
      return false;
    } else { receiver_phone.trim()!=""}{
      let result = util.regPhone(receiver_phone.trim());
      if (!result){
        wx.showModal({
          title: '提示',
          content: '请输入正确收车人手机',
          showCancel: false
        })
        return false;
      }
    }

    const auth = wx.getStorageSync("auth");
    wx.request({
      url: `${app.globalData.baseUrl}/orders/storeAndPay`,
      data: { ...e.detail.value, formId},
      method:"POST",
      header:{
        'content-type':'application/x-www-form-urlencoded',
        "Authorization": "Basic " + auth
      },
      success:(res)=>{
        if(res.statusCode==200){
          wx.showToast({
            title:'已完成',
            icon:'success',
            mask:true,
            duration: 1500,
            success:()=>{
              setTimeout(()=>{
                wx.reLaunch({
                  url: '../consign/consign',
                })
              },1500)  
            }
          })
        } else if (res.statusCode == 401){
          util.removeAuthor();
          wx.showModal({
            title: '提示',
            content: '登入信息已失效，请重新登入',
            showCancel:false,
            success:()=>{
              wx.reLaunch({
                url:'../userInfo/userInfo'
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '系统故障，请稍后提交',
            showCancel: false
          })
        }
      }
    })
  }
})