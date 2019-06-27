//feeds.js
//获取应用实例
var app = getApp()
const myaudio = wx.createInnerAudioContext()
myaudio.autoplay = true
Page({
  data: { 
    onloading: false,
    feedList: [],
    followList: [],
    count: 0,
    length:0
  },
  onload: function() {
    this.lisentPlay()
  },
  onShow: function() {
    this.fetchVoiceList();
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.setData({
      count: 0,
      feedList: []
    })
    console.log(this.data)
    this.fetchVoiceList()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000)
  },
  onReachBottom: function() {
    console.log('bottom')
    this.fetchVoiceList()
    this.setData({
      onloading: true
    })
  },
  fetchVoiceList () {
    console.log('voice')
    let _this = this
    this.setData({
      length: this.data.feedList.length
    })
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'getVoice',
      data: {
        count: _this.data.count
      },
      success: res => {
        // console.log(res)
        let feedList = res.result.feedList
        for (let i = 0; i < feedList.length; i++) {
          let length = _this.data.length + i
          let image_file = feedList[i].image
          // console.log(fileId)
          if (image_file.length) {
            wx.cloud.getTempFileURL({
              fileList: [{
                fileID: image_file,
                maxAge: 60 * 60, 
              }]
            }).then(res => {
              // console.log(res.fileList)
               _this.setData({
                ['feedList['+ length +'].image']: res.fileList[0].tempFileURL
              })
            }).catch(error => {
  // handle error
})
          //   wx.cloud.downloadFile({
          //     fileID: image_file
          //     success: res => {
          //     // console.log(res)
          //     _this.setData({
          //       ['feedList['+ length +'].image']: res.tempFilePath
          //     })
          //   }
          // })
          }
          let fileId = feedList[i].audio
          if (fileId.length) {
           wx.cloud.downloadFile({
            fileID: fileId,
            success: res => {
              feedList[i].audio = res.tempFilePath
              _this.setData({
                ['feedList['+ length +'].audio']: res.tempFilePath,
                ['feedList['+ length +'].bl']: false
              })
            }
          })
         }
       }

     //   for (let i = 0; i < feedList.length; i++) {
     //    let fileId = feedList[i].audio
     //    if (fileId.length) {
     //     wx.cloud.downloadFile({
     //      fileID: fileId,
     //      success: res => {
     //        feedList[i].audio = res.tempFilePath
     //        _this.setData({
     //          ['feedList['+_this.data.length + i +'].audio']: res.tempFilePath,
     //          ['feedList['+_this.data.length + i +'].bl']: false
     //        })
     //      }
     //    })
     //   }
     // }
     _this.setData({
      feedList: _this.data.feedList.concat(feedList),
      count: res.result.event.count,
      onloading: false
    })
   },
   fail: error => {
    console.log(error)
  }
})
  },
  toFollow(event){
    var index = event.currentTarget.id;
    console.log(index);
    if (this.data.feedList[index]) {
      var followed = this.data.feedList[index].followed;
      if(followed){
        this.data.feedList[index].followed = false;
      }else{
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
       if(hasChange) {
         this.data.feedList[index].praise = (onum - 1);
         this.data.feedList[index].thumbs = false;
       }else {
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

upper: function () {

},

lower: function () {
  this.fetchVoiceList()
  this.setData({
    onloading: true
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
      // _this.setData({
      //   ['feedList['+ index +'].bl']: true
      // })
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
    //切换显示状态

    this.setData({
      ['feedList['+ index +'].bl']: false
    })    
    myaudio.stop();
  },
  // lisentPlay() {
  //   myaudio.onPlay(() => {
  //     console.log('play')
  //   })
  //   myaudio.onEnded(() => {
  //     console.log('end')
  //     _this.setData({
  //       ['feedList[' + index + '].bl']: false
  //     })
  //   })
  // }
})
