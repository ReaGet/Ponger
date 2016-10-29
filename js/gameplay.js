var Gameplay = {
	p1Score: 0,
	p2Score: 0,
	ball: null,
	delay: 10,
	timer: 0,
	play: false,
	shake: false,
	numOfSound: 1,
	gameover: false,
	maxScore: 15,
	delayToMenu: 9,
	timerToMenu: 0,
	init: function() {
		this.p1Score = 0;
		this.p2Score = 0;
		this.play = false;
		this.gameover = false;
		this.shake = false;
		this.delay = 16;
		this.timer = 0;
		this.maxScore = 14;
		this.delayToMenu = 9;
		this.timerToMenu = 0;

		this.ball = {
	    	x: (Game.WIDTH - 40) / 2,
	    	y: (Game.HEIGHT - 40) / 2,
	    	speedX: Math.round(Math.random() * 5 + 5),
	    	speedY: 7 * (Math.round(Math.random() * 2 - 1) + 1),
	    	speed: 11,
	    	width: 40,
	    	height: 40,
	    	init: function() {
		    	this.x = (Game.WIDTH - 40) / 2;
		    	this.y = (Game.HEIGHT - 40) / 2;
		    	this.speedX = Math.round(Math.random() * 5 + 5);
		    	this.speedY = 7 * (Math.round(Math.random() * 2 - 1) + 1);
		    	this.speed = 11;
		    	Gameplay.delay = 4.8;
		    	Gameplay.timer = 0;
		    	Gameplay.play = false;
	    	},
	    	update: function() {
	    		this.x += this.speedX;
				this.y += this.speedY;

				if (this.x < 0) {
					Gameplay.p2Score++;
					this.x = 0;
					this.speedX *= -1;
					Gameplay.numOfSound = ~~((Math.random() * 2 + 1));
					Game.load.audios["hit" + Gameplay.numOfSound].play();

					this.init();
				}
				if (this.x + this.width > Game.WIDTH) {
					Gameplay.p1Score++;
					this.x = Game.WIDTH - this.width;
					this.speedX *= -1;
					Gameplay.numOfSound = ~~((Math.random() * 2 + 1));
					Game.load.audios["hit" + Gameplay.numOfSound].play();

					this.init();
				}
				if (this.y < 0) {
					this.y = 0;
					this.speedY *= -1;
					Gameplay.numOfSound = ~~((Math.random() * 2 + 1));
					Game.load.audios["hit" + Gameplay.numOfSound].play();
				}
				if (this.y + this.height > Game.HEIGHT) {
					this.y = Game.HEIGHT - this.height;
					this.speedY *= -1;
					Gameplay.numOfSound = ~~((Math.random() * 2 + 1));
					Game.load.audios["hit" + Gameplay.numOfSound].play();
				}

	    	}
	    };
	},
	preload: function() {
		Game.load.audio("hit1", "../res/audios/hit2.mp3");
		Game.load.audio("hit2", "../res/audios/hit3.mp3");
	},
	update: function() {
		if (Game.muted) {
			Game.load.audios['hit1'].volume = 0;
			Game.load.audios['hit2'].volume = 0;
		} else {
			Game.load.audios['hit1'].volume = 1;
			Game.load.audios['hit2'].volume = 1;
		}

		if (Game.keys[keycodes.ESC]) {
			Game.vCanvas.width = 1680;
	    	Game.vCanvas.height = 800;
			Game.state.start("menu");
		}

		if (!this.play) {
			if (this.timer < this.delay)
				this.timer += 0.1;
			else
				this.play = true;
		} else {
			if (!this.gameover)
				this.ball.update();
		}

		if (Game.keys[keycodes.M]) {
			if (!this.sPressed) {
				Game.muted = !Game.muted;
				this.sPressed = true;
			}
		} else {
			this.sPressed = false;
		}
	},

	render: function() {
		Game.draw.clear("#444");

		if (!this.play && !this.gameover)
			this.preShake();

		Game.draw.text(this.p1Score, Game.WIDTH / 2 - 60, 60, 50, "#fff");
		Game.draw.text(this.p2Score, Game.WIDTH / 2 + 35, 60, 50, "#fff");

		for (var i = 0; i < Game.ais.length; i++) {
			var a = Game.ais[i];
			var desty = this.ball.y - (a.height - this.ball.height) * 0.5;

			a.y += (desty - a.y) * 0.07;

			a.y = Math.max(0, Math.min(a.y, Game.HEIGHT - a.height));

			if (this.collide(a, this.ball)) {
				Game.load.audios["hit" + this.numOfSound].currentTime = 0;
				this.numOfSound = ~~((Math.random() * 2 + 1));
				Game.load.audios["hit" + this.numOfSound].play();
				this.ball.x = a.x < Game.WIDTH / 2 ? a.x + a.width : a.x - this.ball.width;
				var n = (this.ball.y + this.ball.width - a.y) / (a.height + this.ball.height);
				var phi = 0.25 * Math.PI * (2 * n - 1);

				var smash = Math.abs(phi) > 0.2 * Math.PI ? 1.5 : 1;
				this.ball.speedX = smash * this.ball.speed * (a.x < Game.WIDTH / 2 ? 1 : -1) * Math.cos(phi);
				this.ball.speedY = smash * this.ball.speed * Math.sin(phi);
			}

			Game.draw.rect(a.x, a.y, a.width, a.height, "#fff", true);
		}

		for (var i = 0; i < Game.players.length; i++) {
			var p = Game.players[i];
			var r = Game.detectColor({ r: p.color.r, g: p.color.g, b: p.color.b, a: 30 });

			p.y = r[0].y;

			if (this.collide(p, this.ball)) {
				Game.load.audios["hit" + this.numOfSound].currentTime = 0;
				this.numOfSound = ~~((Math.random() * 2 + 1));
				Game.load.audios["hit" + this.numOfSound].play();
				this.ball.x = p.x < Game.WIDTH / 2 ? p.x + p.width : p.x - this.ball.width;
				var n = (this.ball.y + this.ball.width - p.y) / (p.height + this.ball.height);
				var phi = 0.25 * Math.PI * (2 * n - 1);

				var smash = Math.abs(phi) > 0.2 * Math.PI ? 1.5 : 1;
				this.ball.speedX = smash * this.ball.speed * (p.x < Game.WIDTH / 2 ? 1 : -1) * Math.cos(phi);
				this.ball.speedY = smash * this.ball.speed * Math.sin(phi);
			}

			p.y = Math.max(0, Math.min(p.y, Game.HEIGHT - p.height));

			Game.draw.rect(p.x, p.y, p.width, p.height, "#fff", true);
		}

		Game.draw.line((Game.WIDTH - 1) / 2, 0, (Game.WIDTH - 1) / 2, Game.HEIGHT, "#fff");

		Game.draw.rect(this.ball.x, this.ball.y, this.ball.width, this.ball.height, "#fff", true);

		if (!this.play && !this.gameover) {
			if (this.timer > 5 && this.timer < 8) {
				Game.draw.text("Ready", Game.WIDTH / 2 + 35, 200, 50, "#fff");
			}
			if (this.timer > 8 && this.timer < 12) {
				Game.draw.text("Steady", Game.WIDTH / 2 + 35, 200, 50, "#fff");
			}
			if (this.timer > 12) {
				Game.draw.text("Go!", Game.WIDTH / 2 + 35, 200, 50, "#fff");
			}
			this.postShake();
		}

		if (this.p1Score > this.maxScore) {
			Game.draw.text("Left player won!!", Game.WIDTH / 2 - 465, 200, 50, "#fff");
			this.gameover = true;
		}
		if (this.p2Score > this.maxScore) {
			Game.draw.text("Right player won!!", Game.WIDTH / 2 + 75, 200, 50, "#fff");
			this.gameover = true;
		}

		if (this.gameover) {
			this.shake = true;
			if (this.timerToMenu < this.delayToMenu) {
				this.timerToMenu += 0.1;
			} else {
				Game.state.start("menu");
			}
		}
	},

	collide: function(obj1, obj2) {
		return obj1.x < obj2.x + obj2.width &&
			   obj1.x + obj1.width > obj2.x &&
			   obj1.y < obj2.y + obj2.height &&
			   obj1.y + obj1.height > obj2.y;
	},

	lerp: function(v0, v1, t) {
		return (1 - t) * v0 + t * v1;
	},
	shakeX: 0,
	shakeY: 0,
	preShake: function() {
		Game.ctx.save();
	  	var dx = Math.random() * 10;
	  	var dy = Math.random() * 10;
	  	var vx = (dx - this.shakeX) * 0.5,
	  		vy = (dy - this.shakeY) * 0.5;

	  	this.shakeX += vx;
	  	this.shakeY += vy;

	  	Game.ctx.translate(this.shakeX, this.shakeY);  
	},

	postShake: function() {
		Game.ctx.restore();
	}
};

Game.state.add("gameplay", Gameplay);
// Game.state.start("gameplay");