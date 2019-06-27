// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var debugInfo = []

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 添加关注关系
  const relationCollection = cloud.database().collection("relation")
  const userCollection = cloud.database().collection("user")
  const _ = cloud.database().command;

  var fan_id = event.userInfo.openId
  var follow_id = event.top20userInfo[event.followId]._openid
  var follow2fan_id = 0

  debugInfo.push("test debug info")
  await userCollection.where({
    _openid: follow_id
  }).get().then( fdd => {
      debugInfo.push(fdd)
      follow2fan_id = fdd.data[0]._id
  })
  await userCollection.doc(follow2fan_id).update({
    data: {
      fan_list: _.push(fan_id),
      fan_num: _.inc(1)
    },
    success: res => { debugInfo.push(res) }
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    debugInfo,
  }
}