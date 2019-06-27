// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o){
    if (new RegExp("(" + k + ")").test(fmt)) {
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
}
    }
    return fmt;
}

// let date = db.serverDate().getFullYear()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await upload(event.image, event.audio)
  if (event.text.length || result.image.length || result.audio.length) {
    let voice = cloud.database().collection('my-voice')
    // let db = c.database()
    await voice.add({
      data: {
        text: event.text,
        audio: result.audio,
        image: result.image,
        date: db.serverDate(),
        _openid: wxContext.OPENID
      },
      success: res => {
       event.add = true
     }
   })
  }

  return {
    event
  }
}

async function upload (image, audio) {
  if (image.length) {
    cloudPath = 'images/'+ Date.parse(new Date()) + image.match(/\.[^.]+?$/)[0]
    await cloud.uploadFile({
      cloudPath,
      fileContent: image
    }).then( res => {
      image = res.fileID
    })
  }
  if (audio.length) {
    cloudPath = 'audioes/'+ Date.parse(new Date()) + audio.match(/\.[^.]+?$/)[0]
    await cloud.uploadFile({
      cloudPath: cloudPath,
      fileContent: audio
    }).then( res => {
      audio = res.fileID
    })
  }
  return {
    image,
    audio
  }
}