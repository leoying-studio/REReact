define(function() {
    function isUndef(v) {
        return typeof v === 'undefined'
    }
  
    function isEmpty(val) {
        return isUndef(val) || val === null
    }
  
    function toArray(o) {
        if (isEmpty(o)) {
            return []
        }
        return Array.isArray(o) ? o : [o]
    }
  
    function isValidTextElement(el) {
        return el && el.nodeName === '#text'
    }
  
    function toLower(str) {
        const reg = /([A-Z])/g
        return str.replace(reg, function (a, b) {
            return b.toLowerCase()
        })
    }

    function isClassComponent(vdom) {
        return typeof vdom === 'object' && typeof vdom.type === 'function'
    }

    function levelEventName(key) {
        if(key.startsWith('on')) {
            return toLower(key);
        }
        return key;
    }

    function mixin(to, from) {
        for (let key in from) {
            to[key] = from[key]
        }
    }

    function shouldUpdateReactComponent(preVDom, nextVDom) {  
        const preType = typeof preVDom;
        const nextType = typeof nextVDom;

        if (isEmpty(preVDom) || isEmpty(nextVDom)) {
            return false;
        }

        // 第一种情况, 单纯的文本内容
        if (preType === "string" || preType === 'number') {
            return nextType === 'string' || nextType === 'number'
        }

        return (
            nextType === "object" &&
            preVDom.type === nextVDom.type &&
            preVDom.key === nextVDom.key
          );
    }

    return {
        toArray,
        isValidTextElement,
        isUndef,
        isEmpty,
        toLower,
        levelEventName,
        isClassComponent,
        shouldUpdateReactComponent,
        mixin
    }
})