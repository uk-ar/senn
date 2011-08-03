// ==UserScript==
// @name           nearly search
// @namespace      http://hoge
// @include        https://*
// @include        http://*
// @include        http://*
// ==/UserScript==
;var $, $N, $X, bar, barOut, barOver, barWidth, keywords, keywordsOut, keywordsOver, keywordsWidth, list, paragraphs, siteinfo;
$X = window.Minibuffer.$X;
$N = window.Minibuffer.$N;
$ = jQuery;
siteinfo = window.LDRize.getSiteinfo();
paragraphs = $X(siteinfo['paragraph']);
keywordsWidth = 100;
keywordsOver = function() {
  return $("#keywords:not(:animated)", this).css({
    "display": "block"
  }).animate({
    "width": keywordsWidth
  }, "fast", "swing");
};
keywordsOut = function() {
  return $("#keywords:not(:animated)", this).animate({
    "width": 0
  }, "fast", "swing", function() {
    return $(this).css({
      "display": "none"
    });
  });
};
barOver = function() {
  return $("#bar:not(:animated)", this).css({
    "display": "block"
  });
};
barOut = function() {
  return $("#bar:not(:animated)", this).css({
    "display": "none"
  });
};
$("#bar").remove();
barWidth = 30;
bar = $('<div>').text('hoge').attr("id", "bar").css({
  "background": "black",
  "position": "absolute",
  "z-index": 1000,
  "border-radius": 8,
  "width": barWidth,
  "height": 200,
  "opacity": 0.8,
  "margin-left": -barWidth
}).hover(keywordsOver, keywordsOut);
keywords = $('<div>').attr("id", "keywords").css({
  "background": "black",
  "position": "absolute",
  "z-index": 1001,
  "border-radius": 8,
  "left": barWidth,
  "height": 200,
  "opacity": 1,
  "width": 0,
  "display": "none"
});
list = $('<a>').text("hoga").css({
  "color": "white"
}).attr({
  "href": "http://www.google.co.jp/"
});
keywords.prepend(list);
bar.prepend(keywords);
$(paragraphs[0]).prepend(bar);
$(paragraphs[0]).hover(barOver, barOut);
$('#trev a').each(function() {
  return $(this).hover(function() {
    return $(this).fadeTo("normal", 0.2);
  }, function() {
    return $(this).fadeTo("normal", 1);
  });
});
$("#glayLayer").remove();
$("body").append($("<div>").attr({
  "id": "glayLayer"
}).css({
  "background": "black",
  "z-index": 1000,
  "opacity": 0.8,
  "position": "fixed",
  "top": 0,
  "left": 0,
  "height": "100%",
  "width": "100%",
  "display": "none"
}));
$("#glayLayer").show();
$(paragraphs[0]).css({
  "z-index": 1003,
  "position": "relative",
  "background-color": "white"
});
paragraphs[0].scrollHeight;
