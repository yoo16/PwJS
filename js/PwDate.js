/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2018 Yohei Yoshikawa (https://github.com/yoo16/)
 */

document.addEventListener('DOMContentLoaded', function() {
});

var PwDate = function() {
    this.from_selector = 'from-at';
    this.to_selector = 'to-at';

    this.setFromSelector = function(from_selector) {
        this.from_selector = from_selector;
    }
    this.setToAtSelector = function(to_selector) {
        this.to_selector = to_selector;
    }
    this.unixToString = function(time) {
        var date = new Date(time);
        var year  = date.getFullYear();
        var month = date.getMonth() + 1;
        var day  = date.getDate();
        var hour = ( '0' + date.getHours() ).slice(-2);
        var min  = ( '0' + date.getMinutes() ).slice(-2);
        var sec   = ( '0' + date.getSeconds() ).slice(-2);
        return (year + '/' + month + '/' + day + ' ' + hour + ':' + min);
    }
    this.unixToDateString = function(time) {
        var date = new Date(time);
        var year  = date.getYear() - 100;
        var month = date.getMonth() + 1;
        var day  = date.getDate();
        var hour = ( '0' + date.getHours() ).slice(-2);
        var min  = ( '0' + date.getMinutes() ).slice(-2);
        var sec   = ( '0' + date.getSeconds() ).slice(-2);
        return (year + '/' + month + '/' + day);
    }
    this.nextDate = function(value) {
        if (!value) return;

        var date = new Date(value)
        date.setDate(date.getDate() + 1);
        var value = this.string(date);
        return value;
    }  
    this.prevDate = function(value) {
        var date = new Date(value)
        date.setDate(date.getDate() - 1);
        var value = this.string(date);
        return value;
    }
    this.replaceAllHyphen = function(value) {
        if (!value) return;
        value = value.toString();
        value = value.replace(/-/g, "/");
        return value;
    }
    this.string = function(value) {
        if (!value) return;
        value = this.replaceAllHyphen(value);

        var year = 0;
        var month = 0;
        var day = 0;
        var date = new Date(value)
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hour = date.getHours();
        minute = date.getMinutes();

        if (!(year > 1900)) return;
        if (!(month > 0)) return;
        if (!(day > 0)) return;

        var year = ('0000' + year).slice(-4);
        var month = ('00' + month).slice(-2);
        var day = ('00' + day).slice(-2);
        var hour = ('00' + hour).slice(-2);
        var minute = ('00' + minute).slice(-2);

        var number = year + '/' + month + '/' + day + ' ' + hour + ':' + minute;

        return number;
    }    
    this.number = function(value) {
        if (!value) return;
        value = this.replaceAllHyphen(value);

        var date = new Date(value)
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hour = date.getHours();
        minute = date.getMinutes();

        var year = ('0000' + year).slice(-4);
        var month = ('00' + month).slice(-2);
        var day = ('00' + day).slice(-2);
        var hour = ('00' + hour).slice(-2);
        var minute = ('00' + minute).slice(-2);

        var number = year + month + day + hour + minute;
        return number;
    }
    this.zeroMinute = function(value) {

    }
    this.limitToday = function(value) {
        if (!value) return;
        value = this.replaceAllHyphen(value);

        var date = new Date(value);
        var today = new Date();
        if (date.getTime() > today.getTime()) {
            today.setMinutes(0);
            return this.string(today);
        } else {
            return this.string(value);
        }
    }
    this.updateFromToComponent = function(value) {
        if (value.from_at) {
            PwNode.id(this.from_selector).setValue(this.string(value.from_at));
        }
        if (value.to_at) {
            PwNode.id(this.to_selector).setValue(this.string(value.to_at));
        }
    }
    this.convertGraphDate = function(value) {
        var date = new Date(value * 1000); 
        var year = date.getYear() - 100;
        var month = date.getMonth() + 1;
        var day = date.getDate();
        //var hour = date.getHours();
        //var date_string = year + '/' + month + '/' + day + ' ' + hour;
        var date_string = year + '/' + month + '/' + day;
        return date_string;
    }

}

var pw_date = new PwDate();