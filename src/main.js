import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuebar from "vuebar";
import SVGIcon from "./components/ui/SVGIcon.vue";
import Tooltip from "./directives/tooltip";

Vue.config.productionTip = false;
Vue.use(Vuebar);
Vue.component("SVGIcon", SVGIcon);
Vue.directive("tooltip", Tooltip);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
