Blockly.Blocks['block_get_child_by_index'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get_child_by_index");
    this.appendValueInput("i_node")
        .setCheck("udx_node")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("parent node");
    // this.appendValueInput("i_node_name")
    //     .setCheck("String")
    //     .setAlign(Blockly.ALIGN_RIGHT)
    //     .appendField("node_name");
    this.appendValueInput("i_idx")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("index");
    this.setOutput(true, "udx_node");
    this.setColour(230);
 this.setTooltip("http://geomodeling.njnu.edu.cn/");
 this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
  }
};

Blockly.JavaScript['block_get_child_by_index'] = function(block) {
  var value_i_node = Blockly.JavaScript.valueToCode(block, 'i_node', Blockly.JavaScript.ORDER_ATOMIC);
  // var value_i_node_name = Blockly.JavaScript.valueToCode(block, 'i_node_name', Blockly.JavaScript.ORDER_ATOMIC);
  var value_i_idx = Blockly.JavaScript.valueToCode(block, 'i_idx', Blockly.JavaScript.ORDER_ATOMIC);

  // var code = 'get_child_by_index('+value_i_node+','+value_i_node_name+','+value_i_inde+')'
   
  // var code =value_i_node+'.getChildNode('+value_i_idx+')'

  var code =value_i_node +'.getChildNode('+value_i_idx+')';
  // var code = value_i_node.replace('//dosome', '.getChildNode('+value_i_idx+')//dosm');  
  // value_i_node += value_i_node.replace('//dosome', '.getChildNode('+value_i_idx+')//dosm');  
  // code += value_i_node;

  // if(code[0]==='('){
  //   let tp=0
  //   //  console.log("brfore",code)    
  //     for(let i=0;i<code.length;i++){
  //       if(code[i]==='(') tp++;

  //       else break
  //     }

  //     code=code.slice(tp,-tp)
  //     // console.log("after",code)
  // }

  // var code = value_i_node.concat('.getChildNode('+value_i_idx+')');  
 if(code.startsWith('(')){
  let tp=0
    //  console.log("brfore",code)    
      for(let i=0;i<code.length;i++){
        if(code[i]==='(') tp++;

        else break
      }

      let p=code.lastIndexOf(".")
      let str1=code.substring(tp,p-tp)
      let str2=code.substring(p,code.length)
      
      console.log("ff",str1+str2)
      code=str1+str2
 }

console.log("mamama",code)
 
  return [code, Blockly.JavaScript.ORDER_NONE];
};