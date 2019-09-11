import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./views/Index.vue'),
      meta: {
        title: 'OpenGMS | Configured Visualization Platform',
      },
    },
    {
      path: '/console',
      component: () => import('./components/Console/Index.vue'),
      children: [
        {
          path: 'data',
          component: () => import('./views/Console/Data.vue'),
          meta: {
            title: 'Data Manager',
          },
        },
        {
          path: 'workspace',
          component: () => import('./views/Console/WorkSpace.vue'),
          meta: {
            title: 'Work Space',
          },
        },
        {
          path: 'workspaceInfo',
          component: () => import('./views/Console/WoreSpaceCreate.vue'),
          meta: {
            title: 'Work Space Create',
          },
        },
        {
          path: 'data/udx-source',
          component: () => import('./views/Console/AddUdxSource.vue'),
          meta: {
            title: 'Add Udx Source',
          },
        },
        {
          path: 'data/config-source',
          component: () => import('./views/Console/AddConfigurableSource.vue'),
          meta: {
            title: 'Add Configurable Source',
          },
        },
        {
          path: 'data/udx-info',
          name:'udxinfo',
          component: () => import('./views/Console/DataInfo.vue'),
          meta: {
            title: 'Udx Schema Info',
          },
        },
        {
          path: 'data/udx-schema',
          name:'schema',
          component: () => import('./views/Console/UdxSchema.vue'),
          meta: {
            title: 'Udx Schema',
          },
        },
        {
          path: 'chart',
          component: () => import('./views/Console/Chart.vue'),
          meta: {
            title: 'My Visualization',
          },
        },
        {
          path: '',
          redirect: 'chart',
        },
      ],
    },
    {
      path: '/edit',
      component: () => import('./components/Editor/Index.vue'),
      children: [
        {
          path: ':id',
          component: () => import('./views/Editor/Canvas.vue'),
          meta: {
            title: 'OpenGMS',
          },
        },
      ],
    },
    {
      path: '/view/:id',
      name: 'view',
      component: () => import('./views/Viewer/Canvas.vue'),
      meta: {
        title: 'Fullscreen | OpenGMS',
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
