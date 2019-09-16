
function get(that, url, solve) {
  that.$http
    .get(url)
    .then((res) => {
      // console.log(res)
      const { errno, data } = res.data;
      if (errno === 0) {
        solve(data);
      }
    })
    .catch(() => { });
}

function post(that, url, data, solve) {
  that.$http
    .post(url, data)
    .then((res) => {
      const { errno, data } = res.data;
      if (errno === 0) {
        // this.$message({
        //   type: 'success',
        //   message: '保存成功'
        // });
        // console.log('save udx ok');
        // 外部回调来处理


        solve(data);

        // this.$router.push('/console/data');
        // this.editChart(data._id);
      }else if (errno === 1){
           solve(data)
      }
    })
    .catch(() => { });
}


function put(that, url, json_data, solve) {
  that.$http
    .put(url, json_data)
    .then((res) => {
      const { errno, data } = res.data;
      if (errno === 0) {
        solve();
      }
    })
    .catch(() => {});
}

function del(that, url, solve) {
  that.$http.delete(url)
    .then((res) => {
      const { errno, data } = res.data;
      if (errno === 0) {
        solve();
      // this.editChart(data.id);
      }
    })
    .catch(() => {});
}


export default {
  get, post, put, del,
};
