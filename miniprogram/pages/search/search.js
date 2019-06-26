let app = getApp()
let top20userInfo

Page({
    data: {
        hotMasters: [],
        searchContent: ""
    },

    onLoad: function() {
      wx.cloud.init()
      let _this = this
      const userCollection = wx.cloud.database().collection("user")
      const relationCollection = wx.cloud.database().collection("relation")
      const _ = wx.cloud.database().command;

      // 获取fan_num前20用户信息
      userCollection.where({
          _openid: _.neq(app.globalData.userInfo._openid)
        }).get({
        success: res => {
          // console.log(res)
          _this.setData({
            hotMasters: res.data
          })
          top20userInfo = res.data
          // 获取关注关系
          var fan_id = app.globalData.userInfo._openid
          // console.log(fan_id)
          for (let rk in top20userInfo){
            // console.log(rk)
            var follow_id = top20userInfo[rk]._openid
            relationCollection.where({
              fan: fan_id,
              follow: follow_id,
            }).get().then(fd =>{
              var changeId = 'hotMasters[' + rk + '].if_follow';
              if(fd.data.length>0){
                this.setData({
                  [changeId]: true
                })
                top20userInfo[rk].if_follow = true;
                console.log("已关注\n")
              }
              else{
                this.setData({
                  [changeId]: false
                })
                top20userInfo[rk].if_follow = false;
                console.log("未关注\n")
              }
            })
          }
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
      console.log(event)
      var changeId = 'hotMasters[' + event.target.dataset.followId + '].if_follow';
      this.setData({
        [changeId]:true
      })
      // 添加关注关系
      const relationCollection = wx.cloud.database().collection("relation")
      const userCollection = wx.cloud.database().collection("user")
      const _ = wx.cloud.database().command;
      var fan_id = app.globalData.userInfo._openid
      var follow_id = top20userInfo[event.currentTarget.dataset.followId]._openid
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
            success(){ 
              userCollection.where({
                _openid: fan_id
              }).update({
                follow_list: _.push(follow_id),
                follow_num: _.inc(1)
              }).then(res=>{ console.log("更新粉丝follow列表")})
              userCollection.where({
                _openid: follow_id
              }).update({
                fan_list: _.push(fan_id),
                fan_num: _.inc(1)
              }).then(res => { console.log("更新被关注者fan列表") })
              console.log("添加关注成功\n")
            }
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
              [changeId]: false
            })
            // 调用服务器接口
            var fan_id = app.globalData.userInfo._openid
            var follow_id = top20userInfo[event.target.dataset.followId]._openid
            const relationCollection = wx.cloud.database().collection("relation")
            relationCollection.where({
              fan: fan_id,
              follow: follow_id
            }).get().then(res => {
              if(res.data.length>0){
                relationCollection.doc(res.data[0]._id).remove({
                  success() { 
                    var fan2follow_list=[]
                    var fan2follow_num
                    userCollection.where({
                      _openid: fan_id
                    }).get().then(res=>{
                      fan2follow_list = res.data.follow_list
                      fan2follow_num = res.data.follow_num
                      var index = fan2follow_list.indexOf(follow_id);
                      if (index > -1) {
                        fan2follow_list.splice(index, 1);
                        fan2follow_num--
                      }
                    })
                    userCollection.where({
                      _openid: fan_id
                    }).update({
                      follow_list: fan2follow_list,
                      follow_num: fan2follow_num
                    }).then(res => { console.log("更新粉丝follow列表") })

                    var follow2fan_list = []
                    var follow2fan_num
                    userCollection.where({
                      _openid: fan_id
                    }).get().then(res => {
                      follow2fan_list = res.data.fan_list
                      follow2fan_num = res.data.fan_num
                      var index = follow2fan_list.indexOf(fan_id);
                      if (index > -1) {
                        follow2fan_list.splice(index, 1);
                        follow2fan_num--
                      }
                    })
                    userCollection.where({
                      _openid: follow_id
                    }).update({
                      fan_list: follow2fan_list,
                      fan_num: follow2fan_num
                    }).then(res => { console.log("更新被关注者fan列表") })
                    console.log("数据库取消关注成功\n") 
                  },
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
    },
    searchInput: function(event){
      // console.log(event.detail.value);
      this.setData({
        searchContent:event.detail.value
      })
    },
    search:function(event){

      var targetUrl = '/pages/search_res/search_res?search=' + this.data.searchContent;
      wx.navigateTo({
        url: targetUrl//实际路径要写全
      })

    }
})
