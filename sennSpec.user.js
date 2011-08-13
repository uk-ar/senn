var $, assert, bar, keywords, para;
describe("Jasmine", function() {
  return it("makes testing JavaScript awesome!", function() {
    return expect(0).toBeEqual(0);
  });
});
jasmine.getEnv().execute();
$ = jQuery;
assert = function(value, expect) {
  value = JSON.stringify(value);
  expect = JSON.stringify(expect);
  if (value !== expect) {
    console.error("expect:" + expect + ",but actual:" + value);
    throw "hoge";
  }
};
para = $("li.g").first();
bar = $("div.bar").first();
keywords = $("div.keywords", bar);
para.mouseenter();
assert(keywords.is(":animated"), false);
assert(para.queue(), []);
assert(bar.queue(), []);
assert(keywords.queue(), []);
assert(keywords.is(":visible"), false);
bar.mouseenter();
assert(keywords.is(":animated"), true);
assert(keywords.queue(), ["inprogress"]);
assert(keywords.is(":visible"), true);
bar.mouseleave();
