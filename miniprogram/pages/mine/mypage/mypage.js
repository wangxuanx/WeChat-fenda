
//获取应用实例
var app = getApp()
const myaudio = wx.createInnerAudioContext()
myaudio.autoplay = true
var shipLength = 0;
Page({
  data: {
    hidden: true,
    feedList: [],
    userInfo: null
  },
  onLoad: function(){
    wx.cloud.init()
    var _this = this;
    let userid = app.globalData.userInfo._openid;
    let user = wx.cloud.database().collection('user')
    user.where({
      _openid: userid
    }).get().then(res => {
      _this.setData({
        userInfo: res.data[0]
      })
      console.log(res)
    })
    this.fetchVoiceList();
    console.log(this.data.feedList);
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onPullDownRefresh: function () {
    var _this = this;
    console.log("用户下拉")
    wx.showNavigationBarLoading()
    shipLength = 0;
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      _this.setData({
        feedList: []
      })
      _this.fetchVoiceList();
    }, 1000);
  },
  
  lower: function () {
    console.log("到底啦")
    this.fetchVoiceList()
  },

  fetchVoiceList: function() {
    let _this = this
    let voice = wx.cloud.database().collection('my-voice')
    let userid = app.globalData.userInfo._openid;
    voice.where({
      _openid:userid
    }).skip(shipLength*10).limit(10).get().then(res => {
      let feedList = _this.data.feedList
      let select_list = res.data;
      //console.log(res.data);
      for (let i = 0; i < select_list.length; i++) {
        let fileId = select_list[i].image;
        let audioFile =select_list[i].audio;
        if (fileId) {
          console.log(fileId)
          wx.cloud.getTempFileURL({
            fileList: [{
              fileID: fileId,
              maxAge: 60 * 60,
            }]
          }).then(res => {
            // console.log(res.fileList)
            // _this.setData({
            //   ['feedList[' + i + '].image']: res.fileList[0].tempFileURL
            // })
            select_list[i].image = res.fileList[0].tempFileURL;
          })
        }
        if (audioFile) {
          wx.cloud.downloadFile({
            fileID: audioFile,
            success: res => {
              // feedList[i].audio = res.tempFilePath
              // _this.setData({
              //   ['feedList[' + length + '].audio']: res.tempFilePath,
              //   ['feedList[' + length + '].bl']: false
              // })
              select_list[i].audio = res.tempFilePath;
              select_list[i].bl = false;
            }
          })
        }
      }
      //下次跳过读取
      shipLength +=1;
      feedList = feedList.concat(select_list)
      //console.log(feedList)
      _this.setData({
        feedList: feedList
      })
    })
  },
  toPerson: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../person/person?master=' + e.target.dataset.master
    })
  },
  upper: function () {

  },
  lower: function () {
    console.log("到底啦")
    this.fetchVoiceList()
  },
  requestFlag: false,
  getFeeds: function () {
    var that = this
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
        ['feedList[' + i + '].bl']: false
      })
    }
    this.setData({
      ['feedList[' + index + '].bl']: true
    })

    myaudio.play();

    // 开始监听
    myaudio.onPlay(() => {
      console.log('play')
      // _this.setData({
      //   ['feedList['+ index +'].bl']: true
      // })
    })

    // 结束监听
    myaudio.onEnded(() => {
      console.log('end')
      _this.setData({
        ['feedList[' + index + '].bl']: false
      })
    })

  },

  // 音频停止
  audioStop: function (e) {
    var that = this
    let index = e.currentTarget.id
    //切换显示状态

    this.setData({
      ['feedList[' + index + '].bl']: false
    })
    myaudio.stop();
  },
})
