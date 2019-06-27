var app = getApp()

Page({

  data: {
    userInfo: {},
    userSign: {},
  },
  onLoad: function () {            //获取全局数据
    console.log('onLoad')
    let _this = this
    wx.cloud.init()
    const userCollection = wx.cloud.database().collection("user")
    const _ = wx.cloud.database().command

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      _this.setData({
        userInfo: userInfo
      })
    })

    // 获取用户签名
    userCollection.where({
      _openid: app.globalData.userInfo._openid
    }).get({
      success: res => {
        _this.setData({
          userSign: res.data[0].desc
        })
        console.log("更新签名成功")
        console.log(_this.data)
      },
      fail: res => { console.log(res)}
    })

  },
  
  changeSign: function() {             //修改签名函数
    wx.navigateTo({
      url: '/pages/mine/mydata/changesign/changesign',
    })
  },

  onShow() { //返回显示页面状态函数
    //可以进行局部优化
    this.onLoad()//再次加载，实现返回上一页页面刷新
  }
})