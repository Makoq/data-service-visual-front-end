const urls = {
  get_source_list: '/dataSource', // ?type=xxx
  delete_source: '/deleteSource', // ?type=xxx&id=xxx
  data_count:'/dataCount',
  workspace_create: '/workspace',
  workspace_delete: '/delworkspace',
  workspace_single: '/soloworkspace',
  workspace_update: 'workspaceupdate',

  solo_udx_schema: '/soloudxschema',
  update_udx_schema: '/updateschema',
  udx_source_upload: '/udxSource',
  udx_schema_info: '/udxSchemaInfo',

  udx_node: '/udxnode',
  default_udx_info:'/config',


  //数据服务详情中的schema
  data_source_detail_schema_file:'/schemafile',


  udx_data_xml:'/schemadataxml',

  insert_block_log:'/newblocklog',
  block_log:'/blocklog',

  chart: '/chart', // 创建 chart

  server_url: 'http://localhost:8897',
};

export default urls; 0;
