## coffee -csb
`
// ==UserScript==
// @name           senn
// @namespace      http://hoge
// @include        https://*
// @include        http://*
// @include        http://*
// @resource       jquery    http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// ==/UserScript==
`
#for debug
console.log = unsafeWindow.console.log
p = console.log
# unsafeWindow.Minibuffer = window.Minibuffer
# unsafeWindow.LDRize = window.LDRize

# All your GM code must be inside this function
letsJQuery = ->
  $X = window.Minibuffer.$X;
  $N = window.Minibuffer.$N;
  $ = jQuery;
  #$ = window.jQuery;
  siteinfo = window.LDRize.getSiteinfo();
  paragraphs = $($X(siteinfo['paragraph']))
  baseZindex = 1000
  grayZindex = 1000
  speed="fast"

  wordsIndex ={"ruby on rails":[0,2],"ruby 入門":[1]}

  graylayer = $("<div>").attr("id":"graylayer").css("z-index":grayZindex)

  $("body").append graylayer

  showKeywords = (context) ->
    $("div.keywords", context).stop(true, true)
    .animate({"width":"show"},speed)#:not(:animated)
    #console.debug("showKeywords")
    $("div.base").css("left":"0","right":"0","width":"")#console.log(

  hideKeywords = (context) ->
    #console.debug("hideKeywords")
    $("div.keywords", context)
    .animate {"width":"hide"},speed,"swing",->
      $("div.base").css("left":"","right":"","width":barWidth)#not to move to graylayer

  showBar = (context) ->
    #console.debug("showBar")
    $("div.bar",context).show()

  hideBar = (context)->
    #console.debug("hideBar")
    keywords = $("div.keywords", context)
    if keywords.is(":animated")
      keywords.queue ->
        $("div.bar",context).hide()
    else
      $("div.bar",context).hide()

  showGraylayer = ->
    console.log("showGray")
    graylayer.stop(true,true).fadeIn(speed)

  hideGraylayer = (callback) ->
    console.log("hideGray")
    graylayer.stop(true,true).fadeOut(speed)

  genShow = (indexes) ->
    @indexes = indexes
    ->
      console.debug("genShow")
      index2 = wordsIndex[$(this).text()]
      console.info(index2)
      for index in indexes
        do (index) ->
          console.info(index)
          $(paragraphs[index]).css("z-index":baseZindex+1).css("background-color":"white")
      console.info($(this))
      showGraylayer()

  genHide = (indexes) ->
    @indexes = indexes
    ->
      console.debug("genHide")
      index2 = wordsIndex[$(this).text()]
      console.info(index2)
      #$(this).css("z-index":baseZindex)#for other keyword
      hideGraylayer ->
        for index in indexes
          do (index) ->
            $(paragraphs[index]).css("z-index":baseZindex)#.css("background-color":"")

  showParagraphs = (word) ->
    console.group("showP")
    #console.warn(word)
    index2 = wordsIndex[word]#$.text() combied children
    console.warn(index2)
    for index in index2
      do (index) ->
        console.warn("sh" + index)
        $(paragraphs[index]).css("z-index":baseZindex+1).css("background-color":"white")
    showGraylayer()
    console.groupEnd("showP")
      #$(e.target).css("z-index":baseZindex+5)#for other keyword
  hideParagraphs = (word) ->
    console.group("hideP")
    #console.warn(word)
    index2 = wordsIndex[word]#$.text() combied children
    console.warn(index2)
    #$(e.target).css("z-index":baseZindex)#for other keyword
    hideGraylayer  ->
      for index in index2
        do (index) ->
          console.warn("hi" + index)
          $(paragraphs[index]).css("z-index":baseZindex)
    console.groupEnd("hideP")

  ####
  barWidth=30
  $(paragraphs).each ->
    ####
    paragraph = $(this)

    #for debug
    paragraph.unwrap() if window.flag?

    ####
    height = paragraph.height()

    wrapdiv = $("<div>").css("position":"relative")

    paragraph.wrap(wrapdiv)
    wrapdiv=paragraph.parent()
    # wrapdiv.hover ->
    #   showBar(paragraph)
    # ,->
    #   hideBar(paragraph)

    base = $('<div>').attr("class","base")
      .css("z-index":baseZindex+3,"height":height,"margin-left":-barWidth)
    wrapdiv.prepend(base)

    bar = $('<div>').attr("class","bar")
      .css("width":barWidth,"height":height)
    base.append(bar)

    check = $('<input type="checkbox"/>').attr("position":"absolute")
    # because cannot change type
    # p "app", bar.append(check)
    # p bar

    select = $('<div>').attr("class","select").text("この文書を")
      .css("height":height)
    ul=$("<ul>").css("padding":10, "border-radius":3, "list-style-type":"none")#"background-color":"blue",
    li=$('<a>').text("含む").attr("href":"http://www.google.co.jp/").wrap("<li>").parent()#"float":"right".css("color":"white")
  #.hover(genShow(obj[1]),genHide(obj[1])).hover(genShow(wordsIndex[word]),genHide(wordsIndex[word]))
    # check = $('<input type="checkbox"/>').attr( "position":"absolute")
    # li.prepend(check)
    ul.append(li)

    li=$('<a>').text("除外する").attr("href":"http://www.google.co.jp/").css("color":"white", "float":"right").wrap("<li>").parent()
    check = $('<input type="checkbox"/>').attr("position":"absolute")
    li.prepend(check)
    ul.append(li)

    select.append(ul)
    base.append(select)
    base.append(
      $('<div class="line">'))
      #.css("height":height, "margin":))
		#margin:8px 10px;

    keywords = $('<div>').attr("class","keywords")
      .css("height":height,"width":100)#"position":"absolute","top":0

    base.append(keywords)

    select.hide()
    bar.hide()
    keywords.hide()
    # bar.hover ->
    #   showKeywords(paragraph.parent())
    # ,->
    #   hideKeywords(paragraph.parent())
    paragraph.css("z-index":baseZindex+1)

  # position relative because z-index
  $(paragraphs).css("z-index":baseZindex,"position":"relative","border-radius":8,"background-color":"white")#,"z-index":baseZindex+2)

  ####
  ul=$("<ul>").css("padding":10, "background-color":"blue","border-radius":3, "list-style-type":"none")
  li=$('<a>').text("include").attr("href":"http://www.google.co.jp/").css("color":"white").wrap("<li>").parent()
  #.hover(genShow(obj[1]),genHide(obj[1])).hover(genShow(wordsIndex[word]),genHide(wordsIndex[word]))
  ul.append(li)
  a=$('<a>').text("exclude").attr("href":"http://www.google.co.jp/").css("color":"white").wrap("<li>")
  .hover (e) ->
    link = $(e.target).parents("a").first()
    word = link[0].firstChild.data
    hideParagraphs(word)
    $("#graylayer").stop(true,true)
    showParagraphs(word)
    console.error("show")
  , ->
    # link = $(e.target).parents("a").first()
    # word = link[0].firstChild.data
    # hideParagraphs(word)
    # $("#graylayer").stop(true,true)
    # showParagraphs(word)
    console.error("hide")
    #showParagraphs(
   #.hover(genShow(obj[1]),genHide(obj[1]))
  ul.append(a.parent())

  ul.wrap("<div>").parent().attr("id":"tooltip").css("position":"relative", "z-index":"1010").show()#.css("background-color":"red")#, "top":200, "left":100).hide()
  $("body").append(ul.parent())
  #console.log($("div#tooltip"))
  tooltip = $("div#tooltip")
  showTooltip = (e)->
    console.debug("showTooltip")
    #if graylayer.is(":animated")
    that = this
    graylayer.queue -># => cannot works well
      console.debug("act1:showTooltip")
      console.debug(that)
      tooltip.stop(true,true).css("left":$(that).width(), "top":0, "position":"absolute", "padding-left":10).slideDown(speed)
      tooltip.appendTo(that)
      #.css("top":paragraph.offset().top + 20, "left":paragraph.offset().left + 10).css("left":0, "top":0, "position":"absolute")"left":paragraph.width(), "top":paragraph.height()
    # else
    #   console.debug("act2:showTooltip")
    #   tooltip.stop(true,true).css("left":paragraph.width(), "top":0, "position":"absolute", "padding-left":10).fadeIn()#.css("top":paragraph.offset().top + 20, "left":paragraph.offset().left + 10).css("left":0, "top":0, "position":"absolute")"left":paragraph.width(), "top":paragraph.height()
    #   tooltip.appendTo(this)
    #console.log(paragraph)
  hideTooltip = (e)->
    console.debug("hideTooltip")
    $("div#tooltip").stop(true,true).slideUp(speed)

  $("a", $("div.keywords").first()).first().css("position":"relative").hover showTooltip
  , hideTooltip
  $("a:eq(1)", $("div.keywords").first()).css("position":"relative").hover showTooltip
  , hideTooltip

  #$("a:eq(1)", $("div.keywords").first()).mouseenter()
  p paragraphs.length
  for num in [0..paragraphs.length]
    do (num) ->
    $(paragraphs[num]).mouseenter()
    $("div.bar:eq(#{num})").show()
    $("div.select:eq(#{num})").show()
    $("div.keywords:eq(#{num})").show()

  D = window.Minibuffer.D();
  api_url = "http://localhost:3000/api"
  # for gm_xmlhttprequest security limitation http://wiki.greasespot.net/Greasemonkey_access_violation
  D.xhttp.post_j = (url, data) ->
      #setTimeout ->
    return D.xhttp {
      method:"post", url:url, data:data,
      headers:{"Content-Type":"application/json; charset = utf-8"}}
    #, 0

  get_url = (node) ->
    link = $X(siteinfo['link'], node)
    return if link.length == 0
    link[0].href

  post_data = JSON.stringify {
    all_urls: $X(siteinfo['paragraph']).map(get_url)}

  window.Minibuffer.status('Preload2', 'Preloading2...')# + count

  D.xhttp.post_j(api_url + "/preload2", post_data)
  .next (response) ->
    ret = JSON.parse(response.responseText);
    console.log(ret);
    console.log("post f");
    console.log(ret.status);
    window.Minibuffer.status(
      'Preload2', "Preloading2... #{ret.status}.", 3000) # + count
    return #for deferred
  #.next () ->

  root_divs = paragraphs.parent()
  words_index = [
    ["W3C","タグ", "ルビ"],
    ["Add-ons", "Firefox", "ルビ"],
    ["W3C3","タグ", "ルビ"],
    ["W3C4","タグ", "ルビ"],
    ["W3C5","タグ", "ルビ"],
    ["W3C6","タグ", "ルビ"],
    ["W3C7","タグ", "ルビ"],
    ["W3C8","タグ", "ルビ"],
    ["W3C9","タグ", "ルビ"],
    ["W3C10","タグ", "ルビ"],
  ]
  inverted_index = {
    "ruby on rails":[0,2],
    "ruby 入門":[1],
    "W3C":[0],
    "タグ":[0, 2],
    "ルビ":[0, 1, 2],
    }

  otherKeyword = $('#trev').parent().addClass('dummy-parent')
  otherKeyword.prepend(
    $('<div class="dummy">'))

  #otherKeywords = $('a', otherKeyword)

  otherKeyword.hover (e) ->
    showGraylayer()
  , ->
    hideGraylayer()
  #$(e.target)
  #http://stackoverflow.com/questions/4772287/does-jquery-have-a-handleout-for-delegatehover
  otherKeyword.delegate 'a', 'hover', (e) ->
    if e.type == 'mouseenter'
      p "in" , $(this).text()
    else
      p "out" , $(this).text()

  # for keyword in otherKeywords
  #   $(keyword).prepend(
  #     $('<div class="dummy">'))

  # for root_div in root_divs
  #   ul=$("<ul>")
  #   #for word in ["ruby on rails","ruby 入門"]
  #   words = words_index[_i]
  #   for word in words #["W3C","タグ", "ルビ"]
  #     #console.log(this)
  #     #that = this
  #     a=$('<a>').text(word).wrap("<li>")
  #     .hover  ->
  #       #console.log(that)
  #       #console.log(this)
  #       return
  #     , ->
  #       #console.log(this)
  #       return
  #     #.hover(genShow(wordsIndex[word]), genHide(wordsIndex[word]))#.mouseover(genShow(wordsIndex[word])).mouseout(genHide(wordsIndex[word]))
  #     # a.hover ->showParagraphs(a),
  #     # -> hideParagraphs(a)
  #     ul.append(a.parent())
  #   keyword = $("div.keywords", root_div)
  #   keyword.prepend(ul)
  ####
  window.flag=1
  #showGraylayer()
  p "hogehoge5"
#)

GM_addStyle('''
div.base {
		position:absolute;
		/* opacity:0.7; */
		background-color:rgba(0, 0, 0, 0.7);/* black; */
		border-radius: 8px 0px 0px 8px;
}
div.base:hover {
		border-radius: 8px 8px 8px 8px;
}
div.line{
		border-left: 1px solid white;
    /* display: block; */
    height: 114px;
}
div.base div {
		float: left;
		color: white;								/* for explain text */
}
div.base li {
	  padding-bottom: 3px;
    padding-left: 10px;
    padding-top: 3px;
		color: #BFBFBF;
}
div.base li:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: #FFFFFF;
}
div.dummy-parent {
		position:relative;
		z-index: 1002;							/* with gray */
}/* dummy-parent */
div.dummy {
    top: -5px;
		bottom: -5px;
    left: -8px;
		right: -7px;
    position: absolute;
		background-color: white;
		z-index: -1;
		border-radius: 15px;
}
#graylayer {
		background-color:black;
    opacity: 0.5;
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
		display: none;
}
''')
jQuery = 0

# Check if jQuery's loaded
GM_wait = ->
  if (typeof unsafeWindow.jQuery == 'undefined')
    window.setTimeout(GM_wait, 100);
  else
    jQuery = unsafeWindow.jQuery.noConflict(true);
    waitMinibuffer()

#http://coderepos.org/share/browser/lang/javascript/userscripts/minibufferbookmarkcommand.user.js
i = 4
waitMinibuffer = ->
  if(window.Minibuffer && window.Minibuffer.addCommand &&
  window.LDRize && window.LDRize.getSiteinfo)
    letsJQuery()
  else if i-- > 0
    setTimeout(arguments.callee, 500)

do ->
  if (typeof unsafeWindow.jQuery == 'undefined')
    GM_Head = document.getElementsByTagName('head')[0] || document.documentElement
    GM_JQ = document.createElement('script');
    GM_JQ.type = 'text/javascript';
    GM_JQ.async = true;
    #GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
    #GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
    GM_JQ.innerHTML = GM_getResourceText('jquery')
    GM_Head.appendChild(GM_JQ);
    $ = unsafeWindow.$;
  GM_wait();

#console.log("aa")
#bug strange overlay keyword suggest

# Local Variables:
# mode: coffee
# End: