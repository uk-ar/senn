
// ==UserScript==
// @name           senn
// @namespace      http://hoge
// @include        https://*
// @include        http://*
// @include        http://*
// ==/UserScript==
;var GM_wait, jQuery, letsJQuery;
console.log = unsafeWindow.console.log;
unsafeWindow.Minibuffer = window.Minibuffer;
unsafeWindow.LDRize = window.LDRize;
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
  var $, $N, $X, D, a, api_url, barWidth, baseZindex, genHide, genShow, get_url, grayZindex, graylayer, hideBar, hideGraylayer, hideKeywords, hideParagraphs, hideTooltip, keyword, li, otherKeywords, paragraphs, post_data, root_divs, showBar, showGraylayer, showKeywords, showParagraphs, showTooltip, siteinfo, speed, tooltip, ul, wordsIndex, _i, _len;
  $X = window.Minibuffer.$X;
  $N = window.Minibuffer.$N;
  $ = jQuery;
  siteinfo = window.LDRize.getSiteinfo();
  paragraphs = $($X(siteinfo['paragraph']));
  baseZindex = 1000;
  grayZindex = 1000;
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
  otherKeywords = $('#trev a');
  graylayer = $("#graylayer");
  showGraylayer = function() {
    var id;
    id = graylayer.data('timer');
    console.log("ct" + id);
    clearTimeout(id);
    console.log("showGray");
    graylayer.stop(true, true).fadeIn(speed);
  };
  hideGraylayer = function(callback) {
    var id;
    graylayer.data('timer', setTimeout(function() {
      console.log("hideGray");
      graylayer.stop(true, true).fadeOut(speed);
    }, 500));
    id = graylayer.data('timer');
    return console.log("st" + id);
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
      return showGraylayer();
    };
  };
  genHide = function(indexes) {
    this.indexes = indexes;
    return function() {
      var index2;
      console.debug("genHide");
      index2 = wordsIndex[$(this).text()];
      console.info(index2);
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
    var bar, base, check, height, keywords, li, paragraph, select, ul, wrapdiv;
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
    }).wrap("<li>").parent();
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
      "height": height,
      "width": 100
    });
    base.append(keywords);
    select.hide();
    bar.hide();
    keywords.hide();
    return paragraph.css({
      "z-index": baseZindex + 1
    });
  });
  $("#graylayer").remove();
  $("body").append($("<div>").attr({
    "id": "graylayer"
  }).css({
    "z-index": grayZindex
  }));
  $(paragraphs).css({
    "z-index": baseZindex,
    "position": "relative",
    "border-radius": 8,
    "background-color": "white"
  });
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
    var that;
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
  $(otherKeywords[0]).hover(showTooltip, hideTooltip);
  $(otherKeywords[1]).hover(showTooltip, hideTooltip);
  $(paragraphs[0]).mouseenter();
  $("div.bar:eq(0)").show();
  $("div.select:eq(0)").show();
  $("div.keywords:eq(0)").show();
  $(paragraphs[1]).mouseenter();
  $("div.bar:eq(1)").show();
  $("div.select:eq(1)").show();
  $("div.keywords:eq(1)").show();
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
    var i, inverted_index, keyword, ret, root_div, word, words, words_index, _i, _len, _len2;
    ret = JSON.parse(response.responseText);
    console.log(ret);
    window.Minibuffer.status('Preload2', "Preloading2... " + ret.status + ".", 3000);
    words_index = ret.words_index;
    inverted_index = ret.inverted_index;
    for (i = 0, _len = root_divs.length; i < _len; i++) {
      root_div = root_divs[i];
      ul = $("<ul>");
      words = words_index[i];
      for (_i = 0, _len2 = words.length; _i < _len2; _i++) {
        word = words[_i];
        a = $('<a>').text(word).wrap("<li>").mouseover(function() {
          word = $(this).text();
          console.log(word);
          console.log(inverted_index[word]);
        }).mouseout(function() {});
        ul.append(a.parent());
      }
      keyword = $("div.keywords", root_div);
      keyword.prepend(ul);
    }
  });
  root_divs = paragraphs.parent();
  for (_i = 0, _len = otherKeywords.length; _i < _len; _i++) {
    keyword = otherKeywords[_i];
    $(keyword).prepend($("<div>").attr({
      "class": "dummy"
    }));
  }
  console.log($("div.dummy"));
  $("div.dummy").hover(showGraylayer, hideGraylayer);
  return window.flag = 1;
};
GM_addStyle('div.base div {\n		background-color: black;\n		border-radius: 8px 8px 8px 8px;\n		float: left;\n		color: white;								/* for explain text */\n}\ndiv.base li {\n		padding-top: 3px;\n		padding-bottom: 3px;\n		padding-left: 10px;\n		color: #BFBFBF;\n}\ndiv.base li:hover {\n		background-color: rgba(255, 255, 255, 0.1);\n		color: #FFFFFF;\n}\n#trev a {\n		border-radius: 15px;\n		position: relative;					/*for tooltip */\n    /* line-height: 30px; */\n    margin-right: 10px;\n    /* padding: 5px 15px; */\n}\n#trev a:hover {\n		background-color: #FFFFFF;\n		z-index:1001;\n}\ndiv.dummy {\n    top: 0;\n		bottom: 0;\n    left: 0;\n		right: 0;\n    position: absolute;\n    z-index: 1001;\n}\n#graylayer {\n		background-color:black;\n    opacity: 0.5;\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    top: 0;\n    left: 0;\n		display: none;\n}');