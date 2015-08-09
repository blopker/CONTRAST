'use strict';

var foreground = $('.foreground');
var background = $('.background');

var spectrumOpts = {
    preferredFormat: 'hex',
    showButtons: false
};

var bPicker = $('.b-picker').spectrum(spectrumOpts);
var fPicker = $('.f-picker').spectrum(spectrumOpts);
var bText = $('.b-text');
var fText = $('.f-text');

var l1 = $('.l1');
var l2 = $('.l2');
var ratio = $('.ratio');
var ratioContainer = $('.ratio-container');

var headerTest = $('.header-test');
var bodyTest = $('.body-test');


function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split('&').forEach(function(part) {
    var item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}


var init = getJsonFromUrl();
init.b = init.b || '#ffffff';
init.f = init.f || '#000000';

bPicker.spectrum('set', init.b);
fPicker.spectrum('set', init.f);
var bColor = bPicker.spectrum('get');
var fColor = fPicker.spectrum('get');


function relativeLuminance(color) {
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

    var bRgb = bColor.toRgb();
    var fRgb = fColor.toRgb();

    background.css('background', bColor.toHexString());
    foreground.css('color', fColor.toHexString());

    var digits = 2;
    l1.html(relativeLuminance(bRgb).toFixed(digits));
    l2.html(relativeLuminance(fRgb).toFixed(digits));

    var cRatio = contrastRatio(bRgb, fRgb).toFixed(digits);
    ratio.html(cRatio);

    if (cRatio < 4.5 ) {
        ratioContainer.addClass('error');
        bodyTest.html('FAIL');
    } else {
        ratioContainer.removeClass('error');
        bodyTest.html('PASS');
    }

    if (cRatio < 3 ) {
        headerTest.html('FAIL');
    } else {
        headerTest.html('PASS');
    }

    // Update URL
    var params = $.param({b: bColor.toHexString(), f: fColor.toHexString()});
    history.replaceState({}, '', '?' + params);
}

function pickerUpdate () {
    bText.val(bPicker.spectrum('get'));
    fText.val(fPicker.spectrum('get'));
    update();
}

function textUpdate () {
    bPicker.spectrum('set', bText.val());
    fPicker.spectrum('set', fText.val());
    update();
}

bPicker.on('move.spectrum', pickerUpdate);
fPicker.on('move.spectrum', pickerUpdate);
bText.on('keyup', textUpdate);
fText.on('keyup', textUpdate);

pickerUpdate();
