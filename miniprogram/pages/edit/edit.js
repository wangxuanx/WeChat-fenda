// miniprogram/pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  toSubmit() {
    // let cp = 
    console.log('submit')
    wx.cloud.init()
    let path = this.data.images[0]
    let timestamp = Date.parse(new Date());
    const cloudPath = 'images'+timestamp + path.match(/\.[^.]+?$/)[0]
    let fileID = ''
    wx.cloud.uploadFile({
      cloudPath,
      filePath: path, // 文件路径
    }).then(res => {
      // get resource ID
      console.log(res.fileID)
      fileID = res.fileID
      wx.navigateBack({
        delta: 1
      })
    }).catch(error => {
      console.log(error)
      // handle error
    })
    let voice = wx.cloud.database().collection('my-voice')
    voice.add({
      data: {
        date: wx.cloud.database().serverDate(),
        image_group:[fileID],
        text: this.data.text
      },
      success: res => {
        console.log(res)
        wx.navigateBack({
        delta: 1
      })
      }
    })
  },

  upLoadImages() {
    var that = this
    wx.chooseImage({
      success: function(res) {
        console.log(res)
        count: 9;
        console.log(res.tempFilePaths)
        that.setData({
          images: res.tempFilePaths,
        })
      },
    })
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
})