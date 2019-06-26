// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()


  // const userCollection = cloud.database().collection('user')
  // const userInfo = event.userInfo

  // // 获取fan_num前20用户信息
  // try{
  //   userCollection.orderBy('fan_num', 'asc').limit(20).get({
  //     success: res => {
  //       return res.data
  //     }
  //   })
  // } catch(e){
  //   console.error(e)
  // }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}