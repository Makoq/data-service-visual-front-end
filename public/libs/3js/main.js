//获取地址栏url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

// draw sprite 
function createSphere(name, pos, color) {
    var sphereGeometry = new THREE.SphereGeometry(6, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: color });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = pos.x;
    sphere.position.y = pos.y;
    sphere.position.z = pos.z;

    sphere.name = name;

    return sphere;
}

//draw cube
function createCube(name, pos, color) {
    var geometry = new THREE.BoxGeometry(10, 37, 10);
    var matarial = new THREE.MeshLambertMaterial({ color: color });
    var cube = new THREE.Mesh(geometry, matarial);

    // var sphereGeometry = new THREE.SphereGeometry(6, 20, 20);
    // var sphereMaterial = new THREE.MeshLambertMaterial({ color: color });
    // sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    cube.position.x = pos.x;
    cube.position.y = pos.y;
    cube.position.z = pos.z;

    cube.name = name;

    return cube;
}

function updateMesh(mesh, h, color) {
    scene.remove(mesh);

    var width = mesh.geometry.parameters.width;
    var height = h;// mesh.geometry.parameters.height ;
    var depth = mesh.geometry.parameters.depth;
    // 定义 box
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var matarial = new THREE.MeshLambertMaterial({ color: color });
    var cube = new THREE.Mesh(geometry, matarial);

    cube.position.x = mesh.position.x;
    cube.position.y = mesh.position.y;
    cube.position.z = mesh.position.z;

    cube.name = mesh.name;

    scene.add(cube);
}


function obj2Screen(obj) {
    var mat = obj.matrixWorld;
    var pos = new THREE.Vector3(); //创建一个(0,0,0)矢量
    pos.applyMatrix4(mat);

    var projMat = camera.projectionMatrix;
    //var pos = obj.position.clone();
    // OMG~~
    // I find it. so silly. 
    // 向量 * 相机坐标系的逆矩阵 = 向量在相机坐标系中的位置。
    pos.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(projMat);

    //投影后的坐标为(-1,1)，将其映射到屏幕坐标（线性插值)
    var eltx = (1 + pos.x) * container.offsetWidth / 2;
    var elty = (1 - pos.y) * container.offsetHeight / 2;
    // 加上dom的偏移
    var offset = $(webGLRenderer.domElement).offset();
    eltx += offset.left;
    elty += offset.top;

    return { x: eltx, y: elty };
}
var obs_data,sim_data,option 
// 显示图表
function showGraph(obj) {
    var pos = obj2Screen(obj);


    if (obj.name.startsWith("site1")) {
        obs_data = observation_data[0];
        sim_data = simulation_data[0];
    } else if (obj.name.startsWith("site2")) {
        obs_data = observation_data[1];
        sim_data = simulation_data[1];
    } else if (obj.name.startsWith("site3")) {
        obs_data = observation_data[2];
        sim_data = simulation_data[2];
    } else if (obj.name.startsWith("site4")) {
        obs_data = observation_data[3];
        sim_data = simulation_data[3];
    } else if (obj.name.startsWith("site5")) {
        obs_data = observation_data[4];
        sim_data = simulation_data[4];
    }


    var colors = ['#5793f3', '#d14a61', '#675bba'];

    option = {
        color: colors,

        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['Observed runoff', 'Simulated runoff']
        },
        grid: {
            top: 70,
            bottom: 50
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return '径流量  ' + params.value
                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        }
                    }
                },
                data: ["2000-1", "2000-2", "2000-3", "2000-4", "2000-5", "2000-6", "2000-7", "2000-8", "2000-9", "2000-10", "2000-11", "2000-12", "2001-1", "2001-2", "2001-3", "2001-4", "2001-5", "2001-6", "2001-7", "2001-8", "2001-9", "2001-10", "2001-11", "2001-12", "2002-1", "2002-2", "2002-3", "2002-4", "2002-5", "2002-6", "2002-7", "2002-8", "2002-9", "2002-10", "2002-11", "2002-12", "2003-1", "2003-2", "2003-3", "2003-4", "2003-5", "2003-6", "2003-7", "2003-8", "2003-9", "2003-10", "2003-11", "2003-12", "2004-1", "2004-2", "2004-3", "2004-4", "2004-5", "2004-6", "2004-7", "2004-8", "2004-9", "2004-10", "2004-11", "2004-12", "2005-1", "2005-2", "2005-3", "2005-4", "2005-5", "2005-6", "2005-7", "2005-8", "2005-9", "2005-10", "2005-11", "2005-12"]
            },
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return '径流量  ' + params.value
                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        }
                    }
                },
                data: ["2000-1", "2000-2", "2000-3", "2000-4", "2000-5", "2000-6", "2000-7", "2000-8", "2000-9", "2000-10", "2000-11", "2000-12", "2001-1", "2001-2", "2001-3", "2001-4", "2001-5", "2001-6", "2001-7", "2001-8", "2001-9", "2001-10", "2001-11", "2001-12", "2002-1", "2002-2", "2002-3", "2002-4", "2002-5", "2002-6", "2002-7", "2002-8", "2002-9", "2002-10", "2002-11", "2002-12", "2003-1", "2003-2", "2003-3", "2003-4", "2003-5", "2003-6", "2003-7", "2003-8", "2003-9", "2003-10", "2003-11", "2003-12", "2004-1", "2004-2", "2004-3", "2004-4", "2004-5", "2004-6", "2004-7", "2004-8", "2004-9", "2004-10", "2004-11", "2004-12", "2005-1", "2005-2", "2005-3", "2005-4", "2005-5", "2005-6", "2005-7", "2005-8", "2005-9", "2005-10", "2005-11", "2005-12"]
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Observed runoff',
                type: 'line',
                xAxisIndex: 1,
                smooth: true,
                data: obs_data
            },
            {
                name: 'Simulated runoff',
                type: 'line',
                smooth: true,
                data: sim_data
            }
        ]
    };

    var myChart = echarts.init(div_chart);
    myChart.setOption(option);

    div_chart.style.position = 'absolute';
    div_chart.style.left = pos.x + 'px';
    div_chart.style.top = pos.y + 'px';
    div_chart.style.backgroundColor = '#F3F3F3';
    div_chart.style.visibility = 'visible';
}

// 隐藏图表
function hideGraph() {
    div_chart.style.visibility = 'hidden';
}

var scene, raycaster, camera, container, webGLRenderer, div_chart;
var mouse = new THREE.Vector2(), INTERSECTED;
var SITE1 = 'site1_liaoshuiwanjiabu_11';
// var SITE12 = 'site1_liaoshuiwanjiabu_12';
// var SITE13 = 'site1_liaoshuiwanjiabu_13';
// var SITE14 = 'site1_liaoshuiwanjiabu_14';
// var SITE15 = 'site1_liaoshuiwanjiabu_15';
// var SITE16 = 'site1_liaoshuiwanjiabu_16';

var SITE2 = 'site2_ganjiangwaizhou_21';
// var SITE22 = 'site2_ganjiangwaizhou_22';
// var SITE23 = 'site2_ganjiangwaizhou_23';
// var SITE24 = 'site2_ganjiangwaizhou_24';
// var SITE25 = 'site2_ganjiangwaizhou_25';
// var SITE26 = 'site2_ganjiangwaizhou_26';


var SITE3 = 'site3_fuhelijiadu_31';
// var SITE32 = 'site3_fuhelijiadu_32';
// var SITE33 = 'site3_fuhelijiadu_33';
// var SITE34 = 'site3_fuhelijiadu_34';
// var SITE35 = 'site3_fuhelijiadu_35';
// var SITE36 = 'site3_fuhelijiadu_36';


var SITE4 = 'site4_xinjiangmeigang_41';
// var SITE42 = 'site4_xinjiangmeigang_42';
// var SITE43 = 'site4_xinjiangmeigang_43';
// var SITE44 = 'site4_xinjiangmeigang_44';
// var SITE45 = 'site4_xinjiangmeigang_45';
// var SITE46 = 'site4_xinjiangmeigang_46';



var SITE5 = 'site5_leanheshizhenjie_51';
// var SITE52 = 'site5_leanheshizhenjie_52';
// var SITE53 = 'site5_leanheshizhenjie_53';
// var SITE54 = 'site5_leanheshizhenjie_54';
// var SITE55 = 'site5_leanheshizhenjie_55';
// var SITE56 = 'site5_leanheshizhenjie_56';


var observation_data = [], simulation_data = [];

var mean1=0,mean2=0,mean3=0,mean4=0;
var mean5=0
    var sum = 0;

// once everything is loaded, we run our Three.js stuff.
function init() {

    var stats = initStats();
    div_chart = document.getElementById('div_chart');
    raycaster = new THREE.Raycaster();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);

    // create a render and set the size
    webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = true;

    // position and point the camera to the center of the scene
    camera.position.x = 130;
    camera.position.y = 500;
    camera.position.z = 600;
    camera.lookAt(scene.position);
    scene.add(camera);

    // add spotlight for the shadows
    var spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(30, 40, 50);
    spotLight.intensity = 1;
    scene.add(spotLight);


    // site1
    var cube1 = createCube(SITE1, { x: 20, y: 43, z: 2 }, 0x0000ff);
    scene.add(cube1);

    // site2
    var cube2 = createCube(SITE2, { x: 120, y: 43, z: 12 }, 0x0000ff);
    scene.add(cube2);

    // site3
    var cube3 = createCube(SITE3, { x: -220, y: 43, z: 102 }, 0x0000ff);
    scene.add(cube3);


    // site4
    var cube4 = createCube(SITE4, { x: -320, y: 43, z: -120 }, 0x0000ff);
    scene.add(cube4);


    // site5
    var cube5 = createCube(SITE5, { x: 150, y: 43, z: 230 }, 0x0000ff);
    scene.add(cube5);

    
   
    //console.log(cube11);
    // scene.add(createCube(SITE1,h11, { x: 20, y: 43, z: 2 }, 0x7777ff));
    // scene.add(createCube(SITE1,h12, { x: 22, y: 43, z: 2 }, 0x7777ff));
    // scene.add(createCube(SITE1,h13, { x: 24, y: 43, z: 2 }, 0x7777ff));
    // scene.add(createCube(SITE1,h14, { x: 26, y: 43, z: 2 }, 0x7777ff));
    // scene.add(createCube(SITE1,h15, { x: 28, y: 43, z: 2 }, 0x7777ff));
    // scene.add(createCube(SITE1,h16, { x: 30, y: 43, z: 2 }, 0x7777ff));

    //draw sphere
    // scene.add(createSphere(SITE1, { x: 20, y: 43, z: 2 }, 0x7777ff));
    // scene.add(createSphere(SITE2, { x: 120, y: 43, z: 12 }, 0xff0000));//red
    // scene.add(createSphere(SITE3, { x: -220, y: 43, z: 102 }, 0x0000ff));//blue
    // scene.add(createSphere(SITE4, { x: -320, y: 43, z: -120 }, 0x00ff00));//green
    // scene.add(createSphere(SITE5, { x: 150, y: 43, z: 230 }, 0xffff00));

    var orbitControls = new THREE.OrbitControls(camera);
    //orbitControls.autoRotate = true;
    var clock = new THREE.Clock();

    // add the output of the renderer to the html element
    container = document.getElementById("WebGL-output");
    container.appendChild(webGLRenderer.domElement);

    // call the render function
    var step = 0;

    // setup the control gui
    var controls = new function () {
        // we need the first child, since it's a multimaterial
    };

    //var gui = new dat.GUI();
    var mesh;

    var loader = new THREE.OBJLoader();
    loader.load('../../assets/newpyh.obj', function (loadedMesh) {
        var material = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.SmoothShading });
        // loadedMesh is a group of meshes. For
        // each mesh set the material, and compute the information
        // three.js needs for rendering.
        loadedMesh.children.forEach(function (child) {
            child.material = material;
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals();
        });

        mesh = loadedMesh;
        loadedMesh.scale.set(100, 100, 100);
        //loadedMesh.rotation.x = -0.3;
        scene.add(loadedMesh);
    });

    render();

    var counter = 0;
    var cc = 0;

    var color_high = 0xff0000;
    var color_low = 0x00ff00;

    function render() {
        stats.update();

        var delta = clock.getDelta();
        orbitControls.update(delta);


        //    cube11.geometry.parameters.height +=1;

        var mesh1 = scene.getObjectByName(SITE1);
        var mesh2 = scene.getObjectByName(SITE2);
        var mesh3 = scene.getObjectByName(SITE3);
        var mesh4 = scene.getObjectByName(SITE4);
        var mesh5 = scene.getObjectByName(SITE5);

        //mesh.geometry.verticesNeedUpdate = true;
        cc += 1;


        if (counter >= 72) {
            counter = 0;
        }

        if (simulation_data.length > 0 && cc > 100) {

            if (simulation_data[0][counter] >= mean1) {
                updateMesh(mesh1, simulation_data[0][counter] * 0.1, color_high);
            } else {
                updateMesh(mesh1, simulation_data[0][counter] * 0.1, color_low);
            }

            if (simulation_data[1][counter] >= mean2) {
                updateMesh(mesh2, simulation_data[1][counter] * 0.1, color_high);
            } else {
                updateMesh(mesh2, simulation_data[1][counter] * 0.1, color_low);
            }

            if (simulation_data[2][counter] >= mean3) {
                updateMesh(mesh3, simulation_data[2][counter] * 0.1, color_high);
            } else {
                updateMesh(mesh3, simulation_data[2][counter] * 0.1, color_low);
            }

            if (simulation_data[3][counter] >= mean4) {
                updateMesh(mesh4, simulation_data[3][counter] * 0.1, color_high);
            } else {
                updateMesh(mesh4, simulation_data[3][counter] * 0.1, color_low);
            }

            if (simulation_data[4][counter] >= mean5) {
                updateMesh(mesh5, simulation_data[4][counter] * 0.1, color_high);
            } else {

                updateMesh(mesh5, simulation_data[4][counter] * 0.1, color_low);
            }

            cc = 0;
        }
        // updateMesh(mesh13,counter++);


        counter++;

        // updateMesh(mesh16,counter++);

        //console.log(cube11.geometry.parameters.height)


        simulation_data[0]



        // render using requestAnimationFrame
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }

    console.log(observation_data);

    function initStats() {

        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // windows resize： reset the scene
    window.onresize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();//更新投影矩阵
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    // 拾取
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
            // console.log(INTERSECTED.position.x);
            showGraph(INTERSECTED);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
        hideGraph();
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// window.onload = init;
// $(function () {
    // init the scene

function ready(){
    init();

    // get the runoff data of PYH
    // var observation_runoff = GetQueryString('filename1');
    // var simulation_runoff = GetQueryString('filename2');

    //get observation runoff data
    $.get("../../assets/observation.xml", {}, function (data) {
        var udx_observation = (new XMLSerializer()).serializeToString(data);

        var observation_ds = new UdxDataset();
        observation_ds.createDataset();
        observation_ds.loadFromXmlStream(udx_observation);

        var siteCount = observation_ds.getChildNodeCount();
        for (var i = 0; i < siteCount; i++) {
            var site = [];
            var siteNode = observation_ds.getChildNode(i);
            var yearCount = siteNode.getChildNodeCount();
            for (var j = 0; j < yearCount; j++) {
                var yearNode = siteNode.getChildNode(j);
                var monthCount = yearNode.getChildNodeCount();
                for (var k = 0; k < monthCount; k++) {
                    var monthNode = yearNode.getChildNode(k);
                    //console.log(monthNode.getKernel().getArrayCount());
                    var days = monthNode.getKernel().getArrayCount();
                    var sum = 0;
                    for (var m = 0; m < days; m++) {
                        sum += monthNode.getKernel().getTypedValueByIndex(m);
                    }
                    sum /= days;

                    site.push(sum);
                }
            }
            observation_data.push(site);
        }


        // get simulation runoff data
    $.get("../../assets/simulation.xml", {}, function (data) {
            var udx_simulatoion = (new XMLSerializer()).serializeToString(data);

            var simulation_ds = new UdxDataset();
            simulation_ds.createDataset();
            simulation_ds.loadFromXmlStream(udx_simulatoion);


            var siteCount = simulation_ds.getChildNodeCount();
            for (var i = 0; i < siteCount; i++) {
                var site = [];
                var siteNode = simulation_ds.getChildNode(i);
                var yearCount = siteNode.getChildNodeCount();
                for (var j = 0; j < yearCount; j++) {
                    var yearNode = siteNode.getChildNode(j);
                    var monthCount = yearNode.getChildNodeCount();
                    for (var k = 0; k < monthCount; k++) {
                        var monthNode = yearNode.getChildNode(k);
                        //console.log(monthNode.getKernel().getArrayCount());
                        var days = monthNode.getKernel().getArrayCount();
                        var sum = 0;
                        for (var m = 0; m < days; m++) {
                            sum += monthNode.getKernel().getTypedValueByIndex(m);
                        }
                        sum /= days;

                        site.push(sum);
                    }
                }
                simulation_data.push(site);
            }

            for (var i = 0; i < 72; i++) {
                sum += simulation_data[0][i];
            }
            mean1 = sum / 72;
        
            sum = 0;
            for (var i = 0; i < 72; i++) {
                sum += simulation_data[1][i];
            }
            mean2 = sum / 72;
        
            sum = 0;
            for (var i = 0; i < 72; i++) {
                sum += simulation_data[2][i];
            }
            mean3 = sum / 72;
        
            sum = 0;
            for (var i = 0; i < 72; i++) {
                sum += simulation_data[3][i];
            }
            mean4 = sum / 72;
        
            sum = 0;
            for (var i = 0; i < 72; i++) {
                sum += simulation_data[4][i];
            }
            mean5 = sum / 72;
        
        });
    });


}

 export default {
     ready
};   
// });


