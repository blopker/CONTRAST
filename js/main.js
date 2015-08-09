'use strict';

var foreground = $('.foreground');
var background = $('.background');

var spectrumOpts = {
    preferredFormat: 'hex',
    showButtons: false
};

var bPicker = $('.b-picker').spectrum(spectrumOpts);
var bText = $('.b-text');
var fPicker = $('.f-picker').spectrum(spectrumOpts);
var fText = $('.f-text');

var l1 = $('.l1');
var l2 = $('.l2');
var ratio = $('.ratio');
var ratioContainer = $('.ratio-container');

var bColor = bPicker.spectrum('get');
var fColor = fPicker.spectrum('get');

function relativeLuminance(color) {
    color = color.toRgb();
    var RsRGB = color.r / 255;
    var GsRGB = color.g / 255;
    var BsRGB = color.b / 255;

    var R = (RsRGB <= 0.03928) ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    var G = (GsRGB <= 0.03928) ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    var B = (BsRGB <= 0.03928) ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

    // For the sRGB colorspace, the relative luminance of a color is defined as:
    var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return L;
}

function contrastRatio (b, f) {
    var L1 = relativeLuminance(b);
    var L2 = relativeLuminance(f);
    var darker = L1 < L2 ? L1 : L2;
    var lighter = L1 > L2 ? L1 : L2;
    return (lighter + 0.05) / (darker + 0.05);
}

function update () {
    bColor = bPicker.spectrum('get');
    fColor = fPicker.spectrum('get');

    background.css('background', bColor.toHexString());
    foreground.css('color', fColor.toHexString());

    var digits = 2;
    l1.html(relativeLuminance(bColor).toFixed(digits));
    l2.html(relativeLuminance(fColor).toFixed(digits));

    var cRatio = contrastRatio(bColor, fColor).toFixed(digits);
    ratio.html(cRatio);

    if (cRatio < 4.5 ) {
        ratioContainer.addClass('error');
    } else {
        ratioContainer.removeClass('error')
    }

}

function pickerUpdate (e) {
    bText.val(bColor.toHexString());
    fText.val(fColor.toHexString());
    update();
}

function textUpdate (e) {
    bPicker.spectrum('set', bText.val());
    fPicker.spectrum('set', fText.val());
    update();
}

bPicker.on('move.spectrum', pickerUpdate);
fPicker.on('move.spectrum', pickerUpdate);
bText.on('keyup', textUpdate);
fText.on('keyup', textUpdate);

pickerUpdate();
