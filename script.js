var scrollPosition = 0;
var scrollSections = [].slice.call(
  document.querySelectorAll(".js-section-scroll")
);
var reverseScrollSection = [].slice
  .call(document.querySelectorAll(".js-section-scroll"))
  .reverse();
var oldScroll;
var isScrolling = false;
window.addEventListener("mousewheel", onPageScroll);

function onPageScroll() {
  // if (isScrolling) return;
  var scrollPromise;

  // if (scrollPassLastItem()) {
  //   console.log("scroll pass last item");
  //   return;
  // }

  isScrolling = true;

  if (isScrollToBottom()) {
    scrollPromise = scrollToNextSection();
  } else {
    scrollPromise = scrollToPrevSection();
  }

  scrollPromise.then(function() {
    console.log("scroll end");
    isScrolling = false;
  });
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
      return scrollAnimate(scrollSections[i]);
    }
  }
  return Promise.resolve();
}

function scrollToPrevSection() {
  for (var i = 0; i < reverseScrollSection.length; i++) {
    var sectionBottomHeight = reverseScrollSection[i].offsetTop;
    if (getScrollPosition() > sectionBottomHeight) {
      if (!elementInViewport2(reverseScrollSection[i])) break;
      return scrollAnimate(reverseScrollSection[i]);
    }
  }
  return Promise.resolve();
}

function scrollAnimate(section) {
  return new Promise(function(resolve, reject) {
    scrollIt(section, 250, "easeInCubic", function() {
      oldScroll = getScrollPosition();
      console.log("scroll animate resolve");
      resolve();
    });
  });
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

function scrollIt(destination, duration = 200, easing = "linear", callback) {
  var easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return --t * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  var start = window.pageYOffset;
  var startTime =
    "now" in window.performance ? performance.now() : new Date().getTime();

  var documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  var windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName("body")[0].clientHeight;
  var destinationOffset =
    typeof destination === "number" ? destination : destination.offsetTop;
  var destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight
      : destinationOffset
  );

  if ("requestAnimationFrame" in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    var now =
      "now" in window.performance ? performance.now() : new Date().getTime();
    var time = Math.min(1, (now - startTime) / duration);
    var timeFunction = easings[easing](time);
    window.scroll(
      0,
      Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start)
    );

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}
