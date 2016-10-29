var Game = {
	WIDTH: 1680,
	HEIGHT: 800,
	DEVICE_WIDTH: null,
	DEVICE_HEIGHT: null,
	RATIO: null,
	currentWidth: null,
	currentHeight: null,
	canvas: null,
	vCanvas: null,
	ctx: null,
	vCtx: null,
	video: null,
	scale: 1,

	muted: false,

	mouse: null,
	keys: [],
	prevKeys: [],
	players: [],
	ais: [],

	isFullscreen: false,

	init: function() {
		Game.video = document.querySelector('video');
		Game.RATIO = Game.WIDTH / Game.HEIGHT;
	    Game.currentWidth = Game.WIDTH;
	    Game.currentHeight = Game.HEIGHT;

	    Game.vCanvas = document.createElement('canvas');
	    Game.vCanvas.width = Game.WIDTH;
	    Game.vCanvas.height = Game.HEIGHT;
	    Game.vCtx = Game.vCanvas.getContext('2d');

	    Game.canvas = document.getElementsByTagName('canvas')[0];
	    Game.canvas.width = Game.WIDTH;
	    Game.canvas.height = Game.HEIGHT;

	    Game.ctx = Game.canvas.getContext('2d');

	    Game.mouse = utils.captureMouse(Game.canvas);

	    Game.resize();
	    Game.loop();

	    Game.initCamera();

	    if (typeof InstallTrigger !== 'undefined')
	    	Game.mozFPS();

	    window.addEventListener('keydown', function(e) {
	    	if (!Game.prevKeys[e.keyCode]) {
	    		Game.keys[e.keyCode] = true;
	    		Game.prevKeys[e.keyCode] = true;
	    	}
	    }, false);
	    window.addEventListener('keyup', function(e) {
	    	Game.keys[e.keyCode] = false;
	    	Game.prevKeys[e.keyCode] = false;
	    }, false);

	},

	initCamera: function() {
		function errBack(err) {
			console.log("Video capture error: ", err.code); 
		}
		if(navigator.getUserMedia) { // Standard
			navigator.getUserMedia({ "video": true }, function(stream) {
				Game.video.src = stream;
				Game.video.play();
			}, errBack);
		} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
			navigator.webkitGetUserMedia({ "video": true }, function(stream){
				Game.video.src = window.webkitURL.createObjectURL(stream);
				Game.video.play();
			}, errBack);
		}
		else if(navigator.mozGetUserMedia) { // Firefox-prefixed
			navigator.mozGetUserMedia({ "video": true }, function(stream){
				Game.video.src = window.URL.createObjectURL(stream);
				Game.video.play();
			}, errBack);
		}
	},

	resize: function() {
		Game.DEVICE_WIDTH = window.innerWidth;
	    Game.DEVICE_HEIGHT = window.innerHeight;

	    var ratio = Game.DEVICE_WIDTH / Game.DEVICE_HEIGHT,
	        scale = 1;

	    if (ratio > Game.RATIO) {
	        scale = Game.DEVICE_HEIGHT / Game.HEIGHT;
	    }
	    else if (ratio < Game.RATIO) {
	        scale = Game.DEVICE_WIDTH / Game.WIDTH;
	    }

	    Game.currentHeight = Game.HEIGHT * scale;
	    Game.currentWidth = Game.WIDTH * scale;

	    Game.scale = scale;

	    Game.canvas.style.width = Game.currentWidth + 'px';
	    Game.canvas.style.height = Game.currentHeight + 'px';
	},

	load: {
		audios: [],
		images: [],
		totalCount: 0,
		count: 0,
		per: 0,
		image: function(name, src) {
			this.totalCount++;
			var _self = this;
			this.images[name] = new Image();
			this.images[name].onload = function() {
				_self.count++;
			}
			this.images[name].src = src;
		},
		audio: function(name, src) {
			this.totalCount++;
			var _self = this;
			this.audios[name] = new Audio(src);
			this.audios[name].onloadeddata = function() {
				_self.count++;
			}
		}
	},

	state: {
		states: [],
		current: {},
		add: function(name, state) {
			Game.state.states[name] = state;
			Game.state.preload(name);
		},
		preload: function(name) {
			Game.state.states[name].preload();
		},
		start: function(name) {
			Game.state.current = Game.state.states[name];
			Game.state.current.init();
		}
	},

	update: function() {
		Game.vCtx.drawImage(Game.video, 0, 0, Game.vCanvas.width, Game.vCanvas.height);
		Game.state.current.update();
	},

	render: function() {
		Game.state.current.render();
	},

	loop: function() {
		Game.update();
		Game.render();

		window.requestAnimationFrame(Game.loop);
	},

	draw: {

		clear: function(col) {
	    	col = undefined ? "#fff" : col;
	    	Game.ctx.fillStyle = col;
        	Game.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);
	    },

	    rect: function(x, y, w, h, col, fill) {
	    	col = undefined ? "#000" : col;
	    	if (fill) {
		        Game.ctx.fillStyle = col;
		        Game.ctx.fillRect(x, y, w, h);
		    } else {
		    	Game.ctx.strokeStyle = col;
		        Game.ctx.strokeRect(x, y, w, h);
		    }
	    },

	    circle: function(x, y, r, col) {
	    	col = undefined ? "#000" : col;
	        Game.ctx.fillStyle = col;
	        Game.ctx.beginPath();
	        Game.ctx.arc(x - r / 2, y - r / 2, r, 0,  Math.PI * 2, true);
	        Game.ctx.closePath();
	        Game.ctx.fill();
	    },

	    line: function(x1, y1, x2, y2, col) {
	    	col = undefined ? "#000" : col;
	    	Game.ctx.strokeStyle = col;
	    	Game.ctx.lineWidth = 1;
	    	Game.ctx.beginPath();
	    	Game.ctx.moveTo(x1, y1);
	    	Game.ctx.lineTo(x2, y2);
			Game.ctx.stroke();
			Game.ctx.closePath();
	    },

	    text: function(string, x, y, size, col) {
	    	col = undefined ? "#000" : col;
	        Game.ctx.font = 'bold '+ size +'px norwester';
	        Game.ctx.fillStyle = col;
	        Game.ctx.fillText(string, x, y);
	    },

	    image: function(image, sx, sy, sw, sh, x, y, w, h) {
	    	Game.ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
	    }

	},

	mozFPS: function () {
	    var overlay, lastCount, lastTime, timeoutFun;

	    overlay = document.createElement('div');
	    overlay.style.background = 'rgba(0, 0, 0, .7)';
	    overlay.style.bottom = '0';
	    overlay.style.color = '#fff';
	    overlay.style.display = 'inline-block';
	    overlay.style.fontFamily = 'Arial';
	    overlay.style.fontSize = '10px';
	    overlay.style.lineHeight = '12px';
	    overlay.style.padding = '5px 8px';
	    overlay.style.position = 'fixed';
	    overlay.style.right = '0';
	    overlay.style.zIndex = '1000000';
	    overlay.innerHTML = 'FPS: -';
	    document.body.appendChild(overlay);

	    lastCount = window.mozPaintCount;
	    lastTime = performance.now();

	    (timeoutFun = function () {
	        var curCount, curTime;

	        curCount = window.mozPaintCount;
	        curTime = performance.now();
	        overlay.innerHTML = 'FPS: ' + ((curCount - lastCount) / (curTime - lastTime) * 1000).toFixed(2);
	        lastCount = curCount;
	        lastTime = curTime;
	        setTimeout(timeoutFun, 1000);
	    })();
	},

	detectColor: function() {
		var data = Game.vCtx.getImageData(0, 0, Game.vCanvas.width, Game.vCanvas.height);
		var rects = [];

		for (var j = 0; j < arguments.length; j++) {
			var minx = Game.WIDTH * 8,
				miny = Game.HEIGHT * 4,
				maxx = 0,
				maxy = 0,
				c = arguments[j];

			for (var i = 0; i < data.data.length; i += 20) {
				var r = data.data[i],
					g = data.data[i + 1],
					b = data.data[i + 2];

				var x = i % 840,
					y = ~~(i / 400);

				if (Game.dist(r, g, b, c.r, c.g, c.b) < c.a) {
					if (minx > x) {
						minx = x;
					}
					if (maxx < x) {
						maxx = x;
					}
					if (miny > y) {
						miny = y;
					}
					if (maxy < y) {
						maxy = y;
					}
				}
			}

			var w = (maxx - minx) / 8,
				h = (maxy - miny) / 4;

			rects.push({ x: minx * Game.scale,
						 y: miny * Game.scale,
						 width: w * Game.scale,
						 height: h * Game.scale });
		}

		return rects;
			// Game.ctx.strokeStyle = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
			// Game.ctx.strokeRect(minx / 4, miny / 2, w, h);
	},

	dist: function(r1, g1, b1, r2, g2, b2) {
		return Math.sqrt((r2 - r1) * (r2 - r1) + (g2 - g1) * (g2 - g1) + (b2 - b1) * (b2 - b1));
	},

	getAvrColor: function(data) {
		var r = 0,
			g = 0,
			b = 0;
		var num = data.data.length / 4;
		for (var i = 0; i < data.data.length; i += 4) {
			r += data.data[i];
			g += data.data[i + 1];
			b += data.data[i + 2];	
		}

		return { r: ~~(r / num),
				 g: ~~(g / num),
				 b: ~~(b / num) }
	},

	$: function(id) {
		return document.getElementById(id);
	}
};