# REReact

基于React 15 版本编写, 本实例采用的面向对象的思路进行开发。

## 创建虚拟DOM 

## ReactElement

**ReactElement 作为一个构造函数， 通过实例化之后成为一个虚拟dom对象模型**

ReactElement 的创建是通过暴露的React.createElement 接口来调用的。 ``` React.createElement ```方法的第一个参数和第二个参数， 分别是dom类型和dom属性， 以及后面的arguments 参
数可以传递无数个参数（第二个参数之后的则为children）, children 的某一个元素可以是字符串也可以是虚拟DOM(ReactElement), 由此可知，ReactElement下的children 又可以有children 如此循环则形成了一颗dom树。

代码演示如下： 

```
   const vdom = React.createElement("div", null, "hello", React.createElement("span", null, "world));
```

## render

render 是ReactDOM 上的一个方法， 该方法具体的任务是将虚拟dom 转换成真正的dom
