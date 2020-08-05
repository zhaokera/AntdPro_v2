export default {
  namespace: 'excelleadin',
  state: {
    data: [
      {
        key: 1,
        leadin_time: "2019/7/12 17:34",
        totle: 200,
        success: 200,
        error: 0,
        filename: "文件名",
        state: "success",
      }, {
        key: 2,
        leadin_time: "2019/7/12 17:34",
        totle: 200,
        success: 100,
        error: 100,
        filename: "文件名2",
        state: "warning",
      }, {
        key: 3,
        leadin_time: "2019/7/12 17:34",
        totle: 200,
        success: 0,
        error: 200,
        filename: "文件名3",
        state: "error",
      }, {
        key: 4,
        leadin_time: "2019/7/12 17:34",
        totle: 200,
        success: 0,
        error: 0,
        filename: "文件名4",
        state: "loading",
      }
    ],
  },

  effects: {

  },

  reducers: {

  },
};
