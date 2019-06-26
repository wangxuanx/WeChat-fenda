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
    feedList: [
      {
        _id: 1,
        user: {
          avatarUrl: "../../img/avatar/chenyu.jpg",
          nickName: "陈宇",
        },
        thumbs: true,
        praise: 20,
        followed: true,
        date: "3小时前",
        image_group: ["https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg",],
        text: "据悉，三星盖乐世官方微博突然发布预告海报，宣布将于6月25日在北京召开“三星远见·未来媒体沟通会”。海报主题则是直打5G，海报显示“5G is now”，毫无疑问地显示此次沟通会内容将与5G有关，疑似国内版三星Galaxy S10 5G版即将亮相"
      },
    ]
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    console.log('onLoad')
    wx.request({
      url: 'https://api.getweapp.com/thirdparty/fenda/feeds-init.json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          feedList: res.data
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
  onPullDownRefresh: function () {
    console.info("被拉下了")
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
