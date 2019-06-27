//feeds.js
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
      _openid: _openid
    }).get().then( res => {
      _this.setData({
       userInfo: res.data[0]
     })
      _this.fetchVoiceList()
    })
  },
  toFollow(event) {
    var index = event.currentTarget.id;
    if (this.data.feedList[index]) {
      var followed = this.data.feedList[index].followed;
      if (followed) {
        this.data.feedList[index].followed = false;
      } else {
        this.data.feedList[index].followed = true;
      }
      this.setData({
        feedList: this.data.feedList
      })
    }
  },
  toLike: function (event) {
    var index = event.currentTarget.id;
    if (this.data.feedList[index]) {
      var hasChange = this.data.feedList[index].thumbs;
      if (hasChange !== undefined) {
        var onum = this.data.feedList[index].praise;
        if (hasChange) {
          this.data.feedList[index].praise = (onum - 1);
          this.data.feedList[index].thumbs = false;
        } else {
          this.data.feedList[index].praise = (onum + 1);
          this.data.feedList[index].thumbs = true;
        }
        this.setData({
          feedList: this.data.feedList
        })
      }
    }
  },
  toPerson: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../person/person?master=' + e.target.dataset.master
    })
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
      _openid : _this.data.userInfo._openid
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
              ['feedList['+ _this.data.feedList.length+j+'].image']: res.tempFilePath
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
