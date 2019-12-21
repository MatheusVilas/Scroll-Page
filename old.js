var scrollPosition = 0;
var scrollSections = [].slice.call(
  document.querySelectorAll(".js-section-scroll")
);
var reverseScrollSection = [].slice
  .call(document.querySelectorAll(".js-section-scroll"))
  .reverse();
var oldScroll;
var scrollIsOnAnimation = false;
var timeoutScroll;

if (!detectmob()) {
  window.addEventListener("scroll", onPageScroll);
}

function onPageScroll() {
  console.log("scrolling");
  clearTimeout(timeoutScroll);
  timeoutScroll = setTimeout(function() {
    if (scrollIsOnAnimation && scrollPassLastItem()) return;
    if (isScrollToBottom()) {
      scrollToNextSection();
    } else {
      scrollToPrevSection();
    }
    oldScroll = getScrollPosition();
  }, 1);
}

function detectmob() {
  if (window.innerWidth <= 800) {
    return true;
  } else {
    return false;
  }
}

function scrollPassLastItem() {
  var rect = reverseScrollSection[0].getBoundingClientRect();
  if (rect.bottom <= 0) return false;
  return true;
}

function isScrollToBottom() {
  return oldScroll < getScrollPosition();
}

function getScrollPosition() {
  return window.pageYOffset | document.body.scrollTop;
}

function scrollToNextSection() {
  for (var i = 0; i < scrollSections.length; i++) {
    var sectionTopHeight = scrollSections[i].offsetTop;
    if (getScrollPosition() < sectionTopHeight) {
      scrollAnimate(scrollSections[i]);
      break;
    }
  }
}

function scrollToPrevSection() {
  for (var i = 0; i < reverseScrollSection.length; i++) {
    var sectionBottomHeight = reverseScrollSection[i].offsetTop;
    if (getScrollPosition() > sectionBottomHeight) {
      if (!elementInViewport2(reverseScrollSection[i])) break;
      scrollAnimate(reverseScrollSection[i]);
      break;
    }
  }
}

function scrollAnimate(section) {
  scrollIsOnAnimation = true;
  scrollIt(section, 250, "easeInCubic", function() {
    oldScroll = getScrollPosition();
  });
  setTimeout(function() {
    scrollIsOnAnimation = false;
  }, 350);
}

function elementInViewport2(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < window.pageYOffset + window.innerHeight &&
    left < window.pageXOffset + window.innerWidth &&
    top + height > window.pageYOffset &&
    left + width > window.pageXOffset
  );
}
