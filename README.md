##一款用于页面组织的工具



##创建page实例
```

import $ from 'jquery';
import store from './store';
import QXC from 'qxc';
import module1 from './module1/index';
import module2 from './module2/index';

/** 定义一个页面 */
QXC.definePage({
  /** 定义页面的命名空间，页面会挂载到此命名空间，命名空间必须是唯一的, 可以为空， 如果不为空会挂载到 window的命名空间下 */
  namespace: 'PC.HOME',
  /** 页面全局相关的store */
  store,
  /** 构造函数，页面初始化时优先执行 */
  construct: (me) => {
    me.bindEvent();
  },
  /** 页面级别的动作 */
  actions: {
    init: (me, name, phone) => {
      console.log(name, phone);
    },
    /** 事件绑定 */
    bindEvent: (me) => {
      $('#aaa').bind('click', () => {
        me.init('wenjing.liang', '1234567');
      });
    }
  },
  /** 把一个页面划分成多个模块，每个模块独立管理 */
  modules: [
    {
      /** 模块对应的dom节点 */
      controller: $('#c-a'),
      module: module1
    },
    {
      controller: $('#c-b'),
      module: module2
    }
  ]
});

```

## 创建module
```

import QXC from '../qxc';
import store from './store';

/** 定义一个模块 */
const mod = QXC.defineModule({
  /** 模块自身的store, 可以不设 */
  store,
  /** 构造函数，模块初始化时优先执行 */
  construct: (me) => {
    console.log(me);
    me.bindEvent();
  },
  /** 模块渲染 */
  render: (me, ctrl, name) => {
    console.log(me, ctrl, name);
  },
  /** 模块级别的动作 */
  actions: {
    bindEvent: (me) => {
      console.log(me);
    }
  }
});

function init(ctrl, globalStore) {
  console.log(ctrl, globalStore);
  mod.render(ctrl, '123');
}

export default init;

```

## 注意
```
模块抛出时， 如果是函数会直接执行； 如果是对象，会执行对象的init方法
```
