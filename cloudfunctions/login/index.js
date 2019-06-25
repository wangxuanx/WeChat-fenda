// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID,
    ENV,
  } = cloud.getWXContext()
  const userCollection = cloud.database().collection('user')
  const userInfo = event.userInfo
  var debugInfo = []

  // 判断用户是否存在
  userCollection.where({
    _openid: OPENID
  }).get().then(res => {
      debugInfo.push("get success\n")
      if (res.data.length == 0) {
        debugInfo.push("New user, add into db.\n")
        // 不存在则添加用户
        userCollection.add({
          data: {
            avatarUrl: userInfo.avatarUrl,
            desc: "写点东西介绍自己吧！",
            fan_list: [],
            fan_num: 0,
            follow_list: [],
            follow_num: 0,
            nickName: userInfo.nickName,
          }, success: res => {
            debugInfo.push("add success\n")
          }, fail: err => {
            debugInfo.push("add fail\n")
          }
        })
      }
    }
  )

  return {
    event,
    openid: OPENID,
    appid: APPID,
    unionid: UNIONID,
    debugInfo
  }
}