
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    feedList: []
  },
  onLoad: function (options) {
    let _openid = options._openid
    let _this = this
    let user = wx.cloud.database().collection('user')
    user.where({
        _openid: app.globalData.userInfo._openid
    }).get().then(res => {
      _this.setData({
        userInfo: res.data[0]
      })
      console.log(res)
      _this.fetchVoiceList()
    })
  },
  onPullDownRefresh: function () {
    var _this = this;
    console.log("用户下拉")
    wx.showNavigationBarLoading()
    shipLength = 0;
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      _this.setData({
        feedList: []
      })
      _this.fetchVoiceList();
    }, 1000);
  },
  
  lower: function () {
    console.log("到底啦")
    this.fetchVoiceList()
  },

  fetchVoiceList() {
    let _this = this
    wx.cloud.init()
    let voice = wx.cloud.database().collection('my-voice')
    voice.where({
      _openid: _this.data.userInfo._openid
    }).limit(10).get().then(res => {
      console.log(_this.data.userInfo._openid, res)
      let feedList = _this.data.feedList
      feedList = feedList.concat(res.data.feedList)
      for (let j = 0; j < res.data.length; j++) {
        let fileID = res.data[j].image
        if (fileID) {
          wx.cloud.downloadFile({
            fileID: fileID,
            success: res => {
              _this.setData({
                ['feedList[' + _this.data.feedList.length + j + '].image']: res.tempFilePath
              })
            }
          })
        }
      }
      _this.setData({
        feedList: feedList
      })
    })
  },
})
