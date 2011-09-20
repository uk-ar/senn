
// ==UserScript==
// @name           senn
// @namespace      http://hoge
// @include        https://*
// @include        http://*
// @include        http://*
// @resource       jquery    http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// ==/UserScript==
;var GM_wait, i, jQuery, letsJQuery, p, waitMinibuffer;
console.log = unsafeWindow.console.log;
p = console.log;
letsJQuery = function() {
  var $, $N, $X, D, a, api_url, barWidth, baseZindex, genHide, genShow, get_url, grayZindex, graylayer, hideBar, hideGraylayer, hideKeywords, hideParagraphs, hideTooltip, li, num, otherKeyword, paragraphs, post_data, root_divs, showBar, showGraylayer, showKeywords, showParagraphs, showTooltip, siteinfo, speed, tooltip, ul, wordsIndex, _fn, _ref;
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
  graylayer = $("<div>").attr({
    "id": "graylayer"
  }).css({
    "z-index": grayZindex
  });
  $("body").append(graylayer);
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
  showGraylayer = function() {
    console.log("showGray");
    return graylayer.stop(true, true).fadeIn(speed);
  };
  hideGraylayer = function(callback) {
    console.log("hideGray");
    return graylayer.stop(true, true).fadeOut(speed);
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
  barWidth = 30;
  $(paragraphs).each(function() {
    var bar, base, height, keywords, lineMargin, paragraph, select, wrapdiv;
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
    base = $('<div class="base">').css({
      "z-index": baseZindex + 3,
      "height": height,
      "margin-left": -barWidth
    });
    wrapdiv.prepend(base);
    bar = $('<div class="bar"><input type="checkbox"/>').css({
      "width": barWidth,
      "height": height
    });
    base.append(bar);
    select = $('<div class="select"></div>').append($('<ul>この文書を</ul>').append($('<li class="active"><a>含む</a></li>')).append($('<li><a>除外する</a></li>')));
    base.append(select);
    select.delegate('a', 'click', function(e) {
      p($('a', select).parent().removeClass("active"));
      return $(this).parent().addClass("active");
    });
    lineMargin = 10;
    base.append($('<div class="line">').css({
      "height": height - 2 * lineMargin,
      "margin-top": lineMargin
    }));
    keywords = $('<div class="keywords">').css({
      "width": 400
    }).append($('<div class="include active">')).append($('<div class="exclude">'));
    base.append(keywords);
    select.hide();
    bar.hide();
    keywords.hide();
    return paragraph.css({
      "z-index": baseZindex + 1
    });
  });
  $(paragraphs).css({
    "z-index": baseZindex,
    "position": "relative",
    "border-radius": 8,
    "background-color": "white"
  });
  ul = $("<ul>").css({
    "padding": 10,
    "background-color": "blue",
    "border-radius": 3,
    "list-style-type": "none"
  });
  li = $('<a>').text("include").css({
    "color": "white"
  }).wrap("<li>").parent();
  ul.append(li);
  a = $('<a>').text("exclude").css({
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
  p(paragraphs.length);
  _fn = function(num) {};
  for (num = 0, _ref = paragraphs.length; 0 <= _ref ? num <= _ref : num >= _ref; 0 <= _ref ? num++ : num--) {
    _fn(num);
    $(paragraphs[num]).mouseenter();
    $("div.bar:eq(" + num + ")").show();
    $("div.select:eq(" + num + ")").show();
    $("div.keywords:eq(" + num + ")").show();
  }
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
    var link;
    link = $X(siteinfo['link'], node);
    if (link.length === 0) {
      return;
    }
    return link[0].href;
  };
  post_data = JSON.stringify({
    all_urls: $X(siteinfo['paragraph']).map(get_url)
  });
  window.Minibuffer.status('Preload2', 'Preloading2...');
  root_divs = paragraphs.parent();
  D.xhttp.post_j(api_url + "/preload2", post_data).next(function(response) {
    var b, exclude_keyword, include_keyword, inverted_index, ret, root_div, word, words, words_index, _i, _j, _len, _len2;
    ret = JSON.parse(response.responseText);
    console.log(ret);
    console.log(ret.status);
    window.Minibuffer.status('Preload2', "Preloading2... " + ret.status + ".", 3000);
    words_index = ret.words_index;
    inverted_index = ret.inverted_index;
    for (_i = 0, _len = root_divs.length; _i < _len; _i++) {
      root_div = root_divs[_i];
      include_keyword = $("div.include", root_div);
      exclude_keyword = $("div.exclude", root_div);
      words = words_index[_i];
      for (_j = 0, _len2 = words.length; _j < _len2; _j++) {
        word = words[_j];
        a = $('<a>').text(word);
        include_keyword.prepend(a);
        if (word[0] === "-") {
          word = word.slice(1, word.length);
        } else {
          word = "-" + word;
        }
        b = $('<a>').text(word);
        exclude_keyword.prepend(b);
      }
    }
  });
  otherKeyword = $('#trev').parent().addClass('dummy-parent');
  otherKeyword.prepend($('<div class="dummy">'));
  otherKeyword.hover(function(e) {
    return showGraylayer();
  }, function() {
    return hideGraylayer();
  });
  otherKeyword.delegate('a', 'hover', function(e) {
    if (e.type === 'mouseenter') {
      return p("in", $(this).text());
    } else {
      return p("out", $(this).text());
    }
  });
  window.flag = 1;
  return p("hogehoge5");
};
GM_addStyle('div.base {\n		position:absolute;\n		/* opacity:0.7; */\n		background-color:rgba(0, 0, 0, 0.7);/* black; */\n		border-radius: 8px 0px 0px 8px;\n}\ndiv.base:hover {\n		border-radius: 8px 8px 8px 8px;\n}\ndiv.base a {\n		cursor: pointer;\n}\ndiv.base div {\n		float: left;\n		color: white;								/* for explain text */\n}\ndiv.base li {\n    border-radius: 15px 15px 15px 15px;\n	  padding-bottom: 3px;\n    padding-left: 10px;\n    padding-top: 3px;\n		color: #BFBFBF;\n}\ndiv.base li.active {\n		background-color: rgba(0, 0, 0, 0.8);\n		color: white;\n}\ndiv.base li:hover {\n		/* background-color: rgba(255, 255, 255, 0.1); */\n		color: #FFFFFF;\n}\ndiv.select{\n		color: white;\n		float: right;\n		font-size: small;\n}\ndiv.select ul{\n		padding: 10px 10px 10px 0;\n		/* border-radius: 3px 3px 3px 3px; */\n		list-style-type: none;			/* for not dotted */\n}\ndiv.line{\n		border-left: 1px solid white;\n		/* border-right-width: 10px; */\n}\ndiv.keywords {\n		font-size: medium;\n		padding: 10px;\n}\ndiv.keywords a{\n		margin-right: 10px;\n		text-decoration: underline;\n}\ndiv.dummy-parent {\n		position:relative;\n		z-index: 1002;							/* with gray */\n}/* dummy-parent */\ndiv.dummy {\n    top: -5px;\n		bottom: -5px;\n    left: -8px;\n		right: -7px;\n    position: absolute;\n		background-color: white;\n		z-index: -1;\n		border-radius: 15px;\n}\n#graylayer {\n		background-color:black;\n    opacity: 0.5;\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    top: 0;\n    left: 0;\n		display: none;\n}');
jQuery = 0;
GM_wait = function() {
  if (typeof unsafeWindow.jQuery === 'undefined') {
    return window.setTimeout(GM_wait, 100);
  } else {
    jQuery = unsafeWindow.jQuery.noConflict(true);
    return waitMinibuffer();
  }
};
i = 4;
waitMinibuffer = function() {
  if (window.Minibuffer && window.Minibuffer.addCommand && window.LDRize && window.LDRize.getSiteinfo) {
    return letsJQuery();
  } else if (i-- > 0) {
    return setTimeout(arguments.callee, 500);
  }
};
(function() {
  var $, GM_Head, GM_JQ;
  if (typeof unsafeWindow.jQuery === 'undefined') {
    GM_Head = document.getElementsByTagName('head')[0] || document.documentElement;
    GM_JQ = document.createElement('script');
    GM_JQ.type = 'text/javascript';
    GM_JQ.async = true;
    GM_JQ.innerHTML = GM_getResourceText('jquery');
    GM_Head.appendChild(GM_JQ);
    $ = unsafeWindow.$;
  }
  return GM_wait();
})();