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
    wx.cloud.callFunction({
      name: 'upLoadVoice',
      data: {
        image: _this.data.image,
        text: _this.data.text,
        audio: _this.data.audio
      },
      success: res => {
        wx.navigateBack({
          delta: 1
        })
      }, 
      fail: res => {
        console.log(res)
      }
    })
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
    recorderManager.onStop((res) => {
      console.log('停止录音', res.tempFilePath)
      clearInterval(this.data.setInter)
      this.setData({
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