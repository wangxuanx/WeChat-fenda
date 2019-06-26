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
      this.fetchVoiceList()
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
    let user = wx.cloud.database().collection('user')
    let voice = wx.cloud.database().collection('my-voice')
    user.where({
      _openid : _this.data.userInfo._openid
    }).get().then(res => {
      let follow_list = res.data[0].follow_list
      _this.setData({
        followList: follow_list
      })
      let feedList = _this.data.feedList
      for (let i = 0; i < 10; i++) {
        let select_list = []
        voice.skip(feedList.length).limit(10).get().then( res => {
          select_list = res.data
          for (let j = 0; j < select_list.length; j++) {
            if (follow_list.includes(select_list[j]._openid)) {
              let fileId = select_list[j].image
              if (fileId) {
                // select_list[j].image = wx.cloud.downloadFile({
                //   fileID: fileId
                // })
                wx.cloud.downloadFile({
                  fileID: fileId,
                  success: res => {
                    _this.setData({
                      ['feedList['+j+'].image']: res.tempFilePath
                    })
                    // select_list[j].image = res.tempFilePath
                  }
                })
              }
              user.where({
                _openid: select_list[j]._openid
              }).get().then( res => {
                select_list[j].userInfo = res.data[0]
                feedList = feedList.concat(select_list[j])
                _this.setData({
                  feedList: feedList
                })
              })
            }
          }
        })
        if (select_list.length < 9) break;
        if (feedList.length > 9) break
      }
    })
  },
})
