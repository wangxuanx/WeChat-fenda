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

  // 判断用户是否存在
  const result = await userCollection.where({
    openid: OPENID,
  })
  if(result.count().total==0)
  {
    // 不存在则添加用户
    userCollection.add({
      data: {
        avatarUrl: userInfo.avatarUrl,
        fan_list: [],
        follow_list: [],
        nickName: userInfo.nickName,
        openid: OPENID
      }, success: res => {
        console.log(res)
      }, fail: err => {
        console.log(err)
      }
    })
  }

  return {
    event,
    openid: OPENID,
    appid: APPID,
    unionid: UNIONID,
  }
}