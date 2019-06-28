// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const voiceCollection = cloud.database().collection("voice-test");

  try {
    return await voiceCollection.where({
      _openid : "123"
    }).remove()
  } catch (e) {
    console.error(e)
  }
}