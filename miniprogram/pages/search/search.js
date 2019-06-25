Page({
    data: {
        hotMasters: [{
            id:0,
            name: "陈章鱼",
            avater: "czy.png",
            intro: "知乎50万关注答主，人丑就该多读书",
            fans: 2821,
            if_follow: false
        }, {
            id:1,
            name: "马东",
            avater: "md.png",
            intro: "米未传媒CEO",
            fans: 18967
        }, {
            id:2,
            name: "张翼",
            avater: "lcx.png",
            intro: "猫奴+转业军官+电影/电视剧 演员",
            fans: 3646
        }],
        newMasters: [{
            name: "张男双",
            avater: "gzy.png",
            intro: "天文学家",
            fans: 4726
        }, {
            name: "龚琳娜",
            avater: "df.png",
            intro: "知乎50万关注答主，人丑就该多读书",
            fans: 2821
        }, {
            name: "古典",
            avater: "md.png",
            intro: "《拆掉思维里的墙》作者",
            fans: 3286
        }]
    },
    onLoad: function() {

    },
    //跳转函数
    toPerson: function(event) {
      var targetUrl = '/pages/person/person?id=' + event.currentTarget.dataset.userId;
      console.log(event);
      wx.navigateTo({
        url: targetUrl//实际路径要写全
      })
    },

    handleFollowTap: function() {
      console.log("handle follow");
    },
    handleFollowTap: function(event) {
      var changeId = 'hotMasters[' + event.target.dataset.followId + '].if_follow';
      this.setData({
        [changeId]:false
      })
    },
    handleNotFollowTap: function(event) {
      //console.log("handle not follow");
      //注意需要调动后端接口
      var _this = this;
      var _event = event;
      
      wx.showModal({
        content: '确定要取消关注 ' + event.target.dataset.followName +' 吗？',
        success(res) {
          if (res.confirm) {
            //console.log('用户点击确定');
            var changeId = 'hotMasters[' + event.target.dataset.followId + '].if_follow';
            _this.setData({
              [changeId]: true
            })
            //调用服务器接口！
          } else if (res.cancel) {
            //do nothing
            console.log('用户点击取消');
          }
        }
      })
    }
})
