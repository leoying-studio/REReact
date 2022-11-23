define(function() {

    function TextComponent(text) {
        this._preVdom = text;
        this._text = text;
        this._textNode = null;
    }

    TextComponent.prototype.mount = function() {
        this._textNode = document.createTextNode(this._text)
        return this._textNode
    }

    TextComponent.prototype.update = function(nextText) {
        // 不一样的时候直接替换该节点
        if (nextText !== this._text) {
            this._textNode.nodeValue = nextText;
        }
    }
    
    return TextComponent;
});