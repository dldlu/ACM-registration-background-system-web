import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/info",
    name: "info",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/info.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
