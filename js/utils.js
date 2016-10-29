var utils = {};

utils.isFullscreen = false;
utils.toggle = false;

utils.captureMouse = function (elem) {
  var mouse = { x: 0, y: 0, clicked: false, toggle: false };

  elem.addEventListener('mousedown', function(e) {
    if (utils.contain(mouse.x, mouse.y, { x: 10, y: 10, width: 50, height: 50 })) {
      if (!utils.isFullscreen) {
          utils.isFullscreen = true;
          if (elem.requestFullScreen) elem.requestFullScreen();
          else if (elem.webkitRequestFullScreen) elem.webkitRequestFullScreen();
          else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
          else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
        } else {
          utils.isFullscreen = false;
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
        }
    }
    if (utils.contain(mouse.x, mouse.y, { x: 10, y: 70, width: 50, height: 50 })) {
      Game.muted = !Game.muted;
    }
    mouse.clicked = true;
  });

  elem.addEventListener('mouseup', function(e) {
    mouse.clicked = false;
  });

  elem.addEventListener('mousemove', function(e) {
    var x, y;

    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElemnt.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElemnt.scrollTop;
    }

    x -= elem.offsetLeft;
    y -= elem.offsetTop;
    mouse.x = x;
    mouse.y = y;
  }, false);

  return mouse;
};

utils.captureTouch = function (elem) {
  var touch = { x: null, y: null, isPressed: false };

  elem.addEventListener('touchstart', function(e) {
    touch.isPressed = true;
  }, false);

  elem.addEventListener('touchend', function(e) {
    touch.isPressed = false;
    touch.x = null;
    touch.y = null;
  }, false);

  elem.addEventListener('touchmove', function(e) {
    var x, y, touch_event = e.touches[0];

    if (touch_event.pageX || touch_event.pageY) {
      x = touch_event.pageX;
      y = touch_event.pageY;
    } else {
      x = touch_event.clientX + document.body.scrollLeft + document.documentElemnt.scrollLeft;
      y = touch_event.clientY + document.body.scrollTop + document.documentElemnt.scrollTop;
    }
    x -= elem.offsetLeft;
    y -= elem.offsetTop;

    touch.x = x;
    touch.y = y;
  }, false);

  return touch;
};

utils.outOfScreen = function(obj, canvas) {
	return obj.x + obj.width < 0 ||
		   obj.x > canvas.width ||
		   obj.y + obj.height < 0 ||
		   obj.y > canvas.height;
};

utils.collide = function(obj1, obj2) {
	return obj1.x < obj2.x + obj2.width ||
		   obj1.x + obj1.width > obj2.x ||
		   obj1.y < obj2.y + obj2.height ||
		   obj1.y + obj1.height > obj2.y;
};

utils.contain = function(x, y, rect) {
  x /= Game.scale;
  y /= Game.scale;
  return x > rect.x && x < rect.x + rect.width &&
         y > rect.y && y < rect.y + rect.height;
};