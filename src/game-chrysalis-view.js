/*global $, window*/
/*jslint for*/

var onRangeChange = function(event) {
	"use strict";

	var input = $(event.target),
		label = input.closest('.form-group').find('label:first'),
		text = label.html().replace(/\(.+\)$/, '') + ' (' + input.prop('value') + ')';
	label.html(text);
	input.title = input.value;
};

/**
 * Vue du plateau de jeu pour le jeu des crysalides.
 *
 * @constructor
 */
var GameChrysalisView = function() {
	"use strict";

	return undefined;
};

/**
 * Initialisation du code HTML de la matrice de jeu avec les targets des cibles
 * à afficher.
 *
 * @param {Integer} columns Le nombre de colonnes
 * @param {Integer} rows Le nombre de lignes
 * @param {Array} targets La liste des cibles sous forme d'index dans le tableau
 * @returns {undefined}
 */
GameChrysalisView.prototype.initializeBoard = function(columns, rows, targets) {
	"use strict";

	var i, j, row, td, board;

	$('#game').html('');

	// Population des cellules
	board = $('<table id="board"></table>');
	for(i=0;i<rows;i+=1) {
		row = $('<tr></tr>');
		for(j=0;j<columns;j+=1) {
			if(-1 !== targets.indexOf(i*columns+j)) {
				td = $('<td><div class="tile not-found" data-column="' + i + '" data-row="' + j + '"></div></td>');
			} else {
				td = $('<td><div class="tile" data-column="' + i + '" data-row="' + j + '"></div></td>');
			}
			row.append(td);
		}
		board.append(row);
	}

	$('#game').append(board);
};

/**
 * Initialisation de la matrice de jeu et des événements associés au jeu.
 *
 * @param {type} controller
 * @param {type} settings
 * @param {Array} positions
 * @returns {undefined}
 */
GameChrysalisView.prototype.initialize = function(controller, settings, positions) {
	"use strict";

	$('#status').remove();

	this.initializeBoard(settings.read('columns'), settings.read('rows'), positions);

	$('#game')
		.off('click')
		.off('dblclick')
		.on(
			true === settings.read('dblclick')
				? 'dblclick'
				: 'click',
			null,
			{controller: controller},
			controller.select
		);

	$('input[type="range"]')
		.off('change')
		.on('change', onRangeChange)
		.trigger('change');

	$('input[id="columns"], input[id="rows"]').bind('change', function() {
		var targets = $('#targets'),
			max = $('#columns').val()*$('#rows').val();
		targets.prop('max', max);
		targets.val(Math.min(targets.val(), max));
		targets.trigger('change');
	});

	$(window).resize(function(){controller.redraw();});
};


/**
 * Affiche le message lorsqu'une partie est gagnée.
 *
 * @param {String} player Le nom du joueur
 * @param {Integer} seconds Le nombre de secondes mis pour gagner la partie
 * @returns {undefined}
 */
GameChrysalisView.prototype.finished = function(player, seconds) {
	"use strict";

	var message = '<div class="message"><strong>Bravo ' + player + ' !!!</strong><br/>Tu as terminé en ' + seconds + ' secondes.</div>',
		close = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
		restart = '<button type="button" class="btn btn-lg btn-success" onclick="game.initialize();return false;"><i class="glyphicon glyphicon-refresh"></i>&nbsp;Rejouer</button>',
		status = $('<div id="status" class="alert alert-success alert-dismissible well well-lg fade in" role="alert">' + close + message + restart + '</div>');

	$('body').append(status);
};