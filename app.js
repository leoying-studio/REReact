requirejs.config({
    baseUrl: "src",
    paths: {
        react: "react/index",
        "react-dom": "react-dom/index",
        "apply": "parts/apply",
        "composite-component": "react-dom/CompositeComponent",
        "dom-component": "react-dom/DOMComponent",
        "text-component": "react-dom/TextComponent",
        "instantiate": "react-dom/instantiate",
        "def": "parts/def",
        "utils": "parts/utils",
        "diff": "reconcile/diff"
    }
})

require(["react", "react-dom"], function(React, ReactDOM) {

    const left = React.createClass({
        getInitialState: function() {
            return {
                count: 0
            }
        },
        render() {
            const { count } = this.state;
            return React.createElement("span", null, count);
        },
        componentWillMount() {
            setInterval(() => {
                this.setState({
                    count: this.state.count + 1
                });
            }, 1000)
        }
    })

    const Counter = function() {
        return React.createClass({
            getInitialState: function() {
                return {
                    count: 0
                }
            },
            render() {
                const { count } = this.state;
                return React.createElement("div", null, count, React.createElement(left));
            },
            componentWillMount() {
                setInterval(() => {
                    this.setState({
                        count: this.state.count + 1
                    });
                }, 1000)
            }
        })
    }

    const TodoList = React.createClass({
        getInitialState: function() {
            return { items: [], text: "" };
        },
        add: function() {
            var nextItems = this.state.items.concat([this.state.text]);
            this.setState({ items: nextItems, text: "" });
        },
        remove: function(index) {
            this.state.items.splice(index, 1);
            this.setState({
                items: [...this.state.items]
            })
        },
        onChange: function(e) {
            this.setState({ text: e.target.value });
        },
        render: function() {
            var self = this;
            var createItem = function(itemText, index) {
                return React.createElement("div", {
                    onclick: self.remove.bind(self, index),
                }, itemText);
            };
    
            var lists = this.state.items.map(createItem);
            var input = React.createElement("input", {
                onkeyup: this.onChange.bind(this),
                value: this.state.text
            });
            var button = React.createElement(
                "button", { onclick: this.add.bind(this) },
                "添加"
            );
            var children = [input, button].concat(lists);
    
            return React.createElement("div", null, children);
        }
    });
    

    const vdom = React.createElement(TodoList);
    ReactDOM.render(vdom, document.getElementById("app"))
})