// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const user = cloud.database().collection('user')
const voice = cloud.database().collection('my-voice')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let feedList = []
  let follow_list = [], select_list = []

  await user.where({
    _openid: wxContext.OPENID
  }).get().then(res => {
    follow_list = res.data[0].follow_list
  })
  
  while (feedList.length < 10) {
    res = await getFeeds(wxContext.OPENID, follow_list, feedList, event.count)
    feedList = res.feedList
    event.count = res.count
    if (res.select_list.length < 9) break;
  }

  return {
    feedList,
    event
  }
}

async function getFeeds (openid, follow_list , feedList, count) {
  let select_list = []
  await voice.skip(count).orderBy('date', 'desc').limit(10).get().then(res => {
    select_list = res.data
  })
  for (let j = 0; j < select_list.length; j++) {
    count++
    if (follow_list.includes(select_list[j]._openid) || select_list[j]._openid == openid) {
     await user.where({
      _openid: select_list[j]._openid
    }).get().then(res => {
      select_list[j].userInfo = res.data[0]
      feedList.push(select_list[j])
    })
  }
}
// for (let i = 0; i < feedList.length; i++) {
//   let fileId = feedList[i].image
//   if (fileId.length) {
//    await cloud.downloadFile({
//     fileID: fileId,
//     success: res => {
//       feedList[i].image = res
//     }
//   })
//  }
// }
//  for (let i = 0; i < feedList.length; i++) {
//   let fileId = feedList[i].audio
//   if (fileId.length) {
//     await cloud.downloadFile({
//     fileID: fileId,
//   }).then( res => {
//       feedList[i].audio = res
//  })
// }
 // }
return {
  feedList,
  select_list,
  count
}
}