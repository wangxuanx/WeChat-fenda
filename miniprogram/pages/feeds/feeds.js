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
    length:0,
    comment: '测试',
    comment_index: 0
  },

  onShow: function() {
    this.fetchVoiceList()
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
            })
          }
          let fileId = feedList[i].audio
          if (fileId.length) {
            wx.cloud.getTempFileURL({
            fileList: [{
              fileID: fileId,
              maxAge: 60 * 60, 
            }]
          }).then(res => {
              // feedList[i].audio = res.tempFilePath
              _this.setData({
                ['feedList['+ length +'].audio']: res.fileList[0].tempFileURL,
                ['feedList['+ length +'].bl']: false
              })
            })
        }
      }
      _this.setData({
        feedList: _this.data.feedList.concat(feedList),
        count: res.result.event.count,
        onloading: false
      })
      this.fetchLike()

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

  fetchLike(){
    // 获取点赞关系
    let _this = this
    let feedList = _this.data.feedList
    const likeCollection = wx.cloud.database().collection("like-relation")
    const voiceCollection = wx.cloud.database().collection("my-voice")
    
    var user_id = app.globalData.userInfo._openid
    console.log(feedList)
    for(let idx in feedList){
      // console.log(feedList[idx])
      var voice_id = feedList[idx]._id
      likeCollection.where({
        _userid: user_id,
        _voiceid: voice_id
      }).get({
        success: res => {
          console.log(res)
          var changeId = 'feedList[' + idx + '].is_like';
          if(res.data.length>0){
            // 已点赞
            _this.setData({
              [changeId]: true
            })
          }
          else{
            // 未点赞
            _this.setData({
              [changeId]: false
            })
          }
        },
        fail: res => { console.log(res)}
      })
      voiceCollection.where({
        _id: voice_id
      }).get({
        success: res => {
          let like_num = res.data[0].like_num
          console.log(typeof (like_num))
          _this.setData({
            ['feedList[' + idx + '].like_num']: like_num
          })
        }
      })
    }

  },

  toLike: function (event) {
    console.log(event)
    wx.cloud.init()
    var _this = this
    var index = event.currentTarget.id;
    var user_id = app.globalData.userInfo._openid
    var voice_id = _this.data.feedList[index]._id
    const likeCollection = wx.cloud.database().collection("like-relation")
    const voiceCollection = wx.cloud.database().collection("my-voice")

    if(_this.data.feedList[index].is_like){
      // 取消点赞
      console.log("取消点赞")
      // console.log(typeof (_this.data.feedList[index].like_num))
      _this.setData({
        ['feedList[' + index + '].is_like']: false,
        ['feedList[' + index + '].like_num']: _this.data.feedList[index].like_num-1
      })
      // 修改like表点赞关系
      likeCollection.where({
        _userid: user_id,
        _voiceid: voice_id
      }).get({
        success: res => {
          likeCollection.doc(res.data[0]._id).remove({
            success: res => { console.log(res) },
            fail: res => { console.log(res) }
          })
        }
      })
        
      // 修改voice表点赞数
      voiceCollection.where({
        _id: voice_id
      }).get({
        success: res => {
          var like_num = res.data[0].like_num
          wx.cloud.callFunction({ // 被取消点赞voice点赞数-1
            name: 'updateLikeNum',
            data: {
              voice_id: voice_id,
              is_like: false,
              like_num: like_num
            },
            success: res => { console.log(res) }
          })
        }
      })
      // console.log(typeof(like_num))

      
    }
    else{
      // 点亮点赞
      console.log("点亮点赞")
      _this.setData({
        ['feedList[' + index + '].is_like']: true,
        ['feedList[' + index + '].like_num']: _this.data.feedList[index].like_num+1
      })
      // 修改like表点赞关系
      likeCollection.add({
        data: {
          _userid: user_id,
          _voiceid: voice_id
        },
        success: res => { console.log(res) },
        fail: res => { console.log(res) }
      })
      // 修改voice表点赞数
      voiceCollection.where({
        _id: voice_id
      }).get({
        success: res => {
          var like_num = res.data[0].like_num
          console.log(typeof (like_num))
          wx.cloud.callFunction({ // 被点赞voice点赞数+1
            name: 'updateLikeNum',
            data: {
              voice_id: voice_id,
              is_like: true,
              like_num: like_num
            },
            success: res => { console.log(res) }
          })
        }
      })
      
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
 toComment: function (e) {

  },

  submitComment: function (e) {
    console.log(e)
    this.setData({
      comment_index: e.currentTarget.id
    })
    this.data.feedList[this.data.comment_index].comment.comment_list.push({
      nickName: app.globalData.userInfo.nickName,
      content: this.data.comment
    })
    this.data.feedList[this.data.comment_index].comment.comment_num++
     console.log(this.data.feedList[this.data.comment_index].comment.comment_list)
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'upDateComment',
      data: {
        _id: this.data.feedList[this.data.comment_index]._id,
        comment: this.data.feedList[this.data.comment_index].comment
      },
      success: res=> {console.log(res)},
      fail: res => {console.log(res)},
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
