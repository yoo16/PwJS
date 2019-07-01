/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2019 Yohei Yoshikawa (https://github.com/yoo16/)
 */
var PwNode = /** @class */ (function () {
    function PwNode(params) {
        this.init = function () {
            if (this.params.id) {
                this.element = document.getElementById(this.params.id);
            } else if (this.params.element) {
                this.element = this.params.element;
            }
            if (this.params.name) {
                this.setName(this.params.name);
                this.node_list = document.getElementsByName(this.params.name);
            }
            if (this.params.class_name) {
                this.setClassName(this.params.class_name);
                //TODO node_list type
                this.node_list = document.getElementsByClassName(this.params.class_name);
                this.html_collection = document.getElementsByClassName(this.params.class_name);
                //this.elements = Array.from(this.html_collection);
                this.elements = [].slice.call(this.html_collection);
            }
            if (this.params.query) {
                this.elements = document.querySelectorAll(this.params.query);
            }
            return this;
        };
        this.parent = function() {
            if (this.element && this.element.parentNode) {
                return PwNode.byElement(this.element.parentNode);
            }
        }
        this.remove = function() {
            if (this.element) this.element.remove();
            if (this.elements) {
                [].forEach.call(this.elements, function(element) {
                    element.parentNode.removeChild(element);
                });
            }
        }
        this.submit = function () {
            if (this.element) return this.element.submit();
        }
        this.val = function () {
            if (this.element) return this.element.value;
        };
        this.value = function () {
            if (this.element) return this.element.value;
        };
        this.getID = function () {
            if (this.element) return this.element.id;
        };
        this.setValue = function (value) {
            if (this.element) {
                this.element.value = value;
            } else if (this.node_list) {
                this.setValues(value);
            } else if (this.elements) {
                this.setValues(value);
            }
            return this;
        };
        this.setValues = function (value) {
            var elements;
            if (this.node_list) {
                elements = this.node_list;
            } else if (this.elements) {
                elements = this.elements;
            }
            if (this.node_list) [].forEach.call(elements, function(element) { setValue(element, value) });
        }
        function setValue(element, value) {
            element.value = value;
        }
        this.first = function() {
            if (this.elements) return this.elements[0];
        }
        this.last = function() {
            if (this.elements) {
                var index = this.length - 1;
                if (index <= 0) index = 0
                return this.elements[index];
            }
        }
        this.name = function () {
            if (this.name) return this.element.name;
        };
        this.setName = function (name) {
            if (name) this.name = name;
        };
        this.setClassName = function (name) {
            if (name) this.class_name = name;
        };
        this.selected = function () {
            if (this.element) return this.element.value;
        }
        this.selectedLabel = function () {
            if (this.element) {
                var index = this.element.selectedIndex;
                console.log(this.element.options);
                return this.element.options[index].text;
            }
        }
        this.check = function(is_checked) {
            if (is_checked) {
                this.element.checked = 1;
            } else {
                this.element.checked = null;
            }
        }
        this.checked = function () {
            var elements;
            if (this.node_list) {
                elements = this.node_list;
            } else if (this.elements) {
                elements = this.elements;
            }
            if (elements) {
                var checked = null;
                [].forEach.call(elements, function (element) { if (element.checked) return checked = element.value; });
                return checked;
            } else if (this.element) {
                return this.element.checked;
            }
        }
        this.toggleCheckAll = function(is_checked) {
            if (is_checked) {
                this.checkAll();
            } else {
                this.uncheckAll();
            }
        }
        this.checkAll = function () {
            var elements = null;
            if (this.node_list) elements = this.node_list;
            if (this.elements) elements = this.elements;
            if (elements) [].forEach.call(elements, function (element) { element.checked = 1; });
        }
        this.uncheckAll = function () {
            var elements = null;
            if (this.node_list) elements = this.node_list;
            if (this.elements) elements = this.elements;
            if (elements) [].forEach.call(elements, function (element) { element.checked = null; });
        }
        this.checkValue = function (value) {
            if (this.element) {
                if (value) {
                    this.element.checked = 1;
                } else {
                    this.element.checked = null;
                }
                return this;
            }
        }
        this.checkValues = function () {
            var values = new Array();
            if (this.node_list) {
                [].forEach.call(this.node_list, function (element) {
                    if (element.checked) {
                        values.push(element.value);
                        return;
                    }
                });
            }
            return values;
        }
        this.selectValue = function (value) {
            if (this.element) {
                this.element.value = value;
                return this;
            }
        }
        this.setAttr = function (key, value) {
            if (this.element) {
                //TODO remove local node?
                var node = PwNode.byElement(this.element);
                node.element.setAttribute(key, value);
                this.element.setAttribute(key, value);
                return this;
            }
        };
        this.bind = function (params) {
            if (!params)
                return;
            if (this.element)
                Object.keys(params).map(function (key) { this.element.setAttribute(key, params[key]); });
        };
        this.attr = function (selector) {
            if (!selector) return;
            if (this.element) return this.element.getAttribute(selector);
        };
        this.html = function (html) {
            if (this.element) return this.element.innerHTML = html;
            if (this.elements) [].forEach.call(this.elements, function(element) { element.innerHTML = html });
        };
        this.css = function (column) {
            if (this.element) return this.element.style[column];
        }
        this.setCss = function (column, value) {
            if (this.element) setCss(this.element, column, value);
            if (this.elements) [].forEach.call(this.elements, function(element) { setCss(element, column, value) });
        }
        function setCss(element, column, value) {
            element.style[column] = value
        }
        this.length = function () {
            if (this.elements) return this.elements.length;
        }
        this.offset = function () {
            var rect = this.element.getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var top = rect.top + scrollTop;
            return this;
        }
        this.height = function () {
            return this.element.style.height;
        }
        this.width = function () {
            return this.element.style.width;
        }
        this.top = function () {
            var rect = this.element.getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var top = rect.top + scrollTop;
            return top;
        }
        this.toggle = function (class_name) {
            if (!class_name)
                return;
            if (this.element) {
                this.element.classList.toggle(class_name);
                return this;
            }
        };
        this.show = function () {
            if (this.element) setDisplay(this.element, '');
            if (this.elements) [].forEach.call(this.elements, function(element) { setDisplay(element, '') });
        }
        this.showInline = function () {
            if (this.element) setDisplay(this.element, 'inline');
            if (this.elements) [].forEach.call(this.elements, function(element) { setDisplay(element, 'inline') });
        }
        this.hide = function () {
            if (this.element) setDisplay(this.element, 'none');
            if (this.elements) [].forEach.call(this.elements, function(element) { setDisplay(element, 'none') });
        }
        function setDisplay(element, value) {
            element.style.display = value
        }
        this.disabled = function () {
            if (this.element) setDisabled(this.element, true);
            if (this.elements) [].forEach.call(this.elements, function(element) { setDisabled(element, true) });
        }
        this.abled = function () {
            if (this.element) setDisabled(this.element, false);
            if (this.elements) [].forEach.call(this.elements, function(element) { setDisabled(element, false) });
        }
        function setDisabled(element, value) {
            if (value) {
                element.setAttribute('disabled', value);
            } else {
                element.removeAttribute('disabled');
            }
        }
        this.libName = function () {
            if (this.element) return this.attr('pw-lib');
        };
        this.controller = function () {
            if (this.element) return this.attr('pw-controller');
        };
        this.functionName = function () {
            if (this.element) return this.attr('pw-function');
        };
        this.action = function () {
            if (this.element) return this.attr('pw-action');
        };
        this.fadeOut = function () {
            this.element.classList.add('fadeout');
            var dom = this.element;
            setTimeout(function() { dom.style.display = "none"; }, 1000);
        }
        this.fadeIn = function () {
            this.element.classList.add('fadein');
            var dom = this.element;
            setTimeout(function() { dom.style.display = "block"; }, 1000);
        }
        this.closest = function(target) {
            for (let item = el; item; item = item.parentElement) {
                if (item.classList.contains(target)) {
                    return item
                }
            }
        }
        this.addClass = function(class_name) {
            this.element.classList.add(class_name);
            if (this.elements) [].forEach.call(this.elements, function(element) {
                element.classList.add(class_name);
            });
        }
        this.removeClass = function(class_name) {
            this.element.classList.remove(class_name);
            if (this.elements) [].forEach.call(this.elements, function(element) {
                element.classList.remove(class_name);
            });
        }
        this.urlQuery = function(params) {
            if (!params) return;
            var queryArray = [];
            Object.keys(params).forEach(function (key) { return queryArray.push(key + '=' + encodeURIComponent(params[key])); });
            var query = queryArray.join('&');
            return query;
        }

        /**
         * controller class name
         *
         * @return string
         */
        this.controllerClassName = function () {
            if (!this.element) return;
            var controller_name = this.controller();
            if (!controller_name) return;
            var class_name = '';
            var names = controller_name.split('_');
            if (!names) return;
            [].forEach.call(names, function (name) {
                class_name += PwNode.upperTopString(name);
            });
            class_name += 'Controller';
            return class_name;
        };
        this.params = params;
    }
    PwNode.instance = function (params) {
        var instance = new PwNode(params);
        instance.init();
        return instance;
    };
    PwNode.id = function (id) {
        if (!id) return;
        var instance = new PwNode({id: id});
        instance.init();
        return instance;
    };
    PwNode.byName = function (name) {
        var instance = new PwNode({name: name});
        instance.init();
        return instance;
    };
    PwNode.byElement = function (element) {
        var instance = new PwNode({element: element});
        instance.init();
        return instance;
    };
    PwNode.byClass = function (class_name) {
        var instance = new PwNode({class_name: class_name});
        instance.init();
        return instance;
    };
    PwNode.byQuery = function (query) {
        var instance = new PwNode({query: query});
        instance.init();
        return instance;
    }

    /**
    * upper string for top
    *
    * @param value string
    * @return string
    **/
    PwNode.upperTopString = function (value) {
        if (!value)
            return;
        var value = value.charAt(0).toUpperCase() + value.slice(1);
        var value = value.substring(0, 1).toUpperCase() + value.substring(1);
        var value = value.replace(/^[a-z]/g, function (val) { return val.toUpperCase(); });
        return value;
    };
    return PwNode;
}());
