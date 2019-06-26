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
  // const postCollection = cloud.database().collection('my-voice')

  // // 添加新的post到数据库
  // postCollection.add({
  //   data: {
  //     audio: event.audio,
  //     comment: {
  //       comment_list: [],
  //       comment_num: 0,
  //       like_num: 0
  //     },
  //     date: Date(),
  //     image_group: [],
  //     like: 0,
  //     openid: OPENID,
  //     text: event.text
  //   }, success: res => {
  //     console.log(res)
  //   }, fail: err => {
  //     console.log(err)
  //   }
  // })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}