import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import register from '../views/register.vue'
import login from '../views/login.vue'
import home from '../views/home.vue'
import Cookies from "js-cookie"
import users from '../components/users.vue'
import roles from '../components/roles.vue'
import rights from '../components/rights.vue'
import welcome from '../components/welcome.vue'
Vue.use(VueRouter);

  const routes: Array<RouteConfig> = [
    {
      path: '/',
      redirect: '/login',
      meta:{title:"登录"}
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta:{title:"注册"}
     },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta:{title:"登录"}
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/welcome',
      component: home,
      children:[
        {path:'/users',component:users,meta:{title:"用户列表"}},
        {path:'/roles',component:roles,meta:{title:"角色列表"}},
        {path:'/rights',component:rights,meta:{title:"权限列表"}},
        {path:'/welcome',component:welcome,meta:{title:"欢迎使用"}}
      ]
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
router.beforeEach(async (to, from, next) => {
  if(to.meta.title){//判断是否有标题
    document.title = to.meta.title
  }
  if (to.path === '/login' || to.path === '/register'){
    return next();
  }
  const token = Cookies.get('token');
  if (!token) {
    return next('/login');
  }
  let pathList = await getRouterRights();
  let flag = isNext(pathList,to.path);
  if (flag) {
    next();
  } else {
    next(false);
  }
});
const getRouterRights = () => {
  let data:any = sessionStorage.getItem('user');
  if (!data) return null;
  data = JSON.parse(data);
  const routerRights = data.allRights.filter((rights:any)=> {
    if (rights.rightType === 'menu') return rights;
  });
  let arr:any[] = [];
  arr.push(routerRights[0].rightPath);
  routerRights[0].children.map((item:any) => {
    if (item.rightPath) {
      arr.push(item.rightPath);
    }
    if (item.children) {
      item.children.map((res:any) => {
        arr.push(res.rightPath);
      })
    }
  });
  return arr;
};
const isNext = (pathList:any,toPath:any) => {
  if (pathList.includes(toPath)) return true;
};
export default router
