let app = getApp()
let top20userInfo

var toast = require('../../utils/toast/toast.js');

Page({
    data: {
        hotMasters: [],
        searchContent: ""
    },

  onLoad: function () {
    wx.cloud.init()
    let _this = this
    const userCollection = wx.cloud.database().collection("user")
    const relationCollection = wx.cloud.database().collection("relation")
    const _ = wx.cloud.database().command;

    // 获取fan_num前20用户信息
    userCollection.orderBy('fan_num', 'desc').where({
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
        for (let rk in top20userInfo) {
          // console.log(rk)
          var follow_id = top20userInfo[rk]._openid
          relationCollection.where({
            fan: fan_id,
            follow: follow_id,
          }).get().then(fd => {
            var changeId = 'hotMasters[' + rk + '].if_follow';
            if (fd.data.length > 0) {
              _this.setData({
                [changeId]: true
              })
              top20userInfo[rk].if_follow = true;
              console.log("已关注\n")
            }
            else {
              _this.setData({
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
  toPerson: function (event) {
    let _openid = this.data.hotMasters[event.currentTarget.dataset.index]._openid
    var targetUrl = '/pages/person/person?_openid=' + _openid;
    console.log(event);
    wx.navigateTo({
      url: targetUrl//实际路径要写全
    })
  },

  handleFollowTap: function (event) {
    // console.log(event)
    this.setData({
      ['hotMasters[' + event.target.dataset.followId + '].if_follow']: true,
      ['hotMasters[' + event.target.dataset.followId + '].fan_num']: this.data.hotMasters[event.target.dataset.followId].fan_num+1
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
      if (res.data.length == 0) {
        relationCollection.add({
          data: {
            fan: fan_id,
            follow: follow_id
          },
          success: res => {
            console.log(res)
            userCollection.where({
              _openid: fan_id
            }).get().then(fd => {
              userCollection.doc(fd.data[0]._id).update({
                data: {
                  follow_list: _.push(follow_id),
                  follow_num: _.inc(1)
                },
                success: res => { // 用户follow列表更新成功
                  console.log(res)
                  wx.cloud.callFunction({ // 更新被关注则fan列表
                    name: 'updateFanList',
                    data: {
                      userInfo: app.globalData.userInfo,
                      follow_id: top20userInfo[event.currentTarget.dataset.followId]._openid
                    },
                    success: res => { console.log(res) }
                  })
                }
              })
            })
          }
        })
      }
    })
  },

  handleNotFollowTap: function (event) {
    // console.log("handle not follow");
    // 注意需要调动后端接口
    var _this = this;
    var _event = event;
    wx.showModal({
      content: '确定要取消关注 ' + event.target.dataset.followName + ' 吗？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定');
          _this.setData({
            ['hotMasters[' + event.target.dataset.followId + '].if_follow']: false,
            ['hotMasters[' + event.target.dataset.followId + '].fan_num']: _this.data.hotMasters[event.target.dataset.followId].fan_num - 1
          })
          // 调用服务器接口
          var fan_id = app.globalData.userInfo._openid
          var follow_id = top20userInfo[event.target.dataset.followId]._openid
          const relationCollection = wx.cloud.database().collection("relation")
          const userCollection = wx.cloud.database().collection("user")

          relationCollection.where({
            fan: fan_id,
            follow: follow_id
          }).get().then(res => {
            if (res.data.length > 0) {
              relationCollection.doc(res.data[0]._id).remove({
                success() {
                  console.log("删除relation记录成功")
                  var fan2follow_list = []
                  var fan2follow_num = 0
                  var fan2follow_id = 0
                  userCollection.where({
                    _openid: fan_id
                  }).get({
                    success: fd => {
                      fan2follow_id = fd.data[0]._id
                      fan2follow_list = fd.data[0].follow_list
                      fan2follow_num = fd.data[0].follow_num
                      var index = fan2follow_list.indexOf(follow_id);
                      if (index > -1) {
                        fan2follow_list.splice(index, 1);
                        fan2follow_num--
                        userCollection.doc(fan2follow_id).update({
                          data: {
                            follow_list: fan2follow_list,
                            follow_num: fan2follow_num
                          },
                          success() { // 更新用户follow列表成功
                            console.log("更新粉丝follow列表")
                            wx.cloud.callFunction({ // 更新被关注则fan列表
                              name: 'updateFollowList',
                              data: {
                                userInfo: app.globalData.userInfo,
                                follow_id: top20userInfo[event.currentTarget.dataset.followId]._openid
                              },
                              success: res => { console.log(res) }
                            })
                          }
                        })
                      }
                    },
                    fail: res => { console.log(res) }
                  })
                },
                fail() { console.log("数据库关注关系删除失败") }
              })
            }
            else {
              console.log("不存在关注关系")
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
      var content = this.data.searchContent.replace(/\s+/g, "");
      if(content.length == 0){
        toast.showToast(this, "请输入正确的信息！", 700, true);
        return;
      }
      var targetUrl = '/pages/search_res/search_res?search=' + content;
      wx.navigateTo({
        url: targetUrl//实际路径要写全
      })

    }
})
