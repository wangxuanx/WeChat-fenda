let app = getApp()
let top20userInfo

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
      wx.cloud.init()
      let _this = this
      const userCollection = wx.cloud.database().collection("user")
      const relationCollection = wx.cloud.database().collection("relation")
      
      // 获取fan_num前20用户信息
      userCollection.orderBy('fan_num', 'desc').limit(20).get({
        success: res => {
          // console.log(res)
          top20userInfo = res.data
          // 获取关注关系
          var fan_id = app.globalData.userInfo._openid
          console.log(fan_id)
          for(rk in res.data){
            var follow_id = res.data[rk]._openid
            relationCollection.where({
              fan: fan_id,
              follow: follow_id,
            }).get().then(fd =>{
              if(fd.data.length>0){
                res.data[rk].if_follow = true
              }
              else{
                res.data[rk].if_follow = false
              }
            })
          }
          // 设置页面数据
          _this.setData({
            hotMasters: res.data
          })
        }
      })
    },

    //跳转函数
    toPerson: function(event) {
      var targetUrl = '/pages/person/person?id=' + event.currentTarget.dataset.userId;
      console.log(event);
      wx.navigateTo({
        url: targetUrl//实际路径要写全
      })
    },

    handleFollowTap: function(event) {
      // console.log(event)
      var changeId = 'hotMasters[' + event.target.dataset.followId + '].if_follow';
      this.setData({
        [changeId]:false
      })
      // 添加关注关系
      const relationCollection = wx.cloud.database().collection("relation")
      var fan_id = app.globalData.userInfo._openid
      var follow_id = top20userInfo[event.currentTarget.followId]._openid
      relationCollection.where({
        fan: fan_id,
        follow: follow_id
      }).get().then(res => {
        if(res.data.length==0){
          relationCollection.add({
            data:{
              fan: fan_id,
              follow: follow_id
            },
            success(){ console.log("添加关注成功\n")}
          })
        }
        else { console.log("已存在关注关系\n")}
      })
    },

    handleNotFollowTap: function(event) {
      // console.log("handle not follow");
      // 注意需要调动后端接口
      var _this = this;
      var _event = event;
      wx.showModal({
        content: '确定要取消关注 ' + event.target.dataset.followName +' 吗？',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定');
            var changeId = 'hotMasters[' + event.target.dataset.followId + '].if_follow';
            _this.setData({
              [changeId]: true
            })
            // 调用服务器接口
            var fan_id = app.globalData.userInfo._openid
            var follow_id = top20userInfo[event.currentTarget.followId]._openid
            relationCollection.where({
              fan: fan_id,
              follow: follow_id
            }).get().then(res => {
              if(res.data.length>0){
                relationCollection.where({
                  fan: fan_id,
                  follow: follow_id
                }).remove({
                  success() { console.log("数据库取消关注成功\n") },
                  fail() { console.log("数据库关注关系删除失败\n") }
                })
              }
              else{
                console.log("不存在关注关系\n")
              }
            })
          } else if (res.cancel) {
            // do nothing
            console.log('用户点击取消');
          }
        }
      })
    }
})
