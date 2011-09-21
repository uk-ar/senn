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
  #### variables
  $X = window.Minibuffer.$X;
  $N = window.Minibuffer.$N;
  $ = jQuery;
  #$ = window.jQuery;
  siteinfo = window.LDRize.getSiteinfo();
  paragraphs = $($X(siteinfo['paragraph']))
  query_box = $($X(siteinfo['focus'] ||
  	'//input[@type="text" or not(@type)]')[0])
  query = query_box.attr("value")
  baseZindex = 1000
  grayZindex = 1000
  speed="fast"

  D = window.Minibuffer.D();
  api_url = "http://localhost:3000/api"

  graylayer = $('<div id="graylayer">').css("z-index":grayZindex)
  $("body").
    append(graylayer)

  #### functions
  get_url = (node) ->
    link = $X(siteinfo['link'], node)
    return if link.length == 0
    link[0].href

  all_urls = $X(siteinfo['paragraph']).map(get_url)
  post = (path, query, relevant, irrelevant) ->
    data = JSON.stringify {
      all_urls: all_urls
      query:query
      relevant:relevant
      irrelevant:irrelevant
      #related_queries:related_queries
    }
    return D.xhttp {
      method:"post", url:api_url + path, data:data, query:query
      headers:{"Content-Type":"application/json; charset = utf-8"}}

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
    graylayer.stop(true,true).fadeIn(speed)

  hideGraylayer = (callback) ->
    graylayer.stop(true,true).fadeOut(speed)

  wordsIndex ={"speed test":[0,2],"win high speed":[1], "東京":[0], "名古屋":[1], "goo speed":[10, 11], "usen speed":[11]}

  showParagraphs = (word) ->
    index = wordsIndex[word]||[]
    for i in index
      $(paragraphs[i]).css("z-index":baseZindex+1)
      $("div.dummy", paragraphs[i]).show()

  hideParagraphs = (word) ->
    index = wordsIndex[word]||[]
    for i in index
      $(paragraphs[i]).css("z-index":"")# todo auto?
      $("div.dummy", paragraphs[i]).hide()
  ####
  if GM_getValue("from_url") == document.referrer
    console.log("a")
    query_box.css("background":"#fff8c1")#!important

  barWidth=30
  $(paragraphs).each ->
    ####
    paragraph = $(this)

    #for debug
    paragraph.unwrap() if window.flag?

    ####
    height = paragraph.height()

    paragraph.addClass("dummy-parent")
    paragraph.prepend(
      $('<div class="dummy">').css("left":-barWidth-8).hide())
    # paragraph.hover ->
    #   showBar(paragraph)
    # ,->
    #   hideBar(paragraph)

    base = $('<div class="base">')
      .css("z-index":baseZindex+3,"left":-barWidth)
    paragraph.prepend(base)

    bar = $('<div class="bar"><input type="checkbox"/>')
      .css("width":barWidth)
    base.append(bar)

    toggleMode = ->
      $("div.base").toggleClass("active")

    base.delegate 'input', 'click', (e) ->
      before = paragraphs.filter(".gm_ldrize_pinned")
      paragraph.toggleClass("gm_ldrize_pinned")
      after = paragraphs.filter(".gm_ldrize_pinned")
      toggleMode() if((before.get().length == 0) or (after.get().length == 0))
      relevant = after.map( ->
        get_url(this)
      ).get()
      irrelevant = paragraphs.filter(":not(.gm_ldrize_pinned)").map( ->
        get_url(this)
      ).get()
      p irrelevant
      #post("/api2", query, relevant)
    main = $('<div class="main"></div>')

    select = $('<div class="select"></div>')
      .append($('<ul>この文書を</ul>')
        .append($('<li class="active"><a>含む</a></li>'))
        .append($('<li><a>除外する</a></li>')))
    base.append(select)

    lineMargin = 10
    base.append(
      $('<div class="line">')
      .css("height":height-2*lineMargin, "margin-top":lineMargin)
    )

    keywords = $('<div class="keywords">').css("width":400).
      append($('<div class="include active">')).
      append($('<div class="exclude">'))
    base.append(keywords)
    keywords.delegate 'a', 'click', (e) ->
      query_box.attr("value":"#{query} #{$(this).text()}")
      e.stopPropagation()
      # for gm_xmlhttprequest security limitation
      # http://wiki.greasespot.net/Greasemonkey_access_violation
      setTimeout ->
        GM_setValue("from_url", location.href)
        query_box[0].form.submit()
      , 0
    keywords.delegate 'a', 'hover', (e) ->
      if e.type == 'mouseenter'
        showParagraphs($(this).text())
      else
        hideParagraphs($(this).text())
    base.hover (e) ->
      showGraylayer()
    , ->
      hideGraylayer()
      #e.stopPropagation()

    base.delegate 'a', 'click', (e) ->
      p 'clicked'
      $('a', select).parent().toggleClass("active")
      $('a', keywords).parent().toggleClass("active")

    select.hide()
    bar.hide()
    keywords.hide()

    # bar.hover ->
    #   showKeywords(paragraph.parent())
    # ,->
    #   hideKeywords(paragraph.parent())
    #paragraph.css("z-index":baseZindex+1)

  #$("a:eq(1)", $("div.keywords").first()).mouseenter()
  for num in [0..paragraphs.length]
    do (num) ->
    $(paragraphs[num]).mouseenter()
    $("div.bar:eq(#{num})").show()
    $("div.select:eq(#{num})").show()
    $("div.keywords:eq(#{num})").show()

  # main
  window.Minibuffer.status('Preload2', 'Preloading2...')# + count
  root_divs = paragraphs

  negate = (words) ->
    for word in words
      if word[0]=="-"
        word.slice(1,word.length)
      else
        "-#{word}"
  refreshKeywords = (words_index, paragraphs) ->
    for paragraph, i in paragraphs
      include_keyword = $("div.include", paragraph)
      exclude_keyword = $("div.exclude", paragraph)
      words = words_index[i]
      negative_words = negate(words)
      for word in words
        a=$('<a>').text(word)
        include_keyword.prepend(a)
      for word in negative_words
        b=$('<a>').text(word)
        exclude_keyword.prepend(b)

  post("/preload2")
  .next (response) ->
    ret = JSON.parse(response.responseText);
    console.log(ret);
    console.log(ret.status);
    window.Minibuffer.status(
      'Preload2', "Preloading2... #{ret.status}.", 3000) # + count
    words_index = ret.words_index
    inverted_index = ret.inverted_index
    refreshKeywords(words_index, paragraphs)
    return #for deferred
  #.next () ->

  otherKeyword = $('#trev').parent().addClass('dummy-parent')
  otherKeyword.prepend(
    $('<div class="dummy">').css("z-index":-1))

  otherKeyword.hover (e) ->
    showGraylayer()
  , ->
    hideGraylayer()
  #http://stackoverflow.com/questions/4772287/does-jquery-have-a-handleout-for-delegatehover
  otherKeyword.delegate 'a', 'hover', (e) ->
    if e.type == 'mouseenter'
      showParagraphs($(this).text())
    else
      hideParagraphs($(this).text())

  p relatedKeyword = $('#brs').parent().addClass('dummy-parent')
  relatedKeyword.prepend(
    $('<div class="dummy">').css("z-index":-1))
  relatedKeyword.hover (e) ->
    showGraylayer()
  , ->
    hideGraylayer()
  #http://stackoverflow.com/questions/4772287/does-jquery-have-a-handleout-for-delegatehover
  relatedKeyword.delegate 'a', 'hover', (e) ->
    if e.type == 'mouseenter'
      showParagraphs($(this).text())
    else
      hideParagraphs($(this).text())

  ####
  window.flag=1
  #showGraylayer()
  p "hogehoge5"
#)

GM_addStyle('''
div.base {
		position:absolute;
		top:0;
		right:0;
		bottom:0;
		/* opacity:0.7; */
		background-color:rgba(0, 0, 0, 0.7);/* black; */
		border-radius: 8px 0px 0px 8px;
}
li.dummy-parent div.active{
		background-color:rgba(220, 28, 28, 0.7);/* red; */
}
div.base:hover {
		border-radius: 8px 8px 8px 8px;
		border: 2px solid white;
}
div.base a {
		cursor: pointer;
}
div.base div {
		float: left;
		color: white;								/* for explain text */
}
div.base li {
    border-radius: 15px 15px 15px 15px;
	  padding-bottom: 3px;
    padding-left: 10px;
    padding-top: 3px;
		color: #BFBFBF;
}
div.base li.active {
		background-color: rgba(0, 0, 0, 0.8);
		color: white;
}
div.base li:hover {
		/* background-color: rgba(255, 255, 255, 0.1); */
		color: #FFFFFF;
}
div.select{
		color: white;
		float: right;
		font-size: small;
}
div.select ul{
		padding: 10px 10px 10px 0;
		/* border-radius: 3px 3px 3px 3px; */
		list-style-type: none;			/* for not dotted */
}
div.line{
		border-left: 1px solid white;
		/* border-right-width: 10px; */
}
div.keywords {
		font-size: medium;
		padding: 10px;
}
div.keywords a{
		margin-right: 10px;
		text-decoration: underline;
}
div.keywords div.active{
		display: block;
}
div.include {
		display: none;
}
div.exclude {
		display: none;
}
/* for other keyword */
div.dummy-parent {
		position:relative;
}/* dummy-parent */
div.dummy-parent:hover {
		z-index: 1002;							/* with gray */
}
/* for paragraph */
li.dummy-parent {
		position:relative;
}/* dummy-parent */
li.dummy-parent:hover {
		z-index: 1002;							/* with gray */
}
div.dummy {
    top: -5px;
		bottom: -5px;
    left: -8px;
		right: -7px;
    position: absolute;
		background-color: white;
		z-index: -1;							/* for paragraph.if otherkeyword -1*/
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