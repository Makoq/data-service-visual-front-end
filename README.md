TODO:

 

新建数据源：
  1 *源数据文件路径

    将源数据文件拷贝一份到upload文件夹下，
    此前是udx_data,udx_schema和config文件作为源数据源的内容，
    现在是 源数据
  
  2 处理方法路径

    处理方法路径下是调用的映射方法exe
    .exe配合一个udx_data（由手动构造）,映射出udx_data，即完成了数据映射，
    在映射好的udx数据基础之上,进一步进行数据抽取、处理、可视化


对于共享而言：
  1 共享数据服务：源数据，udx_data，schema
  2 共享处理方法：即拖拽生成的代码作为一个处理方法
  3 共享处理方案：即多个拖拽生成的处理方法连接形成的多节点链路

新建处理方法：
  1源数据文件路径
  2*处理方法路径






<img src="./public/chartfun.png" width="200"></img>

> Make data reports by dragging and dropping :)

## 特性 / Features

* 通过 Excel 导入数据
* 可视化画布
* 图表、图片、文字、边框支持
* 可拖拽和缩放的组件
* 静态数据、GET接口支持
* 生成公开链接

## 截图 / Screenshot

![image-1](./screenshot/1.png)

![image-2](./screenshot/2.png)

![image-3](./screenshot/3.png)

## 开发 / Develop

### 前端部分：Vue.js

#### Project setup

```
npm install
```

#### Compiles and hot-reloads for development

```
npm run serve
```

#### Compiles and minifies for production

```
npm run build
```

### 后端部分：Node.js + Koa + MongoDB

#### Run web-service

```
node ./server/app.js
```



## 鸣谢 / Thanks

本项目使用了 Vue.js 及以下第三方库：

* [ElemeFE / element](https://github.com/ElemeFE/element)
* [ElemeFE / v-charts](https://github.com/ElemeFE/v-charts)
* [josdejong / jsoneditor](https://github.com/josdejong/jsoneditor)
* [SortableJS / Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)
* [mauricius / vue-draggable-resizable](https://github.com/mauricius/vue-draggable-resizable)
* [kirillmurashov / vue-drag-resize](https://github.com/kirillmurashov/vue-drag-resize)
* [koajs / koa](https://github.com/koajs/koa)

## LICENSE

//eslint
 "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "@vue/airbnb"
    ],
    "rules": {},
    "parserOptions": {
      "parser": "babel-eslint"
    }
  },


F:/udx/UdxServer/Server/tmp/testschema


基于多源异构数据

多源异构数据---数据重构

数据抽取---按需分配

数据处理---针对数据处理不完善，不方便

数据共享---多领域专家协同建模


数据适配
传输控制

MIT



