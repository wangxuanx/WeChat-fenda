//index.js
//获取应用实例
var app = getApp()
Page({
    
    data: {
      userInfo:undefined
    },
    onLoad: function(e) {
      console.log(e.id);
        //根据e.id发请求
      var userId = e.id;
      var _this = this;
      this.setData({
        userInfo:_this.testData[userId]
      })
      console.log(this.data.userInfo);
        
    },
    toIssue: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '../issue/issue?master=' + e.target.dataset.master
        })
    },


    testData: [{
    id: 0,
    name: "陈章鱼",
    avater: "czy.png",
    intro: "知乎50万关注答主，人丑就该多读书",
    quizCost: 9.9,
    detail: "每年至少读100本书，加200天班，还抽空追10部美剧，涨了5斤体重, 唯一能天天坚持的只有四件事：吃饭睡觉喘气读书",
    fans: 2821,
    if_follow: false
  }, {
    id: 1,
    name: "马东",
    avater: "md.png",
    intro: "米未传媒CEO",
    fans: 18967,
    quizCost: 9.9,
    detail: "每年至少读100本书，加200天班，还抽空追10部美剧，涨了5斤体重, 唯一能天天坚持的只有四件事：吃饭睡觉喘气读书",
    if_follow: false
  }, {
    id: 2,
    name: "张翼",
    avater: "lcx.png",
    intro: "猫奴+转业军官+电影/电视剧 演员",
    fans: 3646,
    quizCost: 9.9,
    detail: "每年至少读100本书，加200天班，还抽空追10部美剧，涨了5斤体重, 唯一能天天坚持的只有四件事：吃饭睡觉喘气读书",
    if_follow: false
  }]
})
