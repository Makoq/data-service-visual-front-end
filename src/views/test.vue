<template lang="pug">
<div>
 
   <div id="container"></div>
   <el-button id="btn" @click="fc">data select</el-button>
   </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted(){
    $(function() {
              $('#container').jstree({
                'core' : {
                  "check_callback" : true ,
                  'data' : [
                      {
                          "text" : "Root node",
                          "state" : {"opened" : true },
                          "children" : [
                               
                          ]
                    }
                  ]
                },
                "state" : { "key" : "state_demo" },

                "plugins" : ["contextmenu","state"]
              });
            });

            $('#container').on("changed.jstree", function (e, data) {
              //  console.log(data.instance.get_selected(true)[0].text);
                console.log(data.instance.get_node(data.selected[0]).text);
            });
            $('#btn').on("click", function () {
               var instance =$('#container').jstree(true);
               console.log(instance._model.data )
              //  instance.deselect_all();
                // console.log(instance.get_node(data.selected[0]).text);
            });
  },
  methods: {


    fc(){

    },
    fetch() {
      var data = new UdxDataset();
      data.createDataset();

      fetch(
        "/api/schemadataxml?id=0480576f-8b63-47a9-8a32-056bc7c6ac91&schemaData=ascii_test11.xml"
      )
        .then(res => res.json())
        .then(re => {
          data.loadFromXmlStream(re.data);

          var node = data.getSelf();

          console.log(node);
        });


        
    }
  }
};
</script>
<style lang="scss">
</style>

