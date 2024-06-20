import permissions from "@/scripts/json/routePerms.json";

export default [
  {
    path: "/",
    component: () => import("@/layouts/main.vue"),
    children: [
      {
        path: "/",
        name: "HomePage",
        component: () => import("@/pages/home/index.vue"),
        // redirect: {
        //   name: "settings",
        // },
        meta: {
          title: import.meta.env.VITE_PRODUCT_NAME,
        },
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/pages/profile/index.vue"),
        meta: {
          title: "Profile",
          requiresAuth: true,
        },
      },
      {
        path: "settings",
        component: () => import("@/pages/settings/index.vue"),
        name: "settings-container",
        meta: {
          title: "Settings",
          requiresAuth: true,
          requiresVerified: true,
        },
        children: [
          {
            name: 'par',
            path: 'are',
            component: () => import("@/pages/par/par.vue"),
          },
          {
            name: 'par-create',
            path: 'are/create',
            component: () => import("@/pages/par/parCreate.vue"),
          },
          {
            name: 'par-show',
            path: 'are/:id',
            component: () => import("@/pages/par/parItem.vue"),
          },
          {
            name: 'par-update',
            path: 'are/:id',
            component: () => import("@/pages/par/parUpdate.vue"),
          },
          {
            name: 'employee',
            path: 'employee',
            component: () => import("@/pages/employee/employee.vue"),
          },
          {
            name: 'employee-create',
            path: 'employee',
            component: () => import("@/pages/employee/employeeCreate.vue"),
          },
          {
            name: 'employee-show',
            path: 'employeeid',
            component: () => import("@/pages/employee/employeeItem.vue"),
          },
          {
            name: "settings",
            path: "/dashboard",
            component: () => import("@/pages/settings/dashboard/index.vue"),
            meta: {
              title: "Dashboard",
            },
          },
          {
            name: "settings-genders",
            path: "/settings/genders",
            component: () => import("@/pages/settings/genders/index.vue"),
            meta: {
              title: "Genders",
              permissions: permissions["settings-genders"],
            },
          },

          {
            path: "/settings/users/:id?",
            component: () => import("@/pages/settings/users/index.vue"),
            name: "settings-users",
            meta: {
              title: "Users",
              permissions: permissions["settings-users"],
            },
          },
          {
            path: "/settings/permissions",
            component: () => import("@/pages/settings/permissions/index.vue"),
            name: "settings-permissions",
            meta: {
              title: "Permissions",
              permissions: [], // Providing empty array means only admin can access this page
            },
          },
          {
            path: "/settings/roles",
            component: () => import("@/pages/settings/roles/index.vue"),
            name: "settings-roles",
            meta: {
              title: "User Roles",
              permissions: permissions["settings-roles"],
            },
            children: [
              {
                path: "/e/:id?",
                name: "settings-roles-edit",
                component: () =>
                  import("@/pages/settings/roles/editor/index.vue"),
                meta: {
                  title: "Role Editor",
                },
              },
            ],
          },

          {
            path: "/settings/logs",
            component: () => import("@/pages/settings/systemLogs/index.vue"),
            name: "settings-logs",
            meta: {
              title: "Logs",
              permissions: [],
            },
          },

          {
            path: "privacy-policy",
            component: () =>
              import("@/pages/settings/privacy_policy/index.vue"),
            meta: {
              title: "Privacy Policy",
              permissions: [],
            },
            children: [
              {
                path: "",
                name: "privacy-settings",
                component: () =>
                  import("@/pages/settings/privacy_policy/list.vue"),
              },
              {
                path: "p/:id",
                name: "privacy-settings-preview",
                component: () =>
                  import("@/pages/settings/privacy_policy/preview/index.vue"),
                meta: {
                  title: "Privacy Policy",
                  permissions: [],
                },
              },
              {
                path: "editor/:id?",
                name: "privacy-settings-editor",
                component: () =>
                  import("@/pages/settings/privacy_policy/editor.vue"),
                meta: {
                  title: "Privacy Policy",
                  permissions: [],
                },
              },
            ],
          },
        ],
      },
      {
        path: "/privacy-policy",
        name: "privacy-policy",
        component: () => import("@/pages/privacy_policy/index.vue"),
        meta: {
          title: "Privacy Policy",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/auth.vue"),
    children: [
      {
        path: "/login",
        name: "login",
        component: () => import("@/pages/authentication/login.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "/register",
        name: "register",
        component: () => import("@/pages/registration/index.vue"),
      },
      {
        path: "/email/verify/:id",
        name: "verify",
        component: () => import("@/pages/authentication/verifyEmail.vue"),
        meta: {
          title: "Verify Email",
        },
      },
      {
        path: "/profile/update",
        name: "update-profile",
        component: () => import("@/pages/authentication/profileUpdate.vue"),
        meta: {
          title: "Update Profile!",
          requiresAuth: true,
        },
      },
      {
        path: "/password/forgot",
        name: "forgot-password",
        component: () => import("@/pages/authentication/forgotPassword.vue"),
        meta: {
          title: "Forgot Password?",
          requiresAuth: false,
        },
      },
      {
        path: "/password/reset/:token",
        name: "reset-password",
        component: () => import("@/pages/authentication/resetPassword.vue"),
        meta: {
          title: "Reset Password!",
          requiresAuth: false,
        },
      },
      {
        path: "/unverified",
        name: "unverified",
        component: () => import("@/pages/error/unverified.vue"),
        meta: {
          title: "Unverified account!",
          requiresAuth: true,
        },
      },
      {
        path: "/unauthorized",
        name: "401",
        component: () => import("@/pages/error/401.vue"),
        meta: {
          title: "Unauthorized",
        },
      },
      {
        path: "/forbidden",
        name: "403",
        component: () => import("@/pages/error/403.vue"),
        meta: {
          title: "Forbidden",
        },
      },
      // Always leave this as last one,
      // but you can also remove it
      {
        path: "/:pathMatch(.*)*",
        name: "notFound",
        component: () => import("@/pages/error/404.vue"),
        meta: {
          title: "Not Found",
        },
      },
    ],
  },
];
