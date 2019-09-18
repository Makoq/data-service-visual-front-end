function UdxNode() {
  this.children = new Array();
}

// var udx_nodes = new UdxNode();

var index = 1;
var isfirst = true;
// const icon = 'online';
function trans_new(dataset, nodes) {
  
  // 如果dataset是一个obj的话
  // 一般情况下，udxnode下是一个[]，这个情况是排除不是数组的情况。
  if (dataset instanceof Object && !(dataset instanceof Array) && !isfirst) {
    var node = new UdxNode();
    node.id = index++;
    node.text = dataset.$.name;
    node.icon = `../assets/tree.png`;
    node.state = { opened: true };
    nodes.children.push(node);
    trans_new(dataset.UdxNode, node);
    return;
  }


  for (const o in dataset) {
    if (dataset[o].UdxNode instanceof Array || isfirst) {
      isfirst = false;
      var node = new UdxNode();
      node.id = index++;
      if (typeof (dataset[o].$) === 'undefined') {
        node.text = 'Dataset';
      } else {
        node.text = dataset[o].$.name;
      }
      node.icon = `../assets/tree.png`;
      node.state = { opened: true };
      nodes.children.push(node);
      trans_new(dataset[o].UdxNode, node);
    } else if (dataset[o].UdxNode instanceof Object) {
      var node = new UdxNode();
      node.id = index++;
      node.text = dataset[o].$.name;
      node.state = { opened: true };
      node.icon = `../assets/tree.png`;
      if (dataset[o].UdxNode.$ != 'undefined') {
        const n = new UdxNode();
        n.id = index++;
        n.text = dataset[o].UdxNode.$.name;
        n.icon = `../assets/tree.png`;
        n.state = { opened: true };
        node.children.push(n);

        nodes.children.push(node);
        trans_new(dataset[o].UdxNode.UdxNode, n);
      } else {
        nodes.children.push(node);
        trans_new(dataset[o].UdxNode.UdxNode, node);
      }
    } else if (typeof (dataset[o].UdxNode) === 'undefined') {
      var node = new UdxNode();
      node.id = index++;
      node.text = dataset[o].$.name;
      node.icon = `../assets/tree.png`;
      node.state = { opened: true };
      nodes.children.push(node);
    }
  }
}

function test(that){
    console.log("test",that)
}
// export default {
//     test,trans_new, UdxNode,
// };

function reset(){
    isfirst = true;
}


export default { trans_new, UdxNode,reset}