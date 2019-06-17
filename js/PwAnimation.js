/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2019 Yohei Yoshikawa (https://github.com/yoo16/)
 */

 //TODO remove jquery
'use strict';
var PwAnimation = function () {
    this.motion = '';
    this.speed = 1000;
    this.is_moving = false;

    this.easing = function(p) {
        return p * p; 
    }
}

var pw_animation = new PwAnimation();
document.addEventListener('DOMContentLoaded', function() {
    let elements = document.querySelectorAll('.pw-animation');
    [].forEach.call(elements, function(element) {

    });
});
