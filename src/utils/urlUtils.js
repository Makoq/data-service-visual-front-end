const urls = {
  get_source_list: '/dataSource', // ?type=xxx
  delete_source: '/deleteSource', // ?type=xxx&id=xxx

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

  udx_data_xml:'/schemadataxml',

  insert_block_log:'/newblocklog',
  block_log:'/blocklog',

  chart: '/chart', // 创建 chart

  server_url: 'http://localhost:8897',
};

export default urls; 0;
