// miniprogram/pages/mine/mydata/changesign/changesign.js
let app = getApp()

Page({
  data:{
    usersign: ""             //获取到的用户签名
  },

  input_sign(e){
    console.log(e)
    this.setData({
      usersign: e.detail.value
    })
  },

  bindFormsubmit: function () {         //从输入框获取签名
    wx.cloud.init()
    let _this = this
    const userCollection = wx.cloud.database().collection("user")
    const _ = wx.cloud.database().command

    userCollection.where({
      _openid: app.globalData.userInfo._openid
    }).get({
      success: res => {
        console.log(_this.data.usersign)
        userCollection.doc(res.data[0]._id).update({
          data:{
            desc: _this.data.usersign
          },
          success: res => { 
            console.log(res)
            wx.navigateTo({
              url: '/pages/mine/mydata/mydata',
            })  
          },
          fail: res => { console.log(res)}
        })
      }
    })
  }
})