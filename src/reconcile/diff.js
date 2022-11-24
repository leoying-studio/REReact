define(function (require, factory) {
    const utils = require("utils");
    const def = require("def");
    let diffQueue = [];
    let updateDepth = 0

    const flattenChildren = function (children) {
        const map = {};
        children.forEach(function (child, index) {
            const key = (child._preVdom && child._preVdom.key) || index;
            map[key] = child;
        })
        return map;
    }

    // 该方法会更新下一次的内容或者直接创建新的 component
    const mergeNextChildren = function (preChildrenMap, nextChildren) {
        const instantiateComponent = require("instantiate");
        const nextMap = {};
        nextChildren.forEach(function (item, index) {
            const key = item.key || index;
            const preChild = preChildrenMap[key] || {};
            const preVdom = preChild._preVdom
            if (utils.shouldUpdateReactComponent(preVdom, item)) {
                preChild.update(item);
                nextMap[key] = preChild;
            } else {
                const componentInstance = instantiateComponent(item)
                nextMap[key] = componentInstance;
            }
        })
        return nextMap;
    }

    const insertChildAt = function(item) {
        const {toIndex, parentNode, fromIndex, childNode} = item;
        const fromChild = parentNode.parentNode.children[fromIndex];

        if (fromChild) {
            fromChild.insertBefore(childNode);
        } else {
            parentNode.appendChild(childNode);
        }

        // if (!fromChild) {
        //     parentNode.parentNode.appendChild()
        // }
 
        // if (toChild) {
        //     fromChild.insertBefore(toChild);
        // } else {
        //     fromChild.parentNode.appendChild(toChild);
        // }
    }

    function Diff() {
        this._childrenInstances = [];
        this._parentNode = null;
    }

    Diff.prototype.setParentNode = function(parentNode) {
        this._parentNode = parentNode;
    }

    Diff.prototype.push = function (instance) {
        this._childrenInstances.push(instance);
    }

    Diff.prototype._replace = function (nextChildren) {
        this._childrenInstances = [];
        for (let k in nextChildren) {
            this._childrenInstances.push(nextChildren[k])
        }
    }

    Diff.prototype.updateDOMChildren = function(nextChildren) {
        updateDepth++;
        const nextChildrenArray = utils.toArray(nextChildren)
        this._sort(nextChildrenArray);
        updateDepth--;
        if (updateDepth === 0) {
            this._realign();
            diffQueue = [];
        }
    }

    // 该方法就是把整个dom组件树重新找出来根据情况进行排序，最终把排列好的存储到diffQueue数组中
    // 目前是整个dom树都会遍历执行一遍
    Diff.prototype._sort = function (nextChildren) {
        const preChildrenMap = flattenChildren(this._childrenInstances);
        const nextChildrenMap = mergeNextChildren(preChildrenMap, nextChildren);
        this._replace(nextChildrenMap);
        // 标记当前遍历的DOM组件索引
        let lastIndex = 0;
        let nextIndex = 0;

        for (let key in nextChildrenMap) {
            // react 官方版本源码中依然有这句， 但是我看来这句代码意义不大
            if (!nextChildrenMap.hasOwnProperty(key)) {
                continue;
            }
            const preChild = preChildrenMap[key];
            const nextChild = nextChildrenMap[key];
            // 如果组件完全相同的情况下
            if (preChild === nextChild) {
                // 判断如果当前索引比上次的小， 则说明在前面插入了新的节点，这个时候就需要移动， 反之如果比lastIndex 大则不需要做什么
                if (preChild._mountIndex < lastIndex) {
                    diffQueue.push({
                        parentNode: this._parentNode,
                        type: def.ELEMENT_DIFF_TYPE.MOVE_EXISTING,
                        fromIndex: preChild._mountIndex,
                        toIndex: nextIndex
                    })
                }

                lastIndex = Math.max(preChild._mountIndex, lastIndex);
            } else {
                // 不是相同的child 则是新增的(或者是替换的)

                // 判断老的是否还存在，说明是替换的，把这个移除掉
                if (preChild) {
                    // 把当前的移除掉
                    diffQueue.push({
                        parentNode: this._parentNode,
                        type: def.ELEMENT_DIFF_TYPE.REMOVE_NODE,
                        fromIndex: preChild._mountIndex,
                        toIndex: null
                    })

                    lastIndex = Math.max(preChild._mountIndex, lastIndex);
                }

                // 重新把新的添加进来
                diffQueue.push({
                    parentNode: this._parentNode,
                    type: def.ELEMENT_DIFF_TYPE.INSERT_MARKUP,
                    fromIndex: null,
                    childNode: nextChild.mount(),
                    toIndex: nextIndex
                })
            }

            nextChild._mountIndex = nextIndex;
            nextIndex++;
        }


        for (let key in preChildrenMap) {
            if (preChildrenMap.hasOwnProperty(key) && !nextChildrenMap.hasOwnProperty(key)) {
                diffQueue.push({
                    parentNode: this._parentNode,
                    type: def.ELEMENT_DIFF_TYPE.REMOVE_NODE,
                    fromIndex: preChildrenMap[key]._mountIndex,
                    toIndex: null
                });
            }
        }
       
    }

    Diff.prototype._realign = function() {
        for (const item of diffQueue) {
            // 移动或者移除的情况       
            if (item.type === def.ELEMENT_DIFF_TYPE.MOVE_EXISTING) {
                const childNode = item.parentNode.children[item.fromIndex];
                childNode.remove();
                insertChildAt(item);
            } else if (item.type === def.ELEMENT_DIFF_TYPE.INSERT_MARKUP) {
                insertChildAt(item);
            } else if (item.type === def.ELEMENT_DIFF_TYPE.REMOVE_NODE) {
                const childNode = item.parentNode.children[item.fromIndex];
                childNode.remove();
            }
        }
    }

    return Diff;
});