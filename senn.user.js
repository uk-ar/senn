// ==UserScript==
// @name           senn
// @namespace      http://hoge
// @include        https://*
// @include        http://*
// @include        http://*
// ==/UserScript==
;(function(d, func) {
  var h, s1;
  h = d.getElementsByTagName('head')[0];
  s1 = d.createElement("script");
  s1.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
  s1.addEventListener('load', function() {
    var s2;
    s2 = d.createElement("script");
    s2.textContent = "jQuery.noConflict();(" + func.toString() + ")(jQuery);";
    return h.appendChild(s2);
  }, false);
  return h.appendChild(s1);
})(document, function($) {
  var $N, $X, barWidth, baseZindex, genHide, genShow, hideBar, hideGraylayer, hideKeywords, li, otherKeywords, paragraphs, showBar, showGraylayer, showKeywords, showTooltip, siteinfo, speed, tooltip, ul;
  $X = window.Minibuffer.$X;
  $N = window.Minibuffer.$N;
  $ = jQuery;
  siteinfo = window.LDRize.getSiteinfo();
  paragraphs = $X(siteinfo['paragraph']);
  baseZindex = 1000;
  speed = "fast";
  showKeywords = function(context) {
    $("div.keywords", context).stop(true, true).animate({
      "width": "show"
    }, speed);
    return $("div.base").css({
      "left": "0",
      "right": "0",
      "width": ""
    });
  };
  hideKeywords = function(context) {
    return $("div.keywords", context).animate({
      "width": "hide"
    }, speed, "swing", function() {
      return $("div.base").css({
        "left": "",
        "right": "",
        "width": barWidth
      });
    });
  };
  showBar = function(context) {
    return $("div.bar", context).show();
  };
  hideBar = function(context) {
    var keywords;
    keywords = $("div.keywords", context);
    if (keywords.is(":animated")) {
      return keywords.queue(function() {
        return $("div.bar", context).hide();
      });
    } else {
      return $("div.bar", context).hide();
    }
  };
  showGraylayer = function(callback) {
    return $("#graylayer").fadeIn(speed, callback);
  };
  hideGraylayer = function(callback) {
    return $("#graylayer").stop(true, true).fadeOut(speed, callback);
  };
  genShow = function(indexes) {
    this.indexes = indexes;
    return function() {
      var index, _fn, _i, _len;
      _fn = function(index) {
        return $(paragraphs[index]).css({
          "z-index": baseZindex + 1
        }).css({
          "background-color": "white"
        });
      };
      for (_i = 0, _len = indexes.length; _i < _len; _i++) {
        index = indexes[_i];
        _fn(index);
      }
      showGraylayer();
      return $(this).css({
        "z-index": baseZindex + 1
      });
    };
  };
  genHide = function(indexes) {
    this.indexes = indexes;
    return function() {
      $(this).css({
        "z-index": baseZindex
      });
      return hideGraylayer(function() {
        var index, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = indexes.length; _i < _len; _i++) {
          index = indexes[_i];
          _results.push((function(index) {
            return $(paragraphs[index]).css({
              "z-index": baseZindex
            });
          })(index));
        }
        return _results;
      });
    };
  };
  $("div.bar").remove();
  $("div.base").remove();
  barWidth = 30;
  $(paragraphs).each(function() {
    var bar, base, height, keywords, li, obj, ul, wrapdiv, _i, _len, _ref;
    if (window.flag != null) {
      $(this).unwrap();
    }
    height = $(this).height();
    wrapdiv = $("<div>").css({
      "position": "relative"
    });
    $(this).wrap(wrapdiv);
    wrapdiv = $(this).parent();
    wrapdiv.hover(function() {
      return showBar($(this));
    }, function() {
      return hideBar($(this));
    });
    base = $('<div>').attr("class", "base").css({
      "position": "absolute",
      "z-index": baseZindex + 3,
      "height": height,
      "width": barWidth,
      "margin-left": -barWidth,
      "opacity": 0.8,
      "float": "left"
    });
    wrapdiv.prepend(base);
    bar = $('<div>').attr("class", "bar").css({
      "background-color": "black",
      "border-radius": 8,
      "width": barWidth,
      "height": height,
      "float": "left"
    });
    base.append(bar);
    keywords = $('<div>').attr("class", "keywords").css({
      "background-color": "black",
      "position": "absolute",
      "border-radius": 8,
      "left": barWidth,
      "height": height,
      "width": 100
    });
    bar.append(keywords);
    ul = $("<ul>").css({
      "padding": 10
    });
    _ref = [["hoge", [1]], ["fuga", [0, 2]]];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      li = $('<a>').text(obj[0]).css({
        "color": "white"
      }).attr({
        "href": "http://www.google.co.jp/"
      }).wrap("<li>").hover(genShow(obj[1]), genHide(obj[1])).parent();
      ul.append(li);
    }
    bar.hide();
    keywords.hide();
    bar.hover(function() {
      return showKeywords($(this).parent());
    }, function() {
      return hideKeywords($(this).parent());
    });
    keywords.prepend(ul);
    return $(this).css({
      "z-index": baseZindex + 1
    });
  });
  baseZindex = 1000;
  $("#graylayer").remove();
  $("body").append($("<div>").attr({
    "id": "graylayer"
  }).css({
    "background": "black",
    "z-index": baseZindex,
    "opacity": 0.5,
    "position": "fixed",
    "top": 0,
    "left": 0,
    "height": "100%",
    "width": "100%",
    "display": "none"
  }));
  $(paragraphs).css({
    "z-index": baseZindex,
    "position": "relative",
    "border-radius": 8,
    "background-color": "white"
  });
  otherKeywords = $('#trev a').css({
    "position": "relative",
    "border-radius": 3,
    "background-color": "white"
  }).each(function() {});
  $(otherKeywords[0]).hover(genShow([0, 3]), genHide([0, 3]));
  $(otherKeywords[1]).hover(genShow([1]), genHide([1]));
  $("#tooltip").remove();
  ul = $("<ul>").css({
    "padding": 10
  });
  li = $('<a>').text("include").attr({
    "href": "http://www.google.co.jp/"
  }).wrap("<li>").parent();
  ul.append(li);
  li = $('<a>').text("exclude").attr({
    "href": "http://www.google.co.jp/"
  }).wrap("<li>").parent();
  ul.append(li);
  ul.wrap("<div>").parent().attr({
    "id": "tooltip"
  }).css({
    "position": "relative",
    "z-index": "1010"
  }).show().css({
    "background-color": "red"
  });
  $("body").append(ul.parent());
  tooltip = $("div#tooltip");
  showTooltip = function(e) {
    tooltip.css({
      "left": 0,
      "top": 0,
      "position": "absolute"
    }).fadeIn().css({
      "top": $(this).offset().top + 20,
      "left": $(this).offset().left + 10
    }).show();
    return console.log($(this));
  };
  $(otherKeywords[0]).hover(showTooltip, function() {
    return $("div#tooltip").fadeOut();
  });
  $(otherKeywords[1]).hover(showTooltip, function() {
    return $("div#tooltip").fadeOut();
  });
  return window.flag = 1;
});
