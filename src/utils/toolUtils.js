
function confirm(that, msg, solve) {
  that.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      solve();
    })
    .catch(() => {});
}

function prompt(that, msg, title, defaultValue, solve) {
  that.$prompt(msg, title, {
    inputValue: defaultValue,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      solve(value);
    })
    .catch(() => {});
}

export default { confirm, prompt };
