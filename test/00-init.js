var assert = require('assert'),
    Color  = require('../index.js');

describe('Color', function() {

	describe('Parsing RGB values', function() {
		var tests = [
			['#FF0000', 'hsla(0, 100%, 50%, 1)', [255, 0, 0, 1], [0, 100, 50, 1]],
			['#ff0000', 'hsla(0, 100%, 50%, 1)', [255, 0, 0, 1], [0, 100, 50, 1]],
			['rgba(66, 189, 117, 0.87)', 'hsla(145, 48.2%, 50%, 0.87)'],
			[{r: 255, g: 0, b: 0}, 'hsla(0, 100%, 50%, 1)', [255, 0, 0, 1], [0, 100, 50, 1]],
			[{r: 66, g: 189, b: 117, a: 0.87}, 'hsla(145, 48.2%, 50%, 0.87)'],
			[{r: 255, g: 255, b: 0}, 'hsla(60, 100%, 50%, 1)'],
			['yellow', 'hsla(60, 100%, 50%, 1)']
		];

		createParseTests(tests);
	});

	describe('Parsing HSL values', function() {
		var tests = [
			['hsl(3.14rad,100%,50%)', 'hsla(180, 100%, 50%, 1)'],
			['hsl(145, 48%, 50%)', 'hsla(145, 48%, 50%, 1)'],
			[{h: 145, s: 48, l: 50}, 'hsla(145, 48%, 50%, 1)']
		];

		createParseTests(tests);
	});

	describe('#lighten()', function() {
		it('should lighten the color', function() {

			var color = new Color('hsl(100, 50, 60)');
			color.lighten(0.5);

			assert.strictEqual(color.toString(), 'hsla(100, 50%, 90%, 1)');

			assert.deepStrictEqual(color.rgba, [225, 242, 217, 1]);
		});
	});

	describe('#darken()', function() {
		it('should darken the color', function() {

			var color = new Color('hsl(100, 50, 60)');
			color.darken(0.5);

			assert.strictEqual(color.toString(), 'hsla(100, 50%, 30%, 1)');
		});
	});

	describe('#whiten()', function() {
		it('should whiten the color', function() {

			var color = new Color('hsl(100, 50, 60)');
			color.whiten(0.5);

			assert.strictEqual(color.toString(), 'hsla(100, 33.3%, 70%, 1)');
		});
	});

	describe('#blacken()', function() {
		it('should blacken the color', function() {

			var color = new Color('hsl(100, 50, 60)');
			color.blacken(0.5);

			assert.strictEqual(color.toString(), 'hsla(100, 33.3%, 55%, 1)');
		});
	});

	describe('#saturate()', function() {
		it('should saturate the color', function() {

			var color = new Color('#88CC66');
			color.saturate(0.5);

			assert.strictEqual(color.toString('hex'), '#7FE64C');
		});
	});

	describe('#desaturate()', function() {
		it('should desaturate the color', function() {

			var color = new Color('#88CC66');
			color.desaturate(0.5);

			assert.strictEqual(color.toString('hex'), '#91B380');
		});
	});

	describe('#level(color)', function() {
		it('should return the level', function() {

			var white = new Color('white'),
			    black = new Color('black'),
			    grey  = new Color('grey'),
			    red   = new Color('red');

			assert.strictEqual(white.level(black), 'AAA');
			assert.strictEqual(grey.level(black), 'AA');
			assert.strictEqual(black.level(red), 'AA');
			assert.strictEqual(white.level(white), '');
		});
	});

	describe('#makeReadable(other_color)', function() {
		it('should make one color readable on the other colour', function() {

			var yellow = new Color('yellow');

			assert.strictEqual(yellow.toString('hex'), '#FFFF00');

			let contrast = yellow.contrast('white').toFixed(2);

			assert.strictEqual(contrast, '1.07');

			yellow.makeReadable('white');

			assert.strictEqual(yellow.contrast('white') >= 7, true);
		});
	});
});

function createParseTests(tests) {

	for (let i = 0; i < tests.length; i++) {
		let test = tests[i],
		    title = 'should parse ' + JSON.stringify(test[0]);

		it(title, function() {
			let instance = new Color(test[0]);
			assert.strictEqual(String(instance), test[1]);

			if (test[2]) {
				assert.deepStrictEqual(instance.rgba, test[2]);
			}

			if (test[3]) {
				assert.deepStrictEqual(instance.hsla, test[3]);
			}
		});
	}
}