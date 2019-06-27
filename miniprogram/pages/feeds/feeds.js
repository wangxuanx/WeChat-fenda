//feeds.js
//获取应用实例
var app = getApp()
Page({
    data: { 
        hidden: true,
        feedList: [],
        followList: []
    },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onShow: function() {
    this.fetchVoiceList();
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.setData({
      feedList: []
    })
    this.fetchVoiceList()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000);
  },
  onReachBottom: function() {
    console.log('bottom')
      this.fetchVoiceList()
  },
  fetchVoiceList() {
    console.log('voice')
    let _this = this
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'getVoice',
      data: {
        feedList: _this.data.feedList
      },
      success: res => {
        console.log(res)
        _this.setData({
          feedList: res.result.feedList
        })
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  toFollow(event){
    var index = event.currentTarget.id;
    console.log(index);
    if (this.data.feedList[index]) {
      var followed = this.data.feedList[index].followed;
      if(followed){
        this.data.feedList[index].followed = false;
      }else{
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
       if(hasChange) {
         this.data.feedList[index].praise = (onum - 1);
         this.data.feedList[index].thumbs = false;
       }else {
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
    this.fetchVoiceList()
  },
  requestFlag: false,
  getFeeds: function () {
    var that = this
  }
})
