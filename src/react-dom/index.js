define(['instantiate'],function(instantiateReactComponent) {

   
   return {
        render: function(vdom, container) {
            // vdom 为createElement 元素
            const componentInstance = instantiateReactComponent(vdom);
            const el = componentInstance.mount();
            container.appendChild(el);
        }
    }
})