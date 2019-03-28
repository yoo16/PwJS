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
                this.node_list = document.getElementsByClassName(this.params.class_name);
            }
            return this;
        };
        this.setValue = function (value) {
            if (this.element) {
                this.element.value = value;
                return this;
            }
        };
        this.val = function () {
            if (this.element) return this.element.value;
        };
        this.value = function () {
            if (this.element) return this.element.value;
        };
        this.name = function (name) {
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
        this.check = function() {
            if (this.element) return this.element.checked;
        }
        this.checked = function () {
            if (this.node_list) {
                var selected = null;
                this.node_list.forEach(function (element) {
                    if (element.checked) return selected = element.value;
                });
            }
            return selected;
        }
        this.checkAll = function () {
            if (this.node_list) {
                this.node_list.forEach(function (element) {
                    element.checked = 1;
                });
            }
        }
        this.checkValues = function () {
            var values = new Array();
            if (this.node_list) {
                this.node_list.forEach(function (element) {
                    if (element.checked) {
                        values.push(element.value);
                        return;
                    }
                });
            }
            return values;
        }
        this.uncheckAll = function () {
            if (this.node_list) {
                this.node_list.forEach(function (element) {
                    element.checked = null;
                });
            }
        }
        this.selectValue = function (value) {
            if (this.element) {
                this.element.value = value;
                return this;
            }
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
        this.setAttr = function (key, value) {
            if (this.element) {
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
            if (!selector)
                return;
            if (this.element)
                return this.element.getAttribute(selector);
        };
        this.html = function (html) {
            if (this.element) return this.element.innerHTML = html;
        };
        this.css = function (column) {
            if (this.element) return this.element.style[column];
        }
        this.setCss = function (column, value) {
            if (this.element) this.element.style[column] = value;
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
            if (this.element) this.element.style.display = '';
        }
        this.hide = function () {
            if (this.element) this.element.style.display = 'none';
        }
        this.disabled = function () {
            if (this.element) this.element.disabled = true;
        }
        this.abled = function () {
            if (this.element) this.element.disabled = false;
        }
        this.controller = function () {
            if (this.element)
                return this.attr('pw-controller');
        };
        this.functionName = function () {
            if (this.element)
                return this.attr('pw-function');
        };
        this.action = function () {
            if (this.element)
                return this.attr('pw-action');
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
        }

        /**
         * controller class name
         *
         * @return string
         */
        this.controllerClassName = function () {
            if (!this.element)
                return;
            var controller_name = this.controller();
            if (!controller_name)
                return;
            var class_name = '';
            var names = controller_name.split('_');
            if (!names)
                return;
            names.forEach(function (name) {
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
