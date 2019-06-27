// miniprogram/pages/edit/edit.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    setInter: '',
    num: 0,
    tempFilePath: '',
    isHidePlaceholder: false,
    inputdata: "",
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toSubmit() {
    wx.navigateBack({
      delta: 1
    })
  },
  upLoadImage() {
    var that = this
    console.log(this.data.inputdata)
    wx.chooseImage({
      success: function(res) {
        console.log(res)
        count: 1;
        console.log(res.tempFilePaths)
        that.setData({
          images: res.tempFilePaths,
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
      this.data.num = 0
      recorderManager.stop();
      recorderManager.onStop((res) => {
        console.log('重新录音', res.tempFilePath)
        clearInterval(this.data.setInter)
    })
    } 
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
  // textarea 输入时触发
  getTextareaInput: function (e) {
    var that = this;
    if (e.detail.cursor > 0) {
      that.setData({
        isHidePlaceholder: true
      })
    } else {
      that.setData({
        isHidePlaceholder: false
      })
    }
  },
  inputedit(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  }
})