let app = getApp()
wx.cloud.init()
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
  },

  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              wx.cloud.callFunction({
                name: 'login',
                success: log_res => {
                  console.log(log_res)
                  res.userInfo._openid = log_res.result.openid
                  app.globalData.userInfo = res.userInfo
                  console.log(app.globalData)
                }
              })
            }
          });
          wx.reLaunch({
            url: '../feeds/feeds',
          })
        } 
        else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    let userInfo = e.detail.userInfo
    if (userInfo) {
      //用户按了允许授权按钮
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：")
      console.log(userInfo)
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      this.setData({
        isHide: false
      });
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          console.log(res.result)
          const userCollection = wx.cloud.database().collection('user')
          userCollection.where({
            _openid: res.result.openid
          }).get().then(fd => {
            // console.log(fd)
            if (fd.data.length == 0) {
              console.log("添加用户\n")
              userCollection.add({
                data: {
                  avatarUrl: userInfo.avatarUrl,
                  desc: "写点东西介绍自己吧！",
                  fan_list: [],
                  fan_num: 0,
                  follow_list: [],
                  follow_num: 0,
                  nickName: userInfo.nickName,
                }, success: res => {
                  app.globalData.userInfo = userInfo
                }, fail: err => {
                }
              })
            }
            else { console.log("用户已存在\n")}
          }
          )
        }
      })
      wx.reLaunch({
        url: '../feeds/feeds',
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})