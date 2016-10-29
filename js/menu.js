var Menu = {
	angle: 0,
	p1Accepted: 0,
	p1Pressed: false,
	p2Accepted: 0,
	p2Pressed: false,
	sPressed: false,
	cardColor1: "rgb(204, 62, 143)",
	cardColor2: "rgb(129, 210, 55)",
	card1WhiteBox: { },
	card2WhiteBox: { },
	cardsHeadY: 260,
	textAlpha: 0,
	canPlay: false,
	p1Color: null,
	p2Color: null,
	easing: 0.09,
	soundPlayCount: 0,
	card1WhiteBox: {
		x: 0,
		y: 0,
		width: Game.WIDTH / 2,
		height: Game.HEIGHT
	},
	card2WhiteBox: {
		x: Game.WIDTH / 2,
		y: 0,
		width: Game.WIDTH / 2,
		height: Game.HEIGHT
	},
	init: function() {
		Game.players = [];
		Game.ais = [];
		this.angle = 0;
		this.p1Accepted = 0;
		this.p1Pressed = false;
		this.p2Accepted = 0;
		this.p2Pressed = false;
		this.cardColor1 = "rgb(204, 62, 143)";
		this.cardColor2 = "rgb(129, 210, 55)";
		this.p1Color = null;
		this.p2Color = null;

		Game.load.audios['swipe'].play();
	},
	preload: function() {
		Game.load.audio("swipe", "../res/audios/swipe.mp3");
		Game.load.audio("ding1", "../res/audios/ding1.mp3");
		Game.load.image("fullscreen", "../res/images/fullscreen.png");
		Game.load.image("muted", "../res/images/mute.png");
		Game.load.image("unmuted", "../res/images/speaker.png");
	},
	update: function() {
		// if (Game.mouse.clicked) {
		// 	Game.mouse.toggle = this.contain(Game.mouse.x, Game.mouse.y, { x: 10, y: 10, width: 50, height: 50 });
		// 	console.log(this.contain(Game.mouse.x, Game.mouse.y, { x: 10, y: 10, width: 50, height: 50 }));
		// }

		if (Game.muted) {
			Game.load.audios['swipe'].volume = 0;
			Game.load.audios['ding1'].volume = 0;
		} else {
			Game.load.audios['swipe'].volume = 1;
			Game.load.audios['ding1'].volume = 1;
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
		Game.draw.clear("#2e2e2e");

		Game.ctx.drawImage(Game.load.images["fullscreen"], 10, 10, 50, 50);
		if (!Game.muted)
			Game.ctx.drawImage(Game.load.images["unmuted"], 10, 70, 50, 50);
		else
			Game.ctx.drawImage(Game.load.images["muted"], 10, 70, 50, 50);

		this.angle += 0.1;

		if (Game.keys[keycodes.Z] && this.canPlay) {
			if (!this.p1Pressed) {
				if (this.p1Accepted < 2)
					this.p1Accepted++;

				this.p1Pressed = true;
			}
		} else {
			this.p1Pressed = false;
		}

		if (~~this.card1WhiteBox.width == 260 && ~~this.card1WhiteBox.height == 320) {
			if (this.soundPlayCount == 1) {
				this.soundPlayCount++;
				Game.load.audios['swipe'].play();
			}
			var vYy = (200 - this.cardsHeadY) * 0.06;
			this.cardsHeadY += vYy;
		}

		if (~~this.cardsHeadY == 200) {
			if (this.soundPlayCount == 2) {
				this.soundPlayCount++;
				Game.load.audios['ding1'].play();
			}
			var vta = (1 - this.textAlpha) * 0.05;
				this.textAlpha += vta;
		}

		if (!this.canPlay) {
			if (this.soundPlayCount == 0) {
				this.soundPlayCount++;
				Game.load.audios['swipe'].play();
			}
			var v1x = (340 - this.card1WhiteBox.x) * this.easing;
			var v1y = (260 - this.card1WhiteBox.y) * this.easing;
			var v1w = (260 - this.card1WhiteBox.width) * this.easing;
			var v1h = (320 - this.card1WhiteBox.height) * this.easing;
			this.card1WhiteBox.x += v1x;
			this.card1WhiteBox.y += v1y;
			this.card1WhiteBox.width += v1w;
			this.card1WhiteBox.height += v1h;
			var v2x = (Game.WIDTH - 338 - 260 - this.card2WhiteBox.x) * this.easing;
			var v2y = (260 - this.card2WhiteBox.y) * this.easing;
			var v2w = (260 - this.card2WhiteBox.width) * this.easing;
			var v2h = (320 - this.card2WhiteBox.height) * this.easing;
			this.card2WhiteBox.x += v2x;
			this.card2WhiteBox.y += v2y;
			this.card2WhiteBox.width += v2w;
			this.card2WhiteBox.height += v2h;
		}

		if (Math.round(this.textAlpha * 10) == 10)
			this.canPlay = true;

		// Game.draw.rect(338, this.cardsHeadY - 2, 264, 324, this.cardColor1, true);
		Game.draw.rect(340, this.cardsHeadY, 260, 60, this.cardColor1, true);
		// Game.draw.rect(340, 200, 260, 380, "#fff", true);
		Game.draw.rect(this.card1WhiteBox.x, 
					   this.card1WhiteBox.y, 
					   this.card1WhiteBox.width, 
					   this.card1WhiteBox.height, "#fff", true);

		if (!this.p1Accepted) {
			Game.draw.text("unknown", 350, this.cardsHeadY + 44, 40, "#fff"); //player one
			Game.draw.text("press", 420, 380, 40, "rgba(46, 46, 46, " + this.textAlpha + ")");
			Game.draw.circle(486, 450, 30 + Math.sin(this.angle * 0.7) / 2, "rgba(49, 179, 226, " + this.textAlpha + ")");
			Game.draw.circle(486, 450, 27 + Math.cos(this.angle * 0.7) / 2, "rgba(71, 192, 232, " + this.textAlpha + ")");
			Game.draw.text("Z", 460, 450, 40, "rgba(255, 255, 255, " + this.textAlpha + ")");
			Game.draw.text("to enter", 400, 514, 40, "rgba(46, 46, 46, " + this.textAlpha + ")");
		} else {
			Game.draw.text("Player1", 350, 244, 40, "#fff"); //player one
			
			var data1 = Game.vCtx.getImageData(Game.WIDTH - 260, 260, 260, 320);

			if (this.p1Accepted < 2) {
				this.p1Color = Game.getAvrColor(data1);
				this.cardColor1 = "rgb(" + this.p1Color.r + ", " + this.p1Color.g + ", " + this.p1Color.b + ")";
			}

			Game.ctx.putImageData(data1, 340, 260);

			Game.draw.text("press Z again", 340, 616, 30, "#9c9c9c");
		}

		this.angle += 0.1;

		if (Game.keys[keycodes.X] && this.canPlay) {
			if (!this.p2Pressed) {
				if (this.p2Accepted < 2)
					this.p2Accepted++;

				this.p2Pressed = true;
			}
		} else {
			this.p2Pressed = false;
		}

		//Second card
		// Game.draw.rect(Game.WIDTH - 338 - 262, this.cardsHeadY - 2, 264, 324, this.cardColor2, true);  // 000
		Game.draw.rect(Game.WIDTH - 338 - 260, this.cardsHeadY, 260, 60, this.cardColor2, true);  // 000
		// Game.draw.rect(Game.WIDTH - 338 - 260, 200, 260, 380, "#fff", true);
		Game.draw.rect(this.card2WhiteBox.x, 
					   this.card2WhiteBox.y, 
					   this.card2WhiteBox.width, 
					   this.card2WhiteBox.height, "#fff", true);

		if (!this.p2Accepted) {
			Game.draw.text("unknown", Game.WIDTH - 260 - 328, this.cardsHeadY + 44, 40, "#fff"); //player two
			Game.draw.text("press", Game.WIDTH - 520, 380, 40, "rgba(46, 46, 46, " + this.textAlpha + ")");
			Game.draw.circle(Game.WIDTH - 456, 450, 30 + Math.sin(this.angle) / 2, "rgba(49, 179, 226, " + this.textAlpha + ")"); // 45e031
			Game.draw.circle(Game.WIDTH - 456, 450, 27 + Math.cos(this.angle) / 2, "rgba(71, 192, 232, " + this.textAlpha + ")"); // 59f444
			Game.draw.text("X", Game.WIDTH - 480, 450, 40, "rgba(255, 255, 255, " + this.textAlpha + ")");
			Game.draw.text("to enter", Game.WIDTH - 546, 514, 40, "rgba(46, 46, 46, " + this.textAlpha + ")");
		} else {
			Game.draw.text("Player2", Game.WIDTH - 260 - 328, 244, 40, "#fff"); //player two

			Game.draw.text("press X again", Game.WIDTH - 260 - 338, 616, 30, "#9c9c9c");
			
			var data2 = Game.vCtx.getImageData(0, 260, 260, 320);

			if (this.p2Accepted < 2) {
				this.p2Color = Game.getAvrColor(data2);
				this.cardColor2 = "rgb(" + this.p2Color.r + ", " + this.p2Color.g + ", " + this.p2Color.b + ")";
			}

			Game.ctx.putImageData(data2, Game.WIDTH - 338 - 260, 260);
		}

		if (this.p1Accepted == 2)
			Game.draw.text("Press ENTER to start game",  150, 40, 21, "#9c9c9c");
		if (this.p2Accepted == 2)
			Game.draw.text("Press ENTER to start game",  Game.WIDTH - 400, 40, 21, "#9c9c9c");

		if (this.p1Accepted == 2 || this.p2Accepted == 2) {
			if (Game.keys[keycodes.ENTER]) {
				if (this.p1Accepted == 2) {
					Game.players.push({
						name: "player1",
						x: 60,
						y: (Game.HEIGHT - 200) / 2,
						prevY: 0,
						width: 40,
						height: 200,
						color: this.p1Color
					});
				} else {
					Game.ais.push({
						name: "ai1",
						x: 60,
						y: (Game.HEIGHT - 200) / 2,
						width: 40,
						height: 200
					});
				}
				if (this.p2Accepted == 2) {
					Game.players.push({
						name: "player2",
						x: Game.WIDTH - 60 - 40,
						y: (Game.HEIGHT - 200) / 2,
						prevY: 0,
						width: 40,
						height: 200,
						color: this.p2Color
					});
				} else {
					Game.ais.push({
						name: "ai2",
						x: Game.WIDTH - 60 - 40,
						y: (Game.HEIGHT - 200) / 2,
						width: 40,
						height: 200
					});
				}
				Game.vCanvas.width = Game.WIDTH / 8;
	    		Game.vCanvas.height = Game.HEIGHT / 8;
				Game.state.start("gameplay");
			}
		}

		Game.draw.line((Game.WIDTH - 1) / 2, 0, (Game.WIDTH - 1) / 2, Game.HEIGHT, "#fff");
	},

	contain: function(x, y, rect) {
		x /= Game.scale;
		y /= Game.scale;
		return x > rect.x && x < rect.x + rect.width &&
			   y > rect.y && y < rect.y + rect.height;
	}
};

Game.state.add("menu", Menu);
// Game.state.start("menu");