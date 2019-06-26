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
        feedList: [],
        followList: []
    },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
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
  onReachBottom: function() {
    setTimeout(() => {
      this.fetchVoiceList();
    },500) 
  },
  fetchVoiceList() {
    console.log(app.globalData)
    var _this = this
    wx.cloud.init()
    let user = wx.cloud.database().collection('user')
    let voice = wx.cloud.database().collection('my-voice')
    user.where({
      _openid : app.globalData.userInfo._openid
    }).get().then(res => {
      console.log(res)
      _this.setData({
        followList: res.data.followList
      })
    })
    for (let item in this.data.followList) {
      console.log(item)
    }
    // voice.where()

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
  }
})
