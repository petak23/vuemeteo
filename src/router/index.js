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
			meta: { requiresAuth: true },
			name: 'Užívateľ',
			component: () => import('../views/UserView.vue')
		},
		{
			path: '/user/edit/:id',
			meta: { requiresAuth: true },
			name: 'Užívateľ - editácia',
			component: () => import('../views/UserView.vue'),
			props: { edit: 1 }
		},
		{
			path: '/user/passwordchange/:id',
			meta: { requiresAuth: true },
			name: 'Užívateľ - zmena hesla',
			component: () => import('../views/UserView.vue'),
			props: { edit: 2 }
		},
		{
			path: '/devices',
			meta: { requiresAuth: true },
			name: 'Zariadenia',
			component: () => import('../views/DevicesView.vue')
		},
		{
			path: '/device/:id',
			meta: { requiresAuth: true },
			name: 'Zariadenie',
			props: route => ({ id: Number(route.params.id) }),
			component: () => import('../views/DeviceView.vue')
		},
		{
			path: '/device/edit/:id',
			meta: { requiresAuth: true },
			name: 'Zariadenie - editácia',
			component: () => import('../views/DeviceView.vue'),
			props: route => ({ id: Number(route.params.id), edit: true }),
		},
		{
			path: '/sensor/:id',
			meta: { requiresAuth: true },
			name: 'Senzor',
			props: route => ({ id: Number(route.params.id) }),
			component: () => import('../views/SensorView.vue')
		},
		{
			path: '/sensor/stat/:id',
			meta: { requiresAuth: true },
			name: 'Senzor - štatistika',
			props: route => ({ id: Number(route.params.id), mode: 'stat' }),
			component: () => import('../views/SensorView.vue')
		},
		{
			path: '/sensor/edit/:id',
			meta: { requiresAuth: true },
			name: 'Senzor - editácia',
			props: route => ({ id: Number(route.params.id), mode: 'edit' }),
			component: () => import('../views/SensorView.vue')
		},
		{
			path: '/views',
			meta: { requiresAuth: true },
			name: 'Moje grafy',
			component: () => import('../views/ViewsView.vue')
		},
		{
			path: '/view/new',
			meta: { requiresAuth: true },
			name: 'Graf - nový',
			component: () => import('../views/ViewsView.vue'),
			props: { id: 0, mode: 'edit' },
		},
		{
			path: '/view/edit/:id',
			meta: { requiresAuth: true },
			name: 'Graf - editácia',
			component: () => import('../views/ViewsView.vue'),
			props: route => ({ id: Number(route.params.id), mode: 'edit' }),
		},
		{
			path: '/chart/sensor/:id',
			meta: { requiresAuth: true },
			name: 'Graf senzoru',
			props: route => ({ id: Number(route.params.id), mode: 'sensor' }),
			component: () => import('../views/ChartView.vue')
		}
	]
})

// Stránky s meta.requiresAuth sú len pre prihláseného užívateľa.
// Pri prvom načítaní stránky sa najprv počká na zistenie, kto je prihlásený.
router.beforeEach(async (to) => {
	if (!to.meta.requiresAuth) return true

	const store = useMainStore()
	await store.ensureUser()

	if (!store.is_logged_in) {
		return { name: 'LogIn', query: { redirect: to.fullPath } }
	}
	return true
})

export default router
