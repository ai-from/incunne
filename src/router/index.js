import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Incunne | Music',
      layout: 'inner'
    }
  },
  {
    path: '/text',
    name: 'TextBoth',
    component: () => import('../views/TextBoth.vue'),
    meta: {
      title: 'Incunne | Text',
      layout: 'inner'
    }
  },
  {
    path: '/photo',
    name: 'Photo',
    component: () => import('../views/Photo.vue'),
    meta: {
      title: 'Incunne | Photo',
      layout: 'inner'
    }
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('../views/Video.vue'),
    meta: {
      title: 'Incunne | Video',
      layout: 'inner'
    }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue'),
    meta: {
      title: 'Incunne | Feedback',
      layout: 'inner'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'Incunne | About',
      layout: 'inner'
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/Error.vue'),
    meta: {
      title: 'Incunne | Error',
      layout: 'error'
    }
  },
  {
    path: '*',
    redirect: '/error'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
