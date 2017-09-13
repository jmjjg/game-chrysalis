/*global is_object, JSON, localStorage, Object*/
/*jslint this*/

/**
 * Classe de stockage de données par clé, live et persistant dans localStorage.
 * Les lectures se font en live et le stockage se fait à la fois en live et dans
 * le localStorage.
 *
 * @constructor
 * @param {String} name Nom de la clé de stockage dans localStorage
 * @param {Object} defaults Les valeurs par défaut
 */
var GameStorage = function(name, defaults) {
	"use strict";

	this.name = name;
	this.defaults = 'undefined' === typeof defaults ? {} : defaults;
	this.data = localStorage.getItem(this.name);
	this.data = null === this.data ? {} : JSON.parse(this.data);

	this.data = Object.assign({}, this.defaults, this.data);
};

/**
 * Suppression des données stockées.
 *
 * @returns {undefined}
 */
GameStorage.prototype.clear = function() {
	"use strict";

	localStorage.removeItem(this.name);
	this.data = {};
};

/**
 * Persistance dans localStorage des données stockées live.
 *
 * @returns {undefined}
 */
GameStorage.prototype.persist = function() {
	"use strict";

	localStorage.setItem(this.name, JSON.stringify(this.data));
};

/**
 * Retourne les données stockées live sous une certaine clé ou une valeur par
 * défaut si celle-ci n'existe pas.
 *
 * @param {String} key La clé à lire
 * @param {*} defaults La valeur par défaut à retourner si la clé n'existe pas
 * @returns {*}
 */
GameStorage.prototype.read = function(key, defaults) {
	"use strict";

	var value;
	defaults = 'undefined' === typeof defaults ? null : defaults;

	if('undefined' === typeof key) {
		value = this.data;
	} else {
		value = this.data[key];
		if('undefined' === typeof value) {
			value = defaults;
		}
	}
	return value;
};

/**
 * Stocke une valeur sous une certaine clé ou un objet contenant des clés et des
 * valeurs en live et persiste ensuite dans localStorage.
 *
 * @param {String|Object} key La clé où stocker la valeur ou l'objet à stocker
 * @param {*} value La valeur à stocker
 * @returns {undefined}
 */
GameStorage.prototype.write = function(key, value) {
	"use strict";

	if(is_object(key)) {
		this.data = Object.assign({}, this.data, key);
	} else {
		this.data[key] = value;
	}

	this.persist();
};

/**
 * Retourne la liste des clés des paramètres par défaut.
 *
 * @returns {Array}
 */
GameStorage.prototype.keys = function() {
	"use strict";

	return Object.keys(this.defaults);
};