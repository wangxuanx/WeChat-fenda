// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()


// let date = db.serverDate().getFullYear()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const voice = cloud.database().collection('my-voice')
  await voice.where({
    _id: event._id
  })
  .update({
    data: {
      comment: event.comment
    },
    success: res => {
      return res
    }
  })

  return {
    event
  }
}