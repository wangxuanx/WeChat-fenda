//feeds.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hidden: true,
    motto: 'Hello World',
    userInfo: {},
    fllowList: [
      "Maxing",
    ],
    page: 1,
    pages: 0,
    feedList: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log("load")
    this.fetchVoiceList();
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.onLoad()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000);
  },
  onReachBottom: function () {
    setTimeout(() => {
      this.fetchVoiceList();
    }, 500)
  },
  fetchVoiceList() {
    var that = this
    wx.request({
      url: 'http://localhost:3000/feedList',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        const articles = that.data.feedList
        that.setData({
          feedList: articles.concat(res.data)
        })
        try {
          wx.setStorageSync('feeds', res.data)
        } catch (e) { }
      }
    })
  },
  toFollow(event) {
    var index = event.currentTarget.id;
    console.log(index);
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
  upper: function () {

  },
  lower: function () {
    console.log("到底啦")
    if (this.requestFlag === false) {
      this.requestFlag = true
      this.setData({
        hidden: false
      })
      var that = this
      setTimeout(that.getFeeds, 3000)
    }
  },
  requestFlag: false,
  getFeeds: function () {
    var that = this
    wx.request({
      url: 'https://api.getweapp.com/thirdparty/fenda/stamp1206.json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.requestFlag = false
        that.setData({
          hidden: true
        })
        var feedsStrorage = wx.getStorageSync('feeds') || []
        feedsStrorage = feedsStrorage.concat(res.data)
        that.setData({
          feedList: feedsStrorage
        })
        try {
          wx.setStorageSync('feeds', feedsStrorage)
        } catch (e) { }
        console.log("同步成功啦")
      }
    })
  }
})
