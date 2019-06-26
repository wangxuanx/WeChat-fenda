// miniprogram/pages/mine/myhear/myhear.js
let app = getApp()
let userFollow
/*需要展示follow_list中的信息,
  登录用户的收听。
 */
Page({
  data: {
    userInfo: {},
    hotMasters: []            //需要显示的数据数组
  },

  onLoad: function () {         //获取登录用户的信息

    wx.cloud.init()
    let _this = this
    const userCollection = wx.cloud.database().collection("user")
    const relationCollection = wx.cloud.database().collection("relation")
    const _ = wx.cloud.database().command;

    // 获取fan_num前20用户信息
    userCollection.orderBy('fan_num', 'follow_list').where({
      _openid: _.neq(app.globalData.userInfo._openid)  
    }).get({
      success: res => {
        console.log(res)
        _this.setData({
          hotMasters: res.data
        })
        userFollow = res.data
        console.log(userFollow)

        // 获取关注关系
        var fan_id = app.globalData.userInfo._openid
        console.log(fan_id)
        for (let rk in userFollow) {
          //console.log(rk)
          var follow_id = userFollow[rk]._openid
          relationCollection.where({
            fan: fan_id,
            follow: follow_id,
          }).get().then(fd => {
            var changeId = 'hotMasters[' + rk + '].if_follow';
            if (fd.data.length > 0) {
              this.setData({
                [changeId]: true
              })
              userFollow[rk].if_follow = true;
              //console.log("已关注\n")
            }
            else {
              this.setData({
                [changeId]: false
              })
              userFollow[rk].if_follow = false;
              //console.log("未关注\n")
            }
          })
        }
      }
    })
  },

  //跳转函数 跳转到用户的主页
  toPerson: function (event) {
    var targetUrl = '/pages/person/person?id=' + event.currentTarget.dataset.userId;
    console.log(event);
    wx.navigateTo({
      url: targetUrl//实际路径要写全
    })
  },

  //设置关注关系
  handleFollowTap: function (event) {
    console.log(event)
    var changeId = 'hotMasters[' + event.target.dataset.followId + '].if_follow';
    this.setData({
      [changeId]: true
    })
    // 添加关注关系
    const relationCollection = wx.cloud.database().collection("relation")
    var fan_id = app.globalData.userInfo._openid
    var follow_id = userFollow[event.currentTarget.dataset.followId]._openid
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
          success() { console.log("添加关注成功\n") }
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
          var changeId = 'hotMasters[' + event.target.dataset.followId + '].if_follow';
          _this.setData({
            [changeId]: false
          })
          // 调用服务器接口
          var fan_id = app.globalData.userInfo._openid
          var follow_id = userFollow[event.target.dataset.followId]._openid
          const relationCollection = wx.cloud.database().collection("relation")
          relationCollection.where({
            fan: fan_id,
            follow: follow_id
          }).get().then(res => {
            if (res.data.length > 0) {
              relationCollection.doc(res.data[0]._id).remove({
                success() { console.log("数据库取消关注成功\n") },
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
  }
})