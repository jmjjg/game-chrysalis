/**
 * Tests unitaires de la classe GameStorage.
 *
 * var i;
 * for(i=0;i<localStorage.length;i++){
 * 	console.log(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
 * }
 */
/*global describe, it, xit, expect, GameStorage*/
(function() {
	'use strict';

	beforeEach(function(){
		new GameStorage('game-storage-spec').clear();
	});

	describe('Test de la classe GameStorage', function() {
		describe('Le constructeur', function() {
			it('Doit initialiser des valeurs vides par défaut', function() {
				var storage = new GameStorage('game-storage-spec');
				expect(storage.read()).toEqual({});
			});
			it('Doit prendre en compte les valeurs par défaut', function() {
				var storage = new GameStorage('game-storage-spec',{'foo':'bar'});
				expect(storage.read()).toEqual({'foo':'bar'});
			});
		});
		describe('La fonction clear', function() {
			it('Doit supprimer les valeurs stockées', function() {
				var storage = new GameStorage('game-storage-spec',{'foo':'baz'});
				storage.clear();
				expect(storage.read()).toEqual({});
			});
		});
		describe('La fonction write', function() {
			it('Doit compléter les valeurs lorsqu\'elle est appelée avec 2 paramètres', function() {
				var storage = new GameStorage('game-storage-spec',{});
				storage.write('foo', 'baz');
				expect(storage.read()).toEqual({'foo':'baz'});
			});
			it('Doit compléter les valeurs lorsqu\'elles sont passées en 1 seul paramètre', function() {
				var storage = new GameStorage('game-storage-spec',{'foo':'bar','bar':'baz'});
				storage.write({'foo': 'baz'});
				expect(storage.read()).toEqual({'foo':'baz','bar':'baz'});
			});
		});
	});
} ());