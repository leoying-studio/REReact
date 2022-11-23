define(function (require, factory) {
  const utils = require("utils");

  function CompositeComponent(vdom) {
    this._classComponentInstance = null;
    this._el = null;
    this._componentInstance = null;
    this._preVdom = vdom;

    this.props = vdom.props;
    this.type = vdom.type;
  }

  CompositeComponent.prototype.mount = function () {
    const instantiateReactComponent = require("instantiate");

    const { props, type } = this;
    const ClassComponentConstuctor = type;
    this._classComponentInstance = new ClassComponentConstuctor(props);
    // 很重要的一步,为这个实例化的组件添加一个属性
    this._classComponentInstance.compositeInstance = this;

    // 执行生命周期
    if (this._classComponentInstance.componentWillMount) {
      this._classComponentInstance.componentWillMount();
    }

    const vdom = this._classComponentInstance.render();
    this._componentInstance = instantiateReactComponent(vdom);
    this._el = this._componentInstance.mount();
    return this._el;
  };

  /**
   * 
   * @param {*} newState 新的状态
   * @param {*} nextvdom 下一次的vdom
   * 这个update 其实本质是对渲染规则的调用,而真正的渲染在dom中
   */
   CompositeComponent.prototype.update = function (newState, nextvdom) {
    const instantiateReactComponent = require("instantiate");

    const { state } = this._classComponentInstance;
    const nextState = Object.assign(state, newState);
    this._classComponentInstance.state = nextState;

    const nextVdom = this._classComponentInstance.render();
    const preVdom = this._componentInstance._preVdom;
    if (utils.shouldUpdateReactComponent(preVdom, nextVdom)) {
      // 上一次的组件更新
      this._componentInstance.update(nextVdom);
    } else {
      const componentInstance = instantiateReactComponent(vdom);
      const newEl = componentInstance.mount();
      this._el.parentNode.replaceChild(newEl, this._el);
      this._el = newEl;
    }
  };

  return CompositeComponent;
});
