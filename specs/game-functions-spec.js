/**
 * Tests unitaires des fonctions utilitaires
 */
/*global describe, it, xit, expect, isObject, shuffle*/
(function() {
	'use strict';

	describe('La fonction isObject', function() {
		it('doit retourner vrai lorsqu\'elle est appelée avec un objet', function() {
			expect(isObject({})).toEqual(true);
		});
		it('doit retourner faux lorsqu\'elle est appelée avec autre chose qu\'un objet', function() {
			expect(isObject([])).toEqual(false);
			expect(isObject(true)).toEqual(false);
			expect(isObject(false)).toEqual(false);
			expect(isObject(null)).toEqual(false);
			expect(isObject(5)).toEqual(false);
			expect(isObject(5.6)).toEqual(false);
			expect(isObject("")).toEqual(false);
			expect(isObject(undefined)).toEqual(false);
		});
	});

	describe('La fonction shuffle', function() {
		it('doit retourner une copie de l\'array passé en paramètre avec les valeurs randomisées', function() {
			var array = [0,1,1,2,3,5,8,13,21],
				shuffled = shuffle(array),
				reordered = shuffled.slice().sort(function(a,b){return a-b;});

			expect(shuffled).not.toEqual(array);
			expect(reordered).toEqual(array);
		});
	});

} ());