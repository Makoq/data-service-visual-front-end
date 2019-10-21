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
          path: 'test',
          component: () => import('./views/test.vue'),
          meta: {
            title: 'test',
          },
        },
        {
          path: 'test2',
          component: () => import('./views/test2.vue'),
          meta: {
            title: 'test2',
          },
        },
        {
          path: 'state',
          component: () => import('./views/Console/SystemState.vue'),
          meta: {
            title: 'System State',
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
          path: 'help',
          component: () => import('./views/Console/Help.vue'),
          meta: {
            title: 'Help',
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
          path: 'service/udx-source',
          component: () => import('./views/Console/AddUdxSource.vue'),
          meta: {
            title: 'Add  Source',
          },
        },
        {
          path: 'service/config-source',
          component: () => import('./views/Console/AddConfigurableSource.vue'),
          meta: {
            title: 'Add Configurable Source',
          },
        },
        {
          path: 'data/udx-info',
          name: 'udxinfo',
          component: () => import('./views/Console/DataInfo.vue'),
          meta: {
            title: 'Udx Schema Info',
          },
        },
        {
          path: 'data/content',
          name: 'schema',
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
          path: 'service/:type',
          component: () => import('./views/Console/Data.vue'),
          meta: {
            title: 'Service List',
          },
          
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
