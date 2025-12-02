# React Router Data Mode

学习 React Router Data Mode 的思想。

_最新还出了 Framework Mode，貌似对 SSR 支持更好，以后可以学习。_

---

## loader + actions

在最开始 React Router 只作为纯路由的工具，负责页面导航跳转，路由状态记录这些事情。  
于是进入新 page 请求逻辑是这样的：

RenderComponent(渲染组件，不带数据)-> useEffect + Fetch(获取数据)-> RenderView(渲染视图/数据)

而 React Router （个人）觉得，既然进行了路由（到了新的页面），一定与数据强耦合的（获取新的数据），  
那么完全可以在导航渲染组件之前，就把原本在`useEffect`获取数据的逻辑提前。  
于是诞生了`loader: async () => {}`，与之搭配的组件内用 Hook 是`useLoaderData()`。

---

更进一步的，既然获取数据(GET) Router 接管了，那么修改数据(PUT/PATCH/DELETE)呢？  
于是 Router 也推出了表单处理功能(`<Form>`组件)，搭配`actions`使用。  
_等用到再详细学习。_

## SSR 下的应用方式

在[对 SPA + SSR 的理解](./React%20Router%20Data%20Mode.md)中，提到了使用`loader`搭配`createStaticHandler`执行 loader，`createStaticRouter` 创建渲染组件“选择器”。
