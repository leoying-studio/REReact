define(function (require, factory) {
  const def = require("def");
  const utils = require("utils");

  return {
    applyProps: function (oldProps, newProps) {
      if (newProps) {
        for (let key in newProps) {
          if (key === def.PROPS.CHILDREN) {
            continue;
          } else if (key === def.PROPS.STYLE) {
            const styles = newProps[def.PROPS.STYLE];
            for (let attr in styles) {
              this._el.style[attr] = styles[attr];
            }
          } else {
            const flatKey = utils.levelEventName(key);
            this._el[flatKey] = newProps[key];
          }
        }
      }
    },
  };
});
