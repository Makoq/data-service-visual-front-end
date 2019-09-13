
import enLocale from 'element-ui/lib/locale/lang/en';

const en_US = {
  home_page: {
    title: 'OpenGMS',
    subtitle: 'Configurable Visualization Platform for Geo-Data',
    login: 'Login',
    register: 'register',
    enter: 'Enter',
    username: 'Please input user name',
    password: 'Please input password',
    login_success_info: 'Login successfully',
  },
  navmenu: {
    data_management: 'Data Management',
    my_visualization: 'My Visualization',
    my_workspace:"workspace"
  },
  data_management: {
    add_data_source: 'New data source',
    source_type: 'Select new data source type',


    udx_source: 'UDX Source',
    data_container_source: 'Original Source',
    configurable_source: 'Configurable Source',
  },
  workspace:{
    create_workspace:'Create WorkSpace',
    name:'Nmae',
    desc:'Describe',
    tags:'Tags',
    create:'CreateWorkSpace'
  },

  addUdxSource: {
    name: 'UDX Name',
    desc: 'Description',
    tags: 'Tags',
    data: 'Data File',
    choose_data: 'Select File',
    upload_to_server: 'Upload',
    workspace:'Work Space',
    local_path:'Local Path',
    select_local_file:'File',
    

  },
  data: {
    check: 'Detail',
    share: 'Share',
    content:'Content',
    delete: 'Delete',

  },

  ...enLocale,
};

export default en_US;
