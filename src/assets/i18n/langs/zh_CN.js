
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';

const zh_CN = {
  home_page: {
    title: '数据服务化',
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
    service_status: '服务状态',
    data_management: '数据管理',
    my_visualization: '我的可视化',
    my_workspace: '工作空间',
    help: '帮助',
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
    data: '提交',
    choose_data: '选取文件',
    upload_to_server: '上传到服务器',
    workspace: '工作空间',
    local_path: '连接参数',
    select_local_file: 'File',
  },
  udx_schema: {
    schema_tree: 'Udx Schema 结构树',
    udx_data_list: 'Udx Data 数据列表',
    data_list: '数据项',
    data_show:'Udx Data 数据抽取展示'
  },
  data: {
    check: '详情',
    content: '内容',
    share: '分享',
    delete: '删除',
    edit: '编辑',

    name: '名称',
    workspace: '工作空间',
    tags: '标签',
    oper: '操作',
    date: '创建时间',
    user: '用户',
    desc: '描述',

  },
  workspace: {
    create_workspace: '创建工作空间',
    update_workspace: '修改工作空间',

    name: '名称',
    desc: '描述',
    tags: '标签',
    create: '创建',
    edite: '修改',


  },
  system_state: {
    item: '条目',
    cont: '内容',
    oper: '操作',

  },


  ...zhLocale,
};

export default zh_CN;
