
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';

const zh_CN = {
  home_page: {
    title: '噢盆鸡美丝',
    subtitle: '地理数据配置式可视化',
    login: '登录',
    register: '注册',
    enter: '进入',
    username: '请输入用户名',
    password: '请输入密码',
    login_success_info: '登录成功',
  },

  console_page: {

  },


  navmenu: {
    data_management: '数据管理',
    my_visualization: '我的可视化',
  },

  data_management: {
    add_data_source: '新建数据源',
    source_type: '选择新建数据源类型',

    udx_source: 'UDX源',
    data_container_source: '原数据源',
    configurable_source: '可配置源',
  },
  addUdxSource: {
    name: 'UDX名称',
    desc: '摘要',
    tags: '标签',
    data: '数据文件',
    choose_data: '选取文件',
    upload_to_server: '上传到服务器',
  },
  data: {
    check: '详情',
    share: '分享',
    delete: '删除',

  },


  ...zhLocale,
};

export default zh_CN;
