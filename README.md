# REReact

基于React 15 版本编写

# 创建虚拟DOM 

## React.createElement

通过React.createElement 创建虚拟dom模型， 第一个参数和第二个参数， 分别是dom类型和dom属性， 以及后面的arguments 参数可以传递无数个参数（第二个参数之后的则为children）

children 的某一个元素可以是字符串也可以是虚拟DOM(ReactElement), 由此可知，ReactElement下的children 又可以有children 如此循环则形成了一颗dom树。

手写React 框架， 内部实现了基础的功能，组件状态state管理， diff 算法等等
