import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title: string;
    hidden?: boolean;
    hideDormSelector?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layout/MainLayout.vue"),
    redirect: "/home",
    meta: {
      title: "首页",
    },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/ElectricChart.vue"),
        meta: { title: "概览" },
      },
      {
        path: "electric",
        name: "Electric",
        component: () => import("@/views/Electric.vue"),
        meta: { title: "电费记录" },
      },
      {
        path: "student",
        name: "Student",
        component: () => import("@/views/Student.vue"),
        meta: { title: "学生管理" },
      },
      {
        path: "dorm",
        name: "Dorm",
        component: () => import("@/views/Dorm.vue"),
        meta: { title: "宿舍管理" },
      },
      {
        path: "email-log",
        name: "EmailLog",
        component: () => import("@/views/EmailLog.vue"),
        meta: { title: "邮件记录" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
    meta: {
      title: "Not Found",
      hidden: true,
      hideDormSelector: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
