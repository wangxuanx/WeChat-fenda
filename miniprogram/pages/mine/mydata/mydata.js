var app = getApp()

Page({

  data: {
    userInfo: {},
    userSign: {},
  },
  onLoad: function () {            //获取全局数据
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  changeSign: function() {             //修改签名函数
    wx.navigateTo({
      url: '/pages/mine/mydata/changesign/changesign',
    })
  }
})