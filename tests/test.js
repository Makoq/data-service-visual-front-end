var data_0480576f_8b63_47a9_8a32_056bc7c6ac91 = new UdxDataset();
data_0480576f_8b63_47a9_8a32_056bc7c6ac91.createDataset();
fetch('/api/schemadataxml?id=0480576f-8b63-47a9-8a32-056bc7c6ac91&schemaData=ascii_test11.xml' )
.then(res => res.json())
.then(re => {data_0480576f_8b63_47a9_8a32_056bc7c6ac91.loadFromXmlStream(re.data);
    var node_data_0480576f_8b63_47a9_8a32_056bc7c6ac91 = data_0480576f_8b63_47a9_8a32_056bc7c6ac91.getSelf();
    console.log( node_data_0480576f_8b63_47a9_8a32_056bc7c6ac91);
    $node;
});

var data_a9825620_1ae6_477b_8968_3c2d22210007 = new UdxDataset();data_a9825620_1ae6_477b_8968_3c2d22210007.createDataset();fetch('/api/schemadataxml?id=a9825620-1ae6-477b-8968-3c2d22210007&schemaData=ascii_test11.xml' ).then(res => res.json()).then(re => {data_a9825620_1ae6_477b_8968_3c2d22210007.loadFromXmlStream(re.data);var node_data_a9825620_1ae6_477b_8968_3c2d22210007 = data_a9825620_1ae6_477b_8968_3c2d22210007.getSelf();console.log( node_data_a9825620_1ae6_477b_8968_3c2d22210007);@node;});