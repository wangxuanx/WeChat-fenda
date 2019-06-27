// miniprogram/pages/search_res/search_res.js
let app = getApp()
let top20userInfo
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.init();
    
    var searchContent = options.search;
    
    var userCollection = wx.cloud.database().collection("user");
    var relationCollection = wx.cloud.database().collection("relation")
    var _this = this;
    const _ = wx.cloud.database().command;

    //模糊正则
    
    var matchRe = '.*' + searchContent + '.*';
    
    
    userCollection.where({
      _openid: _.neq(app.globalData.userInfo._openid),
      nickName: {
        $regex:matchRe,
        $options:'i'
      }
    }).orderBy('fan_num', 'desc').limit(20).get({
      success:function(res){
        _this.setData({
          users:res.data
        })

        top20userInfo = _this.data.users;
        // 获取关注关系
        var fan_id = app.globalData.userInfo._openid;
        
        for (let rk in top20userInfo) {
          // console.log(top20userInfo[rk])
          var follow_id = top20userInfo[rk]._openid
          relationCollection.where({
            fan: fan_id,
            follow: follow_id,
          }).get().then(fd => {
            var changeId = 'users[' + rk + '].if_follow';
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
    //异步通信
    //console.log(this.data)
  },
  handleFollowTap: function (event) {
    // console.log(event)
    this.setData({
      ['users[' + event.target.dataset.followId + '].if_follow']: true,
      ['users[' + event.target.dataset.followId + '].fan_num']: this.data.users[event.target.dataset.followId].fan_num + 1
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
    const relationCollection = wx.cloud.database().collection("relation")
    const userCollection = wx.cloud.database().collection("user")

    wx.showModal({
      content: '确定要取消关注 ' + event.target.dataset.followName + ' 吗？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定');
          _this.setData({
            ['users[' + event.target.dataset.followId + '].if_follow']: false,
            ['users[' + event.target.dataset.followId + '].fan_num']: _this.data.users[event.target.dataset.followId].fan_num - 1
          })
          // 调用服务器接口
          var fan_id = app.globalData.userInfo._openid
          var follow_id = top20userInfo[event.target.dataset.followId]._openid

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //跳转函数
  toPerson: function (event) {
    var targetUrl = '/pages/person/person?id=' + event.currentTarget.dataset.userId;
    console.log(event);
    wx.navigateTo({
      url: targetUrl//实际路径要写全
    })
  },
})