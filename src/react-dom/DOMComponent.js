define(function(require) {
    const apply = require("apply");
    const utils = require("utils");
    const Diff = require("diff");

   function DOMComponent(vdom) {
       const {type, props} = vdom;
       this._preVdom = vdom;
       this.type = type;
       this.props = props;
       this._el = null;
       this._diff = new Diff();
   }

   DOMComponent.prototype = Object.create(apply);

   DOMComponent.prototype.mount = function() {
       const instantiateReactComponent = require('instantiate')
        // 渲染
       this._el = document.createElement(this.type);
       this._diff.setParentNode(this._el);
       this.applyProps({}, this.props);
       const children = utils.toArray(this.props.children);
       children.forEach((child, index) => {
           const childInstance = instantiateReactComponent(child);
           childInstance._mountIndex = index;
           this._diff.push(childInstance);
           const childNode = childInstance.mount();
           this._el.appendChild(childNode);
       })
       return this._el;
   }

   DOMComponent.prototype.update = function(nextVDom) {
        this.applyProps(this.props, nextVDom.props)
        this._preVDom = nextVDom;
        this.props = nextVDom.props;
        this._diff.updateDOMChildren(nextVDom.props.children);
   }

   return DOMComponent;
});