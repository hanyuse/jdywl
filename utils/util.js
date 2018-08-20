/**
 * 获取本地存储的用户信息
 * 用户绑定了手机号码才视为已登录，登录后本地才会存储用户信息
 * 参数self 当前页面
 * userInfo 中存储 auth，姓名、手机号码
 * init代表初始化成功
 */
const getLocalUserInfo = (self) => {
  wx.showLoading();
  const userInfo = wx.getStorageSync("userInfo");
  if (userInfo == "") {
    // 未登录
    self.setData({
      login: false,
      init: true,
      baseUrl: 'https://api.jdywl.cn'
    })
  } else {
    // 已登入
    self.setData({
      userInfo,
      login: true,
      init: true,
      newphone: userInfo.phone,//修改用户手机号码时使用
      baseUrl: 'https://api.jdywl.cn'
    })
  }
  wx.hideLoading();
}

module.exports.getLocalUserInfo = getLocalUserInfo;

/**
 * 获取url中的指定参数值
 */
const getQueryString = (url, name) => {
  let index = url.indexOf("?");
  let str = url.substring(index + 1);
  let arr = str.split('&');
  let result = "";
  arr.forEach((item) => {
    let a = item.split('=');
    if (a[0] == name) {
      result = a[1];
    }
  })
  return result;
}

module.exports.getQueryString = getQueryString;

/**
 * 手机号码正则
 */

const regPhone=phone=>{
  let reg = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/g;
  return reg.test(phone);
}
module.exports.regPhone = regPhone;
/**
 * 19位订单号
 */

const listTest = listNO =>{
  const reg = /^([A-Za-z]|[0-9]){19}$/;
  return reg.test(listNO);
}

module.exports.listTest = listTest;


// base64编码解码
const Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = this._utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }
    return output;
  },
  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = this._utf8_decode(output);
    return output;
  },
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },
  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c = 0;
    var c1 = 0;
    var c2 = 0;
    var c3 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}
module.exports.base64 = Base64;

//检查数组中是否已经包含对应的值，限制数组大小为10
const checkArrayKey =(value,arr)=>{
  let exist = false;
  let newArr = [];
  for(let i=0;i<arr.length;i++){
    if (arr[i].order_no == value.order_no){
      exist = true;
      continue;
    }
    newArr[newArr.length] = arr[i];
  }

  newArr.unshift(value);
  if (newArr.length>10){
    newArr.pop();
  }

  return newArr;
}

module.exports.checkArrayKey = checkArrayKey;

const formatTime = () => {
  let date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports.formatTime = formatTime;

//清空认证信息

const removeAuthor = ()=>{
  wx.removeStorageSync("userInfo");
  wx.removeStorageSync("auth");
}

module.exports.removeAuthor = removeAuthor;

