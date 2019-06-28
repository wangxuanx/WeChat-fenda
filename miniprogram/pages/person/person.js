//feeds.js
//获取应用实例
var app = getApp()
const myaudio = wx.createInnerAudioContext()
myaudio.autoplay = true
Page({
  data: {
    userInfo: {},
    feedList: []
  },
  onLoad: function (options) {
    let _openid = options._openid
    // console.log(this.data)
    let _this = this
    let user = wx.cloud.database().collection('user')
    user.where({
      _openid: _openid
    }).get().then( res => {
      _this.setData({
       userInfo: res.data[0]
     })
      _this.fetchVoiceList()
    })
  },
  toFollow(event) {
    var index = event.currentTarget.id;
    if (this.data.feedList[index]) {
      var followed = this.data.feedList[index].followed;
      if (followed) {
        this.data.feedList[index].followed = false;
      } else {
        this.data.feedList[index].followed = true;
      }
      this.setData({
        feedList: this.data.feedList
      })
    }
  },
  toLike: function (event) {
    var index = event.currentTarget.id;
    if (this.data.feedList[index]) {
      var hasChange = this.data.feedList[index].thumbs;
      if (hasChange !== undefined) {
        var onum = this.data.feedList[index].praise;
        if (hasChange) {
          this.data.feedList[index].praise = (onum - 1);
          this.data.feedList[index].thumbs = false;
        } else {
          this.data.feedList[index].praise = (onum + 1);
          this.data.feedList[index].thumbs = true;
        }
        this.setData({
          feedList: this.data.feedList
        })
      }
    }
  },
  toPerson: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../person/person?master=' + e.target.dataset.master
    })
  },

  lower: function () {
    console.log("到底啦")
    this.fetchVoiceList()
  },

  fetchVoiceList() {
    let _this = this
    wx.cloud.init()
    let voice = wx.cloud.database().collection('my-voice')
    voice.where({
      _openid : _this.data.userInfo._openid
    }).orderBy('date', 'desc').limit(10).get().then(res => {
      console.log(res)
      let feedList = res.data
      _this.setData({
        feedList: feedList
      })
      for (let j = 0; j < feedList.length; j++) {
        let fileID = feedList[j].image
        if (fileID.length) {
          wx.cloud.getTempFileURL({
           fileList: [{
            fileID: fileID,
            maxAge: 60 * 60, 
          }],
          success: res => {
            _this.setData({
              ['feedList['+ j +'].image']: res.fileList[0].tempFileURL
            })
          }
        })
        }
        let audio_file = feedList[j].audio
        if (audio_file.length) {
          wx.cloud.getTempFileURL({
            fileList: [{
              fileID: audio_file,
              maxAge: 60 * 60, 
            }],
            success: res => {
              _this.setData({
                ['feedList['+ j +'].audio']: res.fileList[0].tempFileURL,
                ['feedList['+ j +'].bl']: false
              })
            }
          })
        }
      }
    })
  },
   //音频播放  
  audioPlay: function (e) {
    console.log(e)
    var _this = this
    let index = e.currentTarget.id
    myaudio.src = this.data.feedList[index].audio

    //切换显示状态
    for (let i = 0; i < this.data.feedList.length; i++) {
      this.setData({
        ['feedList['+ i +'].bl']: false
      })
    }
    this.setData({
      ['feedList['+ index +'].bl']: true
    })

    myaudio.play();

    // 开始监听
    myaudio.onPlay(() => {
      console.log('play')
    })

    // 结束监听
    myaudio.onEnded(() => {
      console.log('end')
      _this.setData({
        ['feedList['+ index +'].bl']: false
      })
    })
  },

  // 音频停止
  audioStop: function (e) {
    var that = this
    let index = e.currentTarget.id
    this.setData({
      ['feedList['+ index +'].bl']: false
    })    
    myaudio.stop()
  },

})
