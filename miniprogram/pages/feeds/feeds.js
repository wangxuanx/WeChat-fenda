//feeds.js
//获取应用实例
var app = getApp()
Page({
    data: {
        hidden: true,
        motto: 'Hello World',
        userInfo: {},
        feedList: [],
        pics:[]
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {
        var that = this
        console.log('onLoad')
    },
    onPullDownRefresh: function() {
        console.info("被拉下了")
    },
    toPerson: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '../person/person?master=' + e.target.dataset.master
        })
    },
    upper: function() {

    },
    lower: function() {
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
    uploadImage:function() {
      let that = this
      let pics = that.data.pics
      wx.chooseImage({
        count: 9 - pics.length, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          var imgsrc = res.tempFilePaths;
          pics = pics.concat(imgsrc);
          that.setData({
            pics: pics
          });
          console.log(res)
        },
        fail: function () {
          // fail      
        },
        complete: function (res) {
          console.log(res)
        }
      })
    }
})
