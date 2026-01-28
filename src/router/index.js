import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useMainStore } from '../stores/main.js'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/units',
			name: 'units',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/UnitsView.vue')
		},
		{
			path: '/login',
			name: 'LogIn',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/LogInView.vue')
		},
		{
			path: '/logout',
			name: 'LogOut',
			component: () => import('../views/LogInView.vue'),
			props: { logOut: true }
		},
		{
			path: '/user/user',
			name: 'Užívateľ',
			component: () => import('../views/UserView.vue')
		},
		{
			path: '/user/edit/:id',
			name: 'Užívateľ - editácia',
			component: () => import('../views/UserView.vue'),
			props: { edit: 1 }
		},
		{
			path: '/user/passwordchange/:id',
			name: 'Užívateľ - zmena hesla',
			component: () => import('../views/UserView.vue'),
			props: { edit: 2 }
		},
		{
			path: '/devices',
			name: 'Zariadenia',
			component: () => import('../views/DevicesView.vue')
		},
		{
			path: '/device/:id',
			name: 'Zariadenie',
			props: route => ({ id: Number(route.params.id) }),
			component: () => import('../views/DeviceView.vue')
		},
		{
			path: '/device/edit/:id',
			name: 'Zariadenie - editácia',
			component: () => import('../views/DeviceView.vue'),
			props: route => ({ id: Number(route.params.id), edit: true }),
		},
		{
			path: '/sensor/:id',
			name: 'Senzor',
			props: route => ({ id: Number(route.params.id) }),
			component: () => import('../views/SensorView.vue')
		},
		{
			path: '/views',
			name: 'Moje grafy',
			component: () => import('../views/ViewsView.vue')
		}
	]
})

// eslint-disable-next-line no-unused-vars
router.beforeEach((to) => {
	// eslint-disable-next-line no-unused-vars
	const store = useMainStore()
})

export default router
