Blockly.Blocks['block_get_value_by_index'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get_complex_node_value_by_index")
    this.appendValueInput("i_node")
        .setCheck("udx_node")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("node");
        this.appendValueInput("i_idx")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("index");
    //     .appendField(new Blockly.FieldDropdown([["any","any"], ["list","list"], ["int","int"], ["real","real"], ["string","string"], ["vector2d","vector2d"], ["vector3d","vector3d"], ["vector4d","vector4d"], ["int_array","int_array"], ["real_array","real_array"], ["string_array","string_array"], ["vector2d_array","vector2d_array"], ["vector3d_array","vector3d_array"], ["vector4d_array","vector4d_array"]]), "dd_udx_kernel_type");
    // this.setOutput(true, "udx_kernel_type");
    // this.setColour(230);
    this.setOutput(true, "udx_node");
    this.setColour(230);
 this.setTooltip("http://geomodeling.njnu.edu.cn/");
 this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
  }
};

Blockly.JavaScript['block_get_value_by_index'] = function(block) {
  // var dropdown_dd_udx_kernel_type = block.getFieldValue('dd_udx_kernel_type');
  var value_i_node = Blockly.JavaScript.valueToCode(block, 'i_node', Blockly.JavaScript.ORDER_ATOMIC);
  var value_i_idx = Blockly.JavaScript.valueToCode(block, 'i_idx', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = value_i_node+'.getKernel().getTypedValueByIndex('+value_i_idx+')';

  return [code, Blockly.JavaScript.ORDER_NONE];
};