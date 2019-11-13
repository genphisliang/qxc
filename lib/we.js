
import $ from 'jquery';
// eslint-disable-next-line no-undef
const win = window;
let global = {};
const nameSpace = `PAGE_${Math.ceil(Math.random() * 10000)}`;
const KEYWOEDS = ['store', 'render'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let gPageReady = false;

// eslint-disable-next-line no-undef
$(document).ready(() => {
  gPageReady = true;
});

const WE = {
  /** 定义页面 */
  definePage: (paras) => {
    if (paras) {
      let obj = win;

      /** 处理命名空间 */
      if (paras.namespace) {
        const nameArr = paras.namespace.split('.');

        Object.keys(nameArr || []).map((i) => {
          obj[nameArr[i]] = {};
          obj = obj[nameArr[i]];
          return true;
        });

        global = obj;
      } else {
        obj[nameSpace] = {};
        global = obj[nameSpace];
      }

      /** 处理store */
      if (paras.store) {
        global.store = paras.store;
      }

      /** 如果有 actions，把actions绑定到global */
      if (paras.actions) {
        Object.keys(paras.actions).map((key) => {
          if (KEYWOEDS.indexOf(key) === -1) {
            global[key] = paras.actions[key];

            // eslint-disable-next-line func-names
            global[key] = function () {
              // eslint-disable-next-line prefer-rest-params
              paras.actions[key](global, ...arguments);
            };
          }

          return true;
        });
      }

      /** 如果有构造函数，先执行构造函数 */
      if (paras.construct) {
        paras.construct(global);
      }

      /** 处理modules, 循环执行module函数 */
      if (paras.modules) {
        Object.keys(paras.modules).map((i) => {
          const md = paras.modules[i].module;
          const typeStr = Object.prototype.toString.call(md);

          if (typeStr === '[object Object]') {
            if (md.init && Object.prototype.toString.call(md.init) === '[object Function]') {
              md.init(paras.modules[i].controller, global.store);
            }
          } else if (typeStr === '[object Function]') {
            md(paras.modules[i].controller, global.store);
          }

          return true;
        });
      }

      console.log(global);
    }
  },
  defineModule: (paras) => {
    const mod = {};

    if (paras) {
      /** 处理store */
      if (paras.store) {
        mod.store = paras.store;
      }

      /** 如果有 actions，把actions绑定到mod */
      if (paras.actions) {
        Object.keys(paras.actions).map((key) => {
          if (KEYWOEDS.indexOf(key) === -1) {
            mod[key] = paras.actions[key];

            // eslint-disable-next-line func-names
            mod[key] = function () {
              // eslint-disable-next-line prefer-rest-params
              paras.actions[key](mod, ...arguments);
            };
          }

          return true;
        });
      }

      /** 如果有构造函数，先执行构造函数 */
      if (paras.construct) {
        paras.construct(mod);
      }

      /** 把render绑定到mod */
      if (paras.render) {
        // eslint-disable-next-line func-names
        mod.render = function () {
          // eslint-disable-next-line prefer-rest-params
          const arg = arguments;
          function render() {
            paras.render(mod, ...arg);
          }

          if (gPageReady) {
            render();
          } else {
            setTimeout(() => {
              render();
            }, 100);
          }
        };
      }
    }

    return mod;
  },
  getGlobal: () => global || null,
  getGlobalStore: () => global.store || null
};

export default WE;
