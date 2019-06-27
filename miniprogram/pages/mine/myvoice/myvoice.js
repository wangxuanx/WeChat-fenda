//feeds.js
//获取应用实例
var app = getApp()
var shipLength = 0;
Page({
  data: {
    hidden: true,
    feedList: [],
    userInfo: null
  },
  onLoad: function(){
    wx.cloud.init()
    var _this = this;
    let userid = app.globalData.userInfo._openid;
    let user = wx.cloud.database().collection('user')
    user.where({
      _openid: userid
    }).get().then(res => {
      _this.setData({
        userInfo: res.data[0]
      })
    })
    console.log(this.userInfo);
    this.fetchVoiceList();
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.setData({
      feedList: []
    })
    shipLength = 0;
    this.fetchVoiceList()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000);
  },
  onReachBottom: function () {
    console.log('bottom')
    this.fetchVoiceList()
  },
  fetchVoiceList() {
    let _this = this
    let voice = wx.cloud.database().collection('voice-test')
    
    let userid = app.globalData.userInfo._openid;

    //获取voice
    voice.where({
      _openid:userid
    }).skip(shipLength*10).limit(10).get().then(res => {
      let feedList = _this.data.feedList
      let select_list = res.data;
      //console.log(res.data);
      for (let i = 0; i < select_list.length; i++) {
        let fileId = select_list[i].image;
        if (fileId) {
          wx.cloud.downloadFile({
            fileID: fileId,
            success: res => {
              console.log(res.tempFilePath)
              select_list[i] = res.tempFilePath;
            }
          })
        }
      }
      //下次跳过读取
      shipLength +=1;
      feedList = feedList.concat(select_list)
      console.log(feedList)
      _this.setData({
        feedList: feedList
      })
      //console.log(tempList);
    })
  },

  toPerson: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../person/person?master=' + e.target.dataset.master
    })
  },
  upper: function () {

  },
  lower: function () {
    console.log("到底啦")
    this.fetchVoiceList()
  },
  requestFlag: false,
  getFeeds: function () {
    var that = this
  }
})
