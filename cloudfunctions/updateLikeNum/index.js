// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var debugInfo = []
  const voice_id = event.voice_id
  const is_like = event.is_like
  const like_num = event.like_num
  const voiceCollection = cloud.database().collection("my-voice")

  if(is_like){
    await voiceCollection.doc(voice_id).update({
      data: {
        like_num: like_num + 1
      },
      success: res => { debugInfo.push(res) },
      fail: res => { debugInfo.push(res) }
    })
  }
  else{
    await voiceCollection.doc(voice_id).update({
      data: {
        like_num: like_num - 1
      },
      success: res => { debugInfo.push(res) },
      fail: res => { debugInfo.push(res) }
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