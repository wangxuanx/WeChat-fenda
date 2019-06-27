// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var debugInfo = []

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const userCollection = cloud.database().collection("user")
  const _ = cloud.database().command;

  var follow2fan_list = []
  var follow2fan_num = 0
  var follow2fan_id = 0
  var fan_id = event.userInfo.openId
  var follow_id = event.follow_id
  var index = 0

  /*从follow_id的fan列表中删除fan_id */

  await userCollection.where({
    _openid: follow_id
  }).get().then(fd => {
    debugInfo.push(fd)
    follow2fan_id = fd.data[0]._id
    follow2fan_list = fd.data[0].fan_list
    follow2fan_num = fd.data[0].fan_num
    index = follow2fan_list.indexOf(fan_id);
  })

  if (index > -1) {
    follow2fan_list.splice(index, 1);
    follow2fan_num--
    await userCollection.doc(follow2fan_id).update({
      data: {
        fan_list: follow2fan_list,
        fan_num: follow2fan_num
      },
      success: res => { debugInfo.push(res)}
    })
  }


  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    debugInfo
  }
}