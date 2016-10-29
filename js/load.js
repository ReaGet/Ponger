var Load = {
	loading: false,
	loaded: false,
	alpha: 0,
	splash: false,
	delay: 0,
	box: {
		x: (Game.WIDTH - 60) / 2,
		y: (Game.HEIGHT - 60) / 2,
		width: 60,
		height: 60,
		angle: 0,
	},
	init: function() {

	},

	preload: function() {
		
	},

	update: function() {
		Game.load.per = Game.load.count / Game.load.totalCount;
		if (!this.loading) {
			Game.load.image("logo", "../res/images/logo.png");

			this.loading = true;
		}
	},

	render: function() {
		Game.draw.clear("#fff");

		if (!this.loaded) {
			this.box.angle += 0.2;
			var offsetY = this.box.y + Math.cos(this.box.angle) * 10;
			var offsetH = this.box.height + Math.sin(this.box.angle) * 5;

			Game.draw.rect(this.box.x, offsetY, this.box.width, offsetH * Game.load.per, "#333", true);

			if (Game.load.totalCount == Game.load.count) {
				Game.draw.rect(0, 0, Game.WIDTH, Game.HEIGHT, "rgba(255, 255, 255," + this.alpha + ")", true);
				var vx = (1 - this.alpha) * 0.05;
				this.alpha += vx;
				if (Math.round(this.alpha * 10) == 10) {
					this.delay += 0.1;
					if (this.delay > 10) {
						this.delay = 0;
						this.loaded = true;
					}
				}
			}
		} else {
			Game.ctx.drawImage(Game.load.images['logo'], (Game.WIDTH - 500) / 2, (Game.HEIGHT - 500) / 2);
			Game.draw.rect(0, 0, Game.WIDTH, Game.HEIGHT, "rgba(255, 255, 255," + this.alpha + ")", true);
			if (!this.splash) {
				var vx = (0 - this.alpha) * 0.05;
				this.alpha += vx;
			} else {
				this.delay += 0.1;
				if (this.delay > 6) {
					var vx = (1 - this.alpha) * 0.03;
						this.alpha += vx;
				}
				if (this.delay > 8) {
					if (Math.round(this.alpha * 10) == 10)
						Game.state.start("menu");
				}
			}
			if (Math.round(this.alpha * 10) == 0) {
				this.splash = true;
			}
		}
	}

};

Game.state.add("load", Load);
Game.state.start("load");