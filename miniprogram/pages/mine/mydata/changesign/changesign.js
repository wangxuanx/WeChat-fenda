// miniprogram/pages/mine/mydata/changesign/changesign.js
Page({
  data:{
    usersign: ""             //获取到的用户签名
  },

  bindFormsubmit: function (e) {         //从输入框获取签名
    console.log(e.detail.value)
    if ((e.detail.value.textarea) != "") {
      this.setData({
        usersign: e.detail.value
      })
    }
  }
})