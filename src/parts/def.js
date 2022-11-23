define(["react"], function(React) {
     const REACT_ELEMENT = Symbol('react.element');
     const PROPS = {
        STYLE: 'style',
        CHILDREN: 'children'
     }

     const ELEMENT_DIFF_TYPE = {
        INSERT_MARKUP: 0,
        MOVE_EXISTING: 1,
        REMOVE_NODE: 2
     }
       
     return {
         REACT_ELEMENT,
         PROPS,
         ELEMENT_DIFF_TYPE
     }
});