
// ==UserScript==
// @name           senn
// @namespace      http://hoge
// @include        https://*
// @include        http://*
// @include        http://*
// ==/UserScript==
;var GM_wait, jQuery, letsJQuery;
jQuery = 0;
GM_wait = function() {
  if (typeof unsafeWindow.jQuery === 'undefined') {
    return window.setTimeout(GM_wait, 100);
  } else {
    jQuery = unsafeWindow.jQuery.noConflict(true);
    return letsJQuery();
  }
};
(function() {
  var GM_Head, GM_JQ;
  if (typeof unsafeWindow.jQuery === 'undefined') {
    GM_Head = document.getElementsByTagName('head')[0] || document.documentElement;
    GM_JQ = document.createElement('script');
    GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
    GM_JQ.type = 'text/javascript';
    GM_JQ.async = true;
    GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
  }
  return GM_wait();
})();
letsJQuery = function() {
  var $, $N, $X, D, a, api_url, barWidth, baseZindex, genHide, genShow, get_url, hideBar, hideGraylayer, hideKeywords, hideParagraphs, hideTooltip, li, otherKeywords, paragraphs, post_data, showBar, showGraylayer, showKeywords, showParagraphs, showTooltip, siteinfo, speed, tooltip, ul, wordsIndex;
  $X = window.Minibuffer.$X;
  $N = window.Minibuffer.$N;
  $ = jQuery;
  siteinfo = window.LDRize.getSiteinfo();
  paragraphs = $X(siteinfo['paragraph']);
  baseZindex = 1000;
  speed = "fast";
  wordsIndex = {
    "ruby on rails": [0, 2],
    "ruby 入門": [1]
  };
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
    console.warn("showGray");
    return $("#graylayer").stop(true, true).fadeIn(speed, callback);
  };
  hideGraylayer = function(callback) {
    console.warn("hideGray");
    return $("#graylayer").stop(true, true).fadeOut(speed, callback);
  };
  genShow = function(indexes) {
    this.indexes = indexes;
    return function() {
      var index, index2, _fn, _i, _len;
      console.debug("genShow");
      index2 = wordsIndex[$(this).text()];
      console.info(index2);
      _fn = function(index) {
        console.info(index);
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
      console.info($(this));
      showGraylayer();
      return $(this).css({
        "z-index": baseZindex + 5
      });
    };
  };
  genHide = function(indexes) {
    this.indexes = indexes;
    return function() {
      var index2;
      console.debug("genHide");
      index2 = wordsIndex[$(this).text()];
      console.info(index2);
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
  showParagraphs = function(word) {
    var index, index2, _fn, _i, _len;
    console.group("showP");
    index2 = wordsIndex[word];
    console.warn(index2);
    _fn = function(index) {
      console.warn("sh" + index);
      return $(paragraphs[index]).css({
        "z-index": baseZindex + 1
      }).css({
        "background-color": "white"
      });
    };
    for (_i = 0, _len = index2.length; _i < _len; _i++) {
      index = index2[_i];
      _fn(index);
    }
    showGraylayer();
    return console.groupEnd("showP");
  };
  hideParagraphs = function(word) {
    var index2;
    console.group("hideP");
    index2 = wordsIndex[word];
    console.warn(index2);
    hideGraylayer(function() {
      var index, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = index2.length; _i < _len; _i++) {
        index = index2[_i];
        _results.push((function(index) {
          console.warn("hi" + index);
          return $(paragraphs[index]).css({
            "z-index": baseZindex
          });
        })(index));
      }
      return _results;
    });
    return console.groupEnd("hideP");
  };
  $("div.bar").remove();
  $("div.base").remove();
  barWidth = 30;
  $(paragraphs).each(function() {
    var a, bar, base, check, height, keywords, li, paragraph, select, ul, word, wrapdiv, _i, _len, _ref;
    paragraph = $(this);
    if (window.flag != null) {
      paragraph.unwrap();
    }
    height = paragraph.height();
    wrapdiv = $("<div>").css({
      "position": "relative"
    });
    paragraph.wrap(wrapdiv);
    wrapdiv = paragraph.parent();
    base = $('<div>').attr("class", "base").css({
      "position": "absolute",
      "z-index": baseZindex + 3,
      "height": height,
      "margin-left": -barWidth,
      "opacity": 0.8
    }).css({
      "background-color": "red"
    });
    wrapdiv.prepend(base);
    bar = $('<div>').attr("class", "bar").css({
      "width": barWidth,
      "height": height
    });
    base.append(bar);
    check = $('<input type="checkbox"/>').attr({
      "position": "absolute"
    });
    bar.append(check);
    select = $('<div>').attr("class", "select").text("この文書を").css({
      "height": height
    });
    ul = $("<ul>").css({
      "padding": 10,
      "border-radius": 3,
      "list-style-type": "none"
    });
    li = $('<a>').text("含む").attr({
      "href": "http://www.google.co.jp/"
    }).css({
      "color": "white",
      "float": "right"
    }).wrap("<li>").parent();
    check = $('<input type="checkbox"/>').attr({
      "position": "absolute"
    });
    li.prepend(check);
    ul.append(li);
    li = $('<a>').text("除外する").attr({
      "href": "http://www.google.co.jp/"
    }).css({
      "color": "white",
      "float": "right"
    }).wrap("<li>").parent();
    check = $('<input type="checkbox"/>').attr({
      "position": "absolute"
    });
    li.prepend(check);
    ul.append(li);
    select.append(ul);
    base.append(select);
    keywords = $('<div>').attr("class", "keywords").css({
      "background-color": "black",
      "border-radius": 8,
      "top": 0,
      "left": barWidth,
      "height": height,
      "width": 200,
      "float": "left"
    });
    base.append(keywords);
    ul = $("<ul>").css({
      "padding": 10
    });
    _ref = ["W3C", "タグ", "ルビ"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      word = _ref[_i];
      a = $('<a>').text(word).css({
        "color": "white"
      }).attr({
        "href": "http://www.google.co.jp/"
      }).wrap("<li>").hover(genShow(wordsIndex[word]), genHide(wordsIndex[word]));
      ul.append(a.parent());
    }
    select.hide();
    bar.hide();
    keywords.hide();
    keywords.prepend(ul);
    return paragraph.css({
      "z-index": baseZindex + 1
    });
  });
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
  });
  $(otherKeywords[0]).hover(genShow([0, 3]), genHide([0, 3]));
  $(otherKeywords[1]).hover(genShow([1]), genHide([1]));
  $("#tooltip").remove();
  ul = $("<ul>").css({
    "padding": 10,
    "background-color": "blue",
    "border-radius": 3,
    "list-style-type": "none"
  });
  li = $('<a>').text("include").attr({
    "href": "http://www.google.co.jp/"
  }).css({
    "color": "white"
  }).wrap("<li>").parent();
  ul.append(li);
  a = $('<a>').text("exclude").attr({
    "href": "http://www.google.co.jp/"
  }).css({
    "color": "white"
  }).wrap("<li>").hover(function(e) {
    var link, word;
    link = $(e.target).parents("a").first();
    word = link[0].firstChild.data;
    hideParagraphs(word);
    $("#graylayer").stop(true, true);
    showParagraphs(word);
    return console.error("show");
  }, function() {
    return console.error("hide");
  });
  ul.append(a.parent());
  ul.wrap("<div>").parent().attr({
    "id": "tooltip"
  }).css({
    "position": "relative",
    "z-index": "1010"
  }).show();
  $("body").append(ul.parent());
  tooltip = $("div#tooltip");
  showTooltip = function(e) {
    var graylayer, that;
    console.debug("showTooltip");
    graylayer = $("#graylayer");
    that = this;
    return graylayer.queue(function() {
      console.debug("act1:showTooltip");
      console.debug(that);
      tooltip.stop(true, true).css({
        "left": $(that).width(),
        "top": 0,
        "position": "absolute",
        "padding-left": 10
      }).slideDown(speed);
      return tooltip.appendTo(that);
    });
  };
  hideTooltip = function(e) {
    console.debug("hideTooltip");
    return $("div#tooltip").stop(true, true).slideUp(speed);
  };
  $("a", $("div.keywords").first()).first().css({
    "position": "relative"
  }).hover(showTooltip, hideTooltip);
  $("a:eq(1)", $("div.keywords").first()).css({
    "position": "relative"
  }).hover(showTooltip, hideTooltip);
  $(otherKeywords[0]).css({
    "position": "relative"
  }).hover(showTooltip, hideTooltip);
  $(otherKeywords[1]).css({
    "position": "relative"
  }).hover(showTooltip, hideTooltip);
  $(paragraphs[0]).mouseenter();
  $("div.bar:eq(0)").show();
  $("div.select:eq(0)").show();
  $("div.keywords:eq(0)").show();
  D = window.Minibuffer.D();
  api_url = "http://localhost:3000/api";
  D.xhttp.post_j = function(url, data) {
    return D.xhttp({
      method: "post",
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/json; charset = utf-8"
      }
    });
  };
  get_url = function(node) {
    var _ref;
    return (_ref = $X(siteinfo['link'], node)) != null ? _ref[0].href : void 0;
  };
  post_data = JSON.stringify({
    all_urls: $X(siteinfo['paragraph']).map(get_url)
  });
  window.Minibuffer.status('Preload2', 'Preloading2...');
  D.xhttp.post_j(api_url + "/preload2", post_data).next(function(response) {
    var ret;
    ret = JSON.parse(response.responseText);
    console.log(ret);
    console.log("post f");
    console.log(ret.status);
    window.Minibuffer.status('Preload2', 'Preloading2... ' + ret.status(+'.', 300));
    return true;
  });
  return window.flag = 1;
};
GM_addStyle('div.base div {\n  background-color: black;\n  border-radius: 8px 8px 8px 8px;\n  color: white;\n  float: left;\n}');