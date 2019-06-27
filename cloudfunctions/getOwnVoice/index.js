// 云函数入口文件
const cloud = require('wx-server-sdk')
var result = 1;
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const voiceCollection = cloud.database().collection("my-voice")
  var openid = "ofvEv5TOeVhW8GvN10ZhC_llfO0Y";
 
  return await voiceCollection
    .where({
      _openid: 'ofvEv5TOeVhW8GvN10ZhC_llfO0Y', // 填入当前用户 openid
    }).skip(0).limit(10).get();
}