// miniprogram/pages/edit/edit.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  /**
   * 页面的初始数据
   */
   data: {
    image: '',
    text: '',
    audio: '',
    setInter: '',
    num: 0,
    tempFilePath: '',
    isHidePlaceholder: false,
  },

  toSubmit() {
    wx.cloud.init()
    let _this = this
    let image = this.data.image, audio = this.data.audio
    if (this.data.text.length || image.length || audio.length) {
      let voice = wx.cloud.database().collection('my-voice')
      let db = wx.cloud.database()
      if (image.length) {
        let cloudPath = 'images/'+ Date.parse(new Date()) + image.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: image
        }).then( res => {
          // console.log(res)
          image = res.fileID
          if (audio.length) {
            let cloudPath = 'audioes/'+ Date.parse(new Date()) + audio.match(/\.[^.]+?$/)[0]
            wx.cloud.uploadFile({
              cloudPath: cloudPath,
              filePath: audio
            }).then( res => {
              // console.log(res)
              audio = res.fileID
              voice.add({
                data: {
                  text: _this.data.text,
                  audio: audio,
                  image: image,
                  date: db.serverDate(),
                },
                success: res => {
                 // console.log(res)
                 wx.navigateBack({
                  delta: 1
                })
               }
             })
            })
          } else {
            voice.add({
              data: {
                text: _this.data.text,
                audio: audio,
                image: image,
                date: db.serverDate(),
              },
              success: res => {
                 // console.log(res)
                 wx.navigateBack({
                  delta: 1
                })
               }
             })
          }   
        })
      } else if (audio.length) {
        let cloudPath = 'audioes/'+ Date.parse(new Date()) + audio.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: audio
        }).then( res => {
          // console.log(res)
          audio = res.fileID
          voice.add({
            data: {
              text: _this.data.text,
              audio: audio,
              image: image,
              date: db.serverDate(),
            },
            success: res => {
                 // console.log(res)
                 wx.navigateBack({
                  delta: 1
                })
               }
             })
        })
      }

    }
  },
  upLoadImage() {
    var that = this
    wx.chooseImage({
      success: function(res) {
        console.log(res)
        count: 1;
        that.setData({
          image: res.tempFilePaths[0],
        })
      },
    })
  },
  start: function () {
    //开始录音
    var options = {
      duration: 1000000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    recorderManager.start(options);
    var that = this
    if(this.data.num!=0) {
      clearInterval(this.data.setInter)
      this.setData({
        num: 0
      })
      recorderManager.stop();
      recorderManager.onStop((res) => {
        console.log('重新录音', res.tempFilePath)
      })
    }
    this.setData({
      setInter: setInterval(
        function () {
          var numVal = that.data.num + 1
          that.setData({
            num: numVal
          })
        } , 1000)
    })
    recorderManager.onStart(() => {
      console.log('recorder start');
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  stop: function () {
    recorderManager.stop();
    let _this = this
    recorderManager.onStop((res) => {
      console.log('停止录音', res.tempFilePath)
      clearInterval(this.data.setInter)
      _this.setData({
        audio: res.tempFilePath
      })
    })
  },
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.audio,
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  inputedit(e) {
    this.setData({
      text: e.detail.value
    })
  }
})