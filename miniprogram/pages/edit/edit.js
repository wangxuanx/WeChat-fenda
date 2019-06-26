// miniprogram/pages/edit/edit.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    image: '',
    text: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  inputText(e) {
    console.log(e)
    this.setData({
      text: e.detail.value
    })
  },

  toSubmit() {
    wx.cloud.init()
    let _this = this
    let path = this.data.image
    let voice = wx.cloud.database().collection('my-voice')
    let fileID = ''
    if (path.length) {
      console.log('in')
      let timestamp = Date.parse(new Date());
      const cloudPath = 'images' + timestamp + path.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath: path, // 文件路径
      }).then(res => {
        // get resource ID
        console.log(res.fileID)
        voice.add({
          data: {
            date: wx.cloud.database().serverDate(),
            image: res.fileID,
            text: _this.data.text
          },
          success: res => {
            console.log(res)
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }).catch(error => {
        console.log(error)
        // handle error
      })
    } else {
      voice.add({
        data: {
          date: wx.cloud.database().serverDate(),
          text: _this.data.text
        },
        success: res => {
          console.log(res)
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },

  upLoadImage() {
    var that = this
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        count: 9;
        that.setData({
          image: res.tempFilePaths[0],
        })
      },
    })
  },

  start: function () {
    //开始录音
    var options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    recorderManager.start(options);
    var that = this
    that.data.setInter = setInterval(
      function () {
        var numVal = that.data.num + 1;
        that.setData({
          num: numVal
        });
      }
      , 1000)
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
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      clearInterval(this.data.setInter)
      this.setData({
        tempFilePath: res
      })
      console.log(this.data.tempFilePath)
    })
  },
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
})