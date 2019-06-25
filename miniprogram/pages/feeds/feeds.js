//feeds.js
//获取应用实例
var app = getApp()
Page({
    data: {
        hidden: true,
        motto: 'Hello World',
        userInfo: {},
        feedList: []
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
    requestFlag: false,
    getFeeds: function() {
        var that = this
    }
})
