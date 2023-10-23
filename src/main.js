import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 分页组件
import Pagination from "@/components/Pagination";
import Element from "element-ui";
import "./assets/styles/element-variables.scss";
import "@/assets/styles/index.scss";
import "@/assets/styles/ruoyi.scss";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
} from "@/utils/ruoyi";
import { download } from "@/utils/request";
import modal from "@/utils/modal";

Vue.config.productionTip = false;
// eslint-disable-next-line vue/multi-word-component-names
Vue.component("Pagination", Pagination);
Vue.use(Element, {
  size: "medium",
});
// 全局方法挂载
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.$modal = modal;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
