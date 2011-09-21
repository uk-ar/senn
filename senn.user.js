
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
  var $, $N, $X, D, all_urls, api_url, barWidth, baseZindex, get_url, grayZindex, graylayer, hideBar, hideGraylayer, hideKeywords, hideParagraphs, inverted_index, negate, num, otherKeyword, paragraphs, post, query, query_box, refreshKeywords, relatedKeyword, root_divs, showBar, showGraylayer, showKeywords, showParagraphs, siteinfo, speed, _fn, _ref;
  $X = window.Minibuffer.$X;
  $N = window.Minibuffer.$N;
  $ = jQuery;
  siteinfo = window.LDRize.getSiteinfo();
  paragraphs = $($X(siteinfo['paragraph']));
  query_box = $($X(siteinfo['focus'] || '//input[@type="text" or not(@type)]')[0]);
  query = query_box.attr("value");
  baseZindex = 1000;
  grayZindex = 1000;
  speed = "fast";
  D = window.Minibuffer.D();
  api_url = "http://localhost:3000/api";
  graylayer = $('<div id="graylayer">').css({
    "z-index": grayZindex
  });
  $("body").append(graylayer);
  get_url = function(node) {
    var link;
    link = $X(siteinfo['link'], node);
    if (link.length === 0) {
      return;
    }
    return link[0].href;
  };
  all_urls = $X(siteinfo['paragraph']).map(get_url);
  post = function(path, query, relevant, irrelevant) {
    var data;
    data = JSON.stringify({
      all_urls: all_urls,
      query: query,
      relevant: relevant,
      irrelevant: irrelevant
    });
    return D.xhttp({
      method: "post",
      url: api_url + path,
      data: data,
      query: query,
      headers: {
        "Content-Type": "application/json; charset = utf-8"
      }
    });
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
  showGraylayer = function() {
    return graylayer.stop(true, true).fadeIn(speed);
  };
  hideGraylayer = function(callback) {
    return graylayer.stop(true, true).fadeOut(speed);
  };
  inverted_index = [];
  showParagraphs = function(word) {
    var i, index, _i, _len, _results;
    index = inverted_index[word] || [];
    _results = [];
    for (_i = 0, _len = index.length; _i < _len; _i++) {
      i = index[_i];
      $(paragraphs[i]).css({
        "z-index": baseZindex + 1
      });
      _results.push($("div.dummy", paragraphs[i]).show());
    }
    return _results;
  };
  hideParagraphs = function(word) {
    var i, index, _i, _len, _results;
    index = inverted_index[word] || [];
    _results = [];
    for (_i = 0, _len = index.length; _i < _len; _i++) {
      i = index[_i];
      $(paragraphs[i]).css({
        "z-index": ""
      });
      _results.push($("div.dummy", paragraphs[i]).hide());
    }
    return _results;
  };
  if (GM_getValue("from_url") === document.referrer) {
    console.log("a");
    query_box.css({
      "background": "#fff8c1"
    });
  }
  barWidth = 30;
  $(paragraphs).each(function() {
    var bar, base, eventHandler, height, keywords, line, lineMargin, main, paragraph, select, toggleMode;
    paragraph = $(this);
    if (window.flag != null) {
      paragraph.unwrap();
    }
    height = paragraph.height();
    paragraph.addClass("dummy-parent");
    paragraph.prepend($('<div class="dummy">').css({
      "left": -barWidth - 8
    }).hide());
    eventHandler = $('<div class="event-hander">').css({
      "z-index": baseZindex + 3,
      "left": -barWidth
    });
    paragraph.prepend(eventHandler);
    base = $('<div class="base">');
    eventHandler.prepend(base);
    bar = $('<div class="bar"><input type="checkbox"/>').css({
      "width": barWidth,
      "height": height
    });
    base.append(bar);
    paragraph.hover(function() {
      return bar.show();
    }, function() {
      return bar.hide();
    });
    toggleMode = function() {
      return $("div.base").toggleClass("mode");
    };
    base.delegate('input', 'click', function(e) {
      var after, before, irrelevant, relevant;
      before = paragraphs.filter(".gm_ldrize_pinned");
      paragraph.toggleClass("gm_ldrize_pinned");
      after = paragraphs.filter(".gm_ldrize_pinned");
      if ((before.get().length === 0) || (after.get().length === 0)) {
        toggleMode();
      }
      relevant = after.map(function() {
        return get_url(this);
      }).get();
      irrelevant = paragraphs.filter(":not(.gm_ldrize_pinned)").map(function() {
        return get_url(this);
      }).get();
      return p(irrelevant);
    });
    main = $('<div class="main"></div>');
    base.append(main);
    base.hover(function() {
      return main.show();
    }, function() {
      return main.hide();
    });
    select = $('<div class="select"></div>').append($('<ul>この文書を</ul>').append($('<li class="active"><a>含む</a></li>')).append($('<li><a>除外する</a></li>')));
    main.append(select);
    lineMargin = 10;
    line = $('<div class="line">').css({
      "height": height - 2 * lineMargin,
      "margin-top": lineMargin
    });
    main.append(line);
    keywords = $('<div class="keywords">').css({
      "width": 400
    }).append($('<div class="include active">')).append($('<div class="exclude">'));
    main.append(keywords);
    keywords.delegate('a', 'click', function(e) {
      query_box.attr({
        "value": "" + query + " " + ($(this).text())
      });
      e.stopPropagation();
      return setTimeout(function() {
        GM_setValue("from_url", location.href);
        return query_box[0].form.submit();
      }, 0);
    });
    keywords.delegate('a', 'hover', function(e) {
      if (e.type === 'mouseenter') {
        return showParagraphs($(this).text());
      } else {
        return hideParagraphs($(this).text());
      }
    });
    main.hover(function(e) {
      return showGraylayer();
    }, function() {
      return hideGraylayer();
    });
    base.delegate('a', 'click', function(e) {
      p('clicked');
      $('a', select).parent().toggleClass("active");
      return $('a', keywords).parent().toggleClass("active");
    });
    bar.hide();
    return main.hide();
  });
  _fn = function(num) {};
  for (num = 0, _ref = paragraphs.length; 0 <= _ref ? num <= _ref : num >= _ref; 0 <= _ref ? num++ : num--) {
    _fn(num);
    $(paragraphs[num]).mouseenter();
    $("div.bar:eq(" + num + ")").show();
    $("div.main:eq(" + num + ")").show();
  }
  window.Minibuffer.status('Preload2', 'Preloading2...');
  root_divs = paragraphs;
  negate = function(words) {
    var word, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = words.length; _i < _len; _i++) {
      word = words[_i];
      _results.push(word[0] === "-" ? word.slice(1, word.length) : "-" + word);
    }
    return _results;
  };
  refreshKeywords = function(words_index, paragraphs) {
    var a, b, exclude_keyword, i, include_keyword, negative_words, paragraph, word, words, _i, _len, _len2, _results;
    _results = [];
    for (i = 0, _len = paragraphs.length; i < _len; i++) {
      paragraph = paragraphs[i];
      include_keyword = $("div.include", paragraph);
      exclude_keyword = $("div.exclude", paragraph);
      words = words_index[i];
      negative_words = negate(words);
      for (_i = 0, _len2 = words.length; _i < _len2; _i++) {
        word = words[_i];
        a = $('<a>').text(word);
        include_keyword.prepend(a);
      }
      _results.push((function() {
        var _j, _len3, _results2;
        _results2 = [];
        for (_j = 0, _len3 = negative_words.length; _j < _len3; _j++) {
          word = negative_words[_j];
          b = $('<a>').text(word);
          _results2.push(exclude_keyword.prepend(b));
        }
        return _results2;
      })());
    }
    return _results;
  };
  post("/preload2").next(function(response) {
    var ret, words_index;
    ret = JSON.parse(response.responseText);
    console.log(ret);
    window.Minibuffer.status('Preload2', "Preloading2... " + ret.status + ".", 3000);
    words_index = ret.words_index;
    inverted_index = ret.inverted_index;
    refreshKeywords(words_index, paragraphs);
  });
  otherKeyword = $('#trev').parent().addClass('dummy-parent');
  otherKeyword.prepend($('<div class="dummy">').css({
    "z-index": -1
  }));
  otherKeyword.hover(function(e) {
    return showGraylayer();
  }, function() {
    return hideGraylayer();
  });
  otherKeyword.delegate('a', 'hover', function(e) {
    if (e.type === 'mouseenter') {
      return showParagraphs($(this).text());
    } else {
      return hideParagraphs($(this).text());
    }
  });
  p(relatedKeyword = $('#brs').parent().addClass('dummy-parent'));
  relatedKeyword.prepend($('<div class="dummy">').css({
    "z-index": -1
  }));
  relatedKeyword.hover(function(e) {
    return showGraylayer();
  }, function() {
    return hideGraylayer();
  });
  relatedKeyword.delegate('a', 'hover', function(e) {
    if (e.type === 'mouseenter') {
      return showParagraphs($(this).text());
    } else {
      return hideParagraphs($(this).text());
    }
  });
  window.flag = 1;
  return p("hogehoge5");
};
GM_addStyle('div.event-hander {\n		position:absolute;\n		top:0;\n		right:0;\n		bottom:0;\n}\ndiv.base {\n		position:absolute;\n		/* top:0; */\n		/* bottom:0; */\n		/* opacity:0.7; */\n		background-color:rgba(0, 0, 0, 0.7);/* black; */\n		border-radius: 8px 0px 0px 8px;\n}\n/* div.base:hover { */\n/* 		right:auto; */\n/* } */\n/* for base color change */\nli.dummy-parent div.mode{\n		background-color:rgba(220, 28, 28, 0.7);/* red; */\n}\ndiv.base:hover {\n		border-radius: 8px 8px 8px 8px;\n		border: 2px solid white;\n}\ndiv.base a {\n		cursor: pointer;\n}\ndiv.base div {\n		float: left;\n		color: white;								/* for explain text */\n}\ndiv.base li {\n    border-radius: 15px 15px 15px 15px;\n	  padding-bottom: 3px;\n    padding-left: 10px;\n    padding-top: 3px;\n		color: #BFBFBF;\n}\ndiv.base li.active {\n		background-color: rgba(0, 0, 0, 0.8);\n		color: white;\n}\ndiv.base li:hover {\n		/* background-color: rgba(255, 255, 255, 0.1); */\n		color: #FFFFFF;\n}\ndiv.select{\n		color: white;\n		float: right;\n		font-size: small;\n}\ndiv.select ul{\n		padding: 10px 10px 10px 0;\n		/* border-radius: 3px 3px 3px 3px; */\n		list-style-type: none;			/* for not dotted */\n}\ndiv.line{\n		border-left: 1px solid white;\n		/* border-right-width: 10px; */\n}\ndiv.keywords {\n		font-size: medium;\n		padding: 10px;\n}\ndiv.keywords a{\n		margin-right: 10px;\n		text-decoration: underline;\n}\ndiv.keywords div.active{\n		display: block;\n}\ndiv.include {\n		display: none;\n}\ndiv.exclude {\n		display: none;\n}\n/* for other keyword */\ndiv.dummy-parent {\n		position:relative;\n}/* dummy-parent */\ndiv.dummy-parent:hover {\n		z-index: 1002;							/* with gray */\n}\n/* for paragraph */\nli.dummy-parent {\n		position:relative;\n}/* dummy-parent */\nli.dummy-parent:hover {\n		z-index: 1002;							/* with gray */\n}\ndiv.dummy {\n    top: -5px;\n		bottom: -5px;\n    left: -8px;\n		right: -7px;\n    position: absolute;\n		background-color: white;\n		z-index: -1;							/* for paragraph.if otherkeyword -1*/\n		border-radius: 15px;\n}\n#graylayer {\n		background-color:black;\n    opacity: 0.5;\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    top: 0;\n    left: 0;\n		display: none;\n}');
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