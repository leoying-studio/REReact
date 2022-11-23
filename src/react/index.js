define(function(require) {

	const utils = require("utils");

	function ReactElement(type, key, props) {
		this.type = type;
		this.key = key;
		this.props = props;
	}

	function createElement(type, config, children) {
		// type 可能是字符串也可能是一个节点对象
		const props = Object.assign({}, config)

		let key, ref
	
		// 把传入的存起来
		if (config) {
			key = config.key || null
			ref = config.ref || null
		}
	
		const args = Array.from(arguments)
		if (args.length === 3) {
			props.children = children
		} else if (args.length > 3) {
			props.children = args.slice(2)
		}
		return new ReactElement(type, key, props)
	}

	function ReactClass() {

	}

	ReactClass.prototype.setState = function(newState) {
		this.compositeInstance.update(newState)
	}

	return {
		createElement,
		createClass: function(options) {
			const Constructor =  function(props) {
				this.props = props;
				this.state = this.getInitialState ? this.getInitialState() : null;
			}
			Constructor.prototype = Object.create(new ReactClass())
			Constructor.prototype.constructor = Constructor;
			utils.mixin(Constructor.prototype, options);
			return Constructor;
		}
	}
})