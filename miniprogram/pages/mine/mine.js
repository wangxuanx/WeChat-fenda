// mine.js
var app = getApp()
Page({
    
    data: {
        userInfo: {},
        myProfile: [
          { "desc": "我的资料", "id": "mydata" }, 
          { "desc": "我的主页", "id": "mypage" }, 
          { "desc": "通用","id": "normalsetting" }],
        myAccount: [ 
          {"name": "帮助","id": "help"},
          {"name": "关于分答","id": "about"}],
        myData: [{
          id: "myhear",
          name: "我的听众",
          img: "../../img/my-hear.png",
        },
        {
          id: "hearme",
          name: "收听我的",
          img: "../../img/hear-me.png",
        },
        {
          id: "myvoice",
          name: "我的心声",
          img: "../../img/my-voice.png",
        }],
    },
    onLoad: function() {
        console.log('onLoad')
        var that = this
            //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    },
    onShow: function() {
        console.info("show")
    },

    loadProfile: function(e) {
        console.log(e.target)
    },

    changeabout: function() {      //跳转到关于界面
      wx.navigateTo({
        url: '../mine/about/about-fenda',
      })
    },
    changehelp: function() {           //跳转到登录界面
      wx.navigateTo({
        url: '../mine/help/help',
      })
    },
    changenumber: function() {            //跳转到电话号码界面—————待定
      wx.navigateTo({
        url: '../main/number/number',
      })
    },
    exitUser: function() {        //退出登录按钮事件
      wx.reLaunch({
        url: '../search/search',
      })
    },
    jumpmyhear: function() {              //跳转到我的听众列表
      wx.navigateTo({
        url: '*****',              //此处url为听众列表界面
      })
    },
    jumphearme: function() {                //跳转到收听我的界面
      wx.navigateTo({
        url: '*****',                //此处url链接到我的听众列表
      })
    },
    jumpmyvoice: function() {               //跳转到我的心声界面
      wx.navigateTo({
        url: '*****',                 //此处url链接到我的心声列表，其中有我的心声
      })
    },
    mydata: function() {                 //跳转到我的资料设置
      wx.navigateTo({
        url: '../mine/mydata/mydata',
      })
    },
    mypage: function() {                //跳转到用户的主页
      wx.navigateTo({
        url: '****',
      })
    },
    normalsetting: function() {             //跳转到通用设置界面
      wx.navigateTo({
        url: '../mine/normalsetting/normalsetting',
      })
    }
})
