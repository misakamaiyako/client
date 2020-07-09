import { defineConfig } from "umi";

export default defineConfig({
	nodeModulesTransform: {
		type: "none",
	},
	proxy: {
		"/api": {
			target: "http://localhost:443/",
			changeOrigin: true,
			pathRewrite: { "^/api": "" },
		},
	},
	routes: [
		{ path: "/login", component: "@/pages/login" },
		{ path: "/", component: "@/pages/index" },
	],
});
