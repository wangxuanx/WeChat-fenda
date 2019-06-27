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
    console.log(event)
    var changeId = 'users[' + event.target.dataset.followId + '].if_follow';
    this.setData({
      [changeId]: true
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
          success() {
            userCollection.where({
              _openid: fan_id
            }).update({
              follow_list: _.push(follow_id),
              follow_num: _.inc(1)
            }).then(res => { console.log("更新粉丝follow列表") })
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
      else { console.log("已存在关注关系\n") }
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
          var changeId = 'users[' + event.target.dataset.followId + '].if_follow';
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
            if (res.data.length > 0) {
              relationCollection.doc(res.data[0]._id).remove({
                success() {
                  var fan2follow_list = []
                  var fan2follow_num
                  userCollection.where({
                    _openid: fan_id
                  }).get().then(res => {
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
            else {
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