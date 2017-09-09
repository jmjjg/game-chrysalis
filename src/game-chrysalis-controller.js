/*global alert, console, Date, exportToCsv, Math, $, GameStorage, GameResultsPanel, GameSettingsPanel, GameSounds, confirm, GameChrysalisModel, GameChrysalisView, Object*/
/*jslint for this*/

/**
 * Contrôleur du jeu des crysalides.
 *
 * @constructor
 */
var GameChrysalisController = function() {
	"use strict";

	this.start = null;
	this.selections = 0;
	this.hits = 0;
	this.misses = 0;
	this.events = [];
	this.defaults = {
		player: 'Quentin',
		dblclick: false,
		sound: true,
		columns: 20,
		rows: 10,
		targets: 10,
		balance: 0
	};
};

/**
 * Initialisation du jeu.
 *
 * @param {Object} defaults Les paramètres par défaut
 */
GameChrysalisController.prototype.initialize = function(defaults) {
	"use strict";

	var positions = [];

	if ('object' === typeof defaults && false === Array.isArray(defaults)) {
		this.defaults = $.extend(this.defaults, defaults);
	}

	this.models = {
		game: new GameChrysalisModel(),
		results: new GameStorage('game-chrysalis-results'),
		settings: new GameStorage('game-chrysalis-settings', this.defaults)
	};
	this.views = {
		game: new GameChrysalisView(this),
		results: new GameResultsPanel('#game-results-panel', this),
		settings: new GameSettingsPanel('#game-settings-panel', this.models.settings)
	};

	this.sounds = new GameSounds(
		{
			hit: new Audio('sounds/move.wav'),
			miss: new Audio('sounds/Paddle.wav'),
			success: new Audio('sounds/applause.wav'),
			forfeit: new Audio('sounds/Missed.wav')
		},
		this.models.settings
	);

	this.events = [];

	positions = this.models.game.positions(
		this.models.settings.read('columns'),
		this.models.settings.read('rows'),
		this.models.settings.read('targets'),
		this.models.settings.read('balance')
	);

	this.views.game.initialize(this.models.settings, positions);
	this.log({event: 'initialize', positions: positions, settings: this.models.settings.read()});

	this.views.game.redraw();
	this.start = new Date();

	this.views.results.write(this.models.results.read());
};

/**
 * Enregistre un événement du jeu.
 *
 * @param {Object} event L'événement à enregistrer
 * @returns {undefined}
 */
GameChrysalisController.prototype.log = function(event) {
	"use strict";

	event = $.extend({event: event.event, timestamp: + new Date()}, event);
	this.events.push(event);
//console.log(event);
};

/**
 * Appelé lorsqe l'utilisateur sélectionne une cellule.
 *
 * @param {Event} event L'événement ayant conduit à la sélection de la cellule
 * @returns {Boolean}
 */
GameChrysalisController.prototype.select = function(event) {
	"use strict";

	var controller = event.data.controller, target = $(event.target);
	event.preventDefault();
	event.stopPropagation();

	if(0 < $('.tile.not-found').length) {
		controller.selections+=1;

		if(true === target.hasClass('not-found')) {
			controller.hits+=1;
			controller.sounds.play('hit');
			target.removeClass('not-found');
			target.addClass('found');
			controller.log({event: 'hit', x: event.pageX, y: event.pageY, column: target.data('column'), row: target.data('row')});

			if(0 === $('.tile.not-found').length) {
				controller.finished();
			}
		} else if(true === target.hasClass('tile')) {
			controller.misses+=1;
			controller.sounds.play('miss');
			controller.log({event: 'miss', x: event.pageX, y: event.pageY, column: target.data('column'), row: target.data('row')});
		}
	}
};

/**
 * Appelé lorsque le jeu est terminé (avec succès ou par abandon).
 *
 * @returns {undefined}
 */
GameChrysalisController.prototype.finished = function() {
	"use strict";

	var start = this.start.getTime(),
		stop = new Date().getTime(),
		seconds = parseInt((stop - start)/1000, 10),
		success = 0 === $('.tile.not-found').length,
		eventName = success ? 'success' : 'forfeit',
		confirmation = 'Réellement terminer la partie ?';

	if(true === success || true === confirm(confirmation)) {
		this.views.game.finished(this.models.settings.read('player'), seconds);

		this.sounds.play(eventName);
		this.log({event: eventName});

		var results = this.models.results.read();

		results[+this.start] = {
			start: +this.start,
			stop: stop,
			seconds: seconds,
			status: eventName,
			selections: this.selections,
			hits: this.hits,
			misses: this.misses,
			events: this.events/*,
			settings: this.models.settings.read()*/
		};

		this.models.results.write(results);
		this.views.results.write(this.models.results.read());
	}
};

/**
 * Enregistre les paramètres, les applique et démarre une nouvelle partie.
 *
 * @returns {undefined}
 */
GameChrysalisController.prototype.apply = function() {
	"use strict";

	var settings = this.views.settings.read();
	this.models.settings.write(settings);
	this.initialize();
};

/**
 * Efface les données du modèle et démarre une nouvelle partie.
 *
 * @param {String} what Le modèle à effacer, settings ou results
 * @returns {undefined}
 */
GameChrysalisController.prototype.reset = function(what) {
	"use strict";

	var exception;

	if('settings' === what) {
		if(true===confirm('Remettre la configuration par défaut ?')) {
			this.models.settings.clear();
			this.initialize(this.defaults);
		}
	} else if('results' === what) {
		if(true===confirm('Réellement effacer l\'historique des parties ?')) {
			this.models.results.clear();
			this.initialize();
		}
	} else {
		exception = 'Erreur, paramètre invalide dans la fonction GameChrysalisController.prototype.reset: '+String(what);
		throw exception;
	}
};

/**
 * Visualisation d'une ancienne partie.
 *
 * @param {String} player Le nom du joueur
 * @param {String} id Le timestamp de la partie
 * @returns {undefined}
 */
GameChrysalisController.prototype.view = function(id) {
	"use strict";

	var game = this.models.results.read(id);

	if('undefined' === typeof game) {
		alert('Impossible de trouver la partie ' + id);
	} else {
		this.views.game.view(game);
	}
};

GameChrysalisController.prototype.export = function(link, filename) {
	"use strict";

	var results = this.models.results.read(),
		rows = [
			// Ligne d'en-tête
			[
				'Joueur',
				'Date'
			]
		],
		keys = Object.keys(results);

	for(var i=0;i<keys.length;i++) {
		var key = keys[i],
			result = results[key],
			settings = result.events[0].settings,
			row = [
				settings.player,
				new Date(result.start).toLocaleString('fr-FR')
			];
		rows.push(row);
	}

	return exportToCsv(link, rows, filename);
};