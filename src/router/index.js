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
      title: 'Incunne | Music'
    }
  },
  {
    path: '/text',
    name: 'Text',
    component: () => import('../views/Text.vue'),
    meta: {
      title: 'Incunne | Text'
    }
  },
  {
    path: '/photo',
    name: 'Photo',
    component: () => import('../views/Photo.vue'),
    meta: {
      title: 'Incunne | Photo'
    }
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('../views/Video.vue'),
    meta: {
      title: 'Incunne | Video'
    }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue'),
    meta: {
      title: 'Incunne | Feedback'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'Incunne | About'
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/Error.vue'),
    meta: {
      title: 'Incunne | Error'
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
