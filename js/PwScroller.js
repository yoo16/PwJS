/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2017 Yohei Yoshikawa (https://github.com/yoo16/)
 */

 //TODO remove jquery
'use strict';
var PwScroller = function () {
    this.motion = '';
    this.speed = 500;

    $(document).on('click', '.pw-scroller', function() {
        var node = PwNode.byElement(this);
        var action = node.action();
        if (action) pw_scroller[action](node)

        var href = node.attr('href');
        if (href) {
            var target = $(href == "#" || href == "" ? 'html' : href);
            if (target) pw_scroller.move(target)
        }
    });
    this.move = function(target) {
        var position = target.offset().top;
        $("html, body").animate({scrollTop: position}, pw_scroller.speed);
        return false;
    }
    this.top = function(node) {
        $('body,html').animate({ scrollTop: 0 }, pw_scroller.speed);
    }
    this.up = function(node) {
        var height  =  window.parent.screen.height;
        var current = window.pageYOffset || document.documentElement.scrollTop;
        $('body,html').animate({ scrollTop: current - height }, pw_scroller.speed);
    }
    this.down = function(node) {
        $('body,html').animate({ scrollTop: node.top() }, pw_scroller.speed);
    }
    this.bottom = function(node) {
        var element = document.documentElement;
        var y = element.scrollHeight - element.clientHeight;
        $('body,html').animate({ scrollTop: y }, pw_scroller.speed);
    }
}

var pw_scroller = new PwScroller();
document.addEventListener('DOMContentLoaded', function() {
});
