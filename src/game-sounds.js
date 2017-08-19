/*global console*/
/*jslint this*/
var GameSounds = function(sounds, settings) {
	"use strict";

	this.sounds = sounds;
	this.settings = settings;
};

GameSounds.prototype.play = function(key) {
	"use strict";

	if(true === this.settings.read('sound')) {
		try {
			if('undefined' !== typeof this.sounds[key]) {
				this.sounds[key].play();
			} else {
				console.log('Le son ' + key + ' n\'a pas été trouvé dans la liste.');
			}
		} catch (e) {
			console.log(e);
		}
	}
};