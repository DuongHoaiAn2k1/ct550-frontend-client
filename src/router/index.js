import { createWebHistory, createRouter } from "vue-router";
import Cookies from 'js-cookie';
const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/404.vue"),
  },

  {
    path: "/",
    name: "home",
    component: () => import("@/components/Home.vue"),
  },

  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),
    beforeEnter : (to, from, next) => {
      if(Cookies.get('isUserLoggedIn') == 'true'){ 
        next('/');
      } else {
        next();
      }
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    beforeEnter : (to, from, next) => {
      if(Cookies.get('isUserLoggedIn') == 'true'){ 
        next('/');
      } else {
        next();
      }
    }
  },
  {
    path: "/product/detail/:id",
    name: "product-detail",
    component: () => import("@/views/ProductDetail.vue"),
  },
  {
    path: "/product/:id",
    name: "product",
    component: () => import("@/views/Product.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
    beforeEnter : (to, from, next) => {
      if(Cookies.get('isUserLoggedIn') == 'true'){ 
        next();
      } else {
        next('/login');
      }
    }
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/Cart.vue"),
    beforeEnter : (to, from, next) => {
      if(Cookies.get('isUserLoggedIn') == 'true'){ 
        next();
      } else {
        next('/login');
      }
    }
  },
  {
    path: "/tokenProcess",
    name: "token",
    component: () => import("@/helps/Token/TokenProcess.vue"),
    beforeEnter : (to, from, next) => {
      if(Cookies.get('isUserLoggedIn') == 'true'){ 
        next();
      } else {
        next('/login');
      }
    }
  },
  {
    path: "/check-payment",
    name: "check-payment",
    component: () => import("@/helps/Payment/PaymentChecking.vue"),
    beforeEnter : (to, from, next) => {
      if(Cookies.get('isUserLoggedIn') == 'true'){ 
        next();
      } else {
        next('/login');
      }
    }
  },
  {
    path: "/payment",
    name: "payment",
    component: () => import("@/views/Payment.vue"),
    beforeEnter : (to, from, next) => {
      if(Cookies.get('isUserLoggedIn') == 'true'){ 
        next();
      } else {
        next('/login');
      }
    }
  },
  {
    path: "/order-detail/:id",
    name: "order-detail",
    component: () => import("@/views/OrderDetail.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/Search.vue"),
  },
  {
    path: "/food",
    name: "food",
    component: () => import("@/views/Food.vue"),
  },
  {
    path: "/travelling",
    name: "travelling",
    component: () => import("@/views/Travelling.vue"),
  },
  {
    path: "/tip",
    name: "tip",
    component: () => import("@/views/Tip.vue"),
  },
  {
    path: "/guide",
    name: "guide",
    component: () => import("@/views/Guide.vue"),
  },
  {
    path: "/shipping",
    name: "shipping",
    component: () => import("@/views/Shipping.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("@/views/Contact.vue"),
  },
  {
    path: "/affiliate",
    name: "affiliate",
    component: () => import("@/views/Affiliate.vue"),
    beforeEnter : (to, from, next) => {
      if(Cookies.get('isUserLoggedIn') == 'true'){ 
        next();
      } else {
        next('/login');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
