# REReact

基于React 15 版本编写, 本实例采用的面向对象的思路进行开发， 以下是自己在写代码中的思路总结  2022/11/28。

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

**render 是ReactDOM 上的一个方法， 该方法具体的任务是将虚拟dom 转换成真正的dom**
从上面的示例可以看出，children 本质上是可以有几种类型的
1. 单纯的字符串， 和数字类型的
2. ReactElement 类型的组件
3. 带有状态的class 组件

第二种和第三种均无法保证下面是否还有节点，所以对于树节点，初次都是需要遍历树去寻找和解析的。  最终的本质class 组件拿到render 返回的dom依然会变成ReactElement, 甚至ReactElement下的children 也会解析成第一种， 具体判断方法，可以通过虚拟dom中的type 属性来判断

完成渲染之后最终把渲染之后的dom appednChild 到外部指定的container
