'use strict';

var $ = document.querySelector.bind(document);
var console = window.console;

var foreground = $('.foreground');
var background = $('.background');

var picker1 = $('.picker1');
var value2 = $('.value2');
var picker2 = $('.picker2');
var value1 = $('.value1');

var l1 = $('.l1');
var l2 = $('.l2');
var ratio = $('.ratio');
var ratioContainer = $('.ratio-container');

var c1 = '#ffffff';
var c2 = '#000000';

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function relativeLuminance(hex) {
    var rgb = hexToRgb(hex);
    var RsRGB = rgb.r/255;
    var GsRGB = rgb.g/255;
    var BsRGB = rgb.b/255;

    var R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
    var G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
    var B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

    // For the sRGB colorspace, the relative luminance of a color is defined as:
    var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return L;
}

function contrastRatio (hex1, hex2) {
    var L1 = relativeLuminance(hex1);
    var L2 = relativeLuminance(hex2);
    var darker = L1 < L2 ? L1:L2;
    var lighter = L1 > L2 ? L1:L2;
    return (lighter + 0.05) / (darker + 0.05);
}

function update () {
    picker1.value = c1;
    picker2.value = c2;
    value1.value = c1;
    value2.value = c2;

    background.style.background = picker1.value;
    foreground.style.color = picker2.value;

    var digits = 2;
    l1.innerHTML = relativeLuminance(picker1.value).toFixed(digits);
    l2.innerHTML = relativeLuminance(picker2.value).toFixed(digits);

    var cRatio = contrastRatio(picker1.value, picker2.value).toFixed(digits);
    ratio.innerHTML = cRatio;

    if (cRatio < 4.5 ) {
        ratioContainer.className = 'error';
    } else {
        ratioContainer.className = '';
    }

}

function update1 (e) {
    c1 = e.currentTarget.value;
    update();
}

function update2 (e) {
    c2 = e.currentTarget.value;
    update();
}

picker1.addEventListener('change', update1);
value1.addEventListener('change', update1);
picker2.addEventListener('change', update2);
value2.addEventListener('change', update2);

update();
