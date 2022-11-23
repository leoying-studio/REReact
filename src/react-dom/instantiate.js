define(function(require) {
    function instantiateReactComponent(vdom) {
        const TextComponent = require("text-component");
        const DOMComponent = require("dom-component");
        const CompositeComponent = require("composite-component");

        // 普通文本或者数字类型
        if (typeof vdom === "string" || typeof vdom === "number") {
            return new TextComponent(vdom);
        } 
        
        // 普通标签元素， 比如div span h1 等...
        if (typeof vdom === 'object' && typeof vdom.type === 'string') {
            return new DOMComponent(vdom);
        }

        if (typeof vdom === 'object' && typeof vdom.type === "function") {
            return new CompositeComponent(vdom);
        }
    }

    return instantiateReactComponent;
});