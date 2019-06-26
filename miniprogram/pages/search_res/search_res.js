// miniprogram/pages/search_res/search_res.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.init();
    var searchContent = options.search;
    var userCollection = wx.cloud.database().collection("user");
    var _this = this;
    
    userCollection.where({
      nickName: searchContent
    }).orderBy('fan_num', 'desc').limit(20).get({
      success: function (res) {
        // 将查询到的结果返回给用户
        _this.data.users = res.data;
      }
    })
    //异步通信
    //console.log(this.data);

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

  }
})