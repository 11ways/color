var assert = require('assert'),
    Color  = require('../index.js');

describe('Color', function() {

	describe('Parsing RGB values', function() {
		var tests = [
			['#FF0000', 'hsla(0,100,50,1)', [255, 0, 0, 1], [0, 100, 50, 1]],
			['#ff0000', 'hsla(0,100,50,1)', [255, 0, 0, 1], [0, 100, 50, 1]],
			['rgba(66, 189, 117, 0.87)', 'hsla(145,48.2,50,0.87)']
		];

		createParseTests(tests);
	});

	describe('Parsing HSL values', function() {
		var tests = [
			['hsl(3.14rad,100%,50%)', 'hsla(180,100,50,1)'],
			['hsl(145, 48%, 50%)', 'hsla(145,48,50,1)']
		];

		createParseTests(tests);
	});

	describe('#lighten()', function() {
		it('should lighten the color', function() {

			var color = new Color('hsl(100, 50, 60)');
			color.lighten(0.5);

			assert.strictEqual(color.toString(), 'hsla(100,50,90,1)');

			assert.deepStrictEqual(color.rgba, [225, 242, 217, 1]);
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
});

function createParseTests(tests) {

	for (let i = 0; i < tests.length; i++) {
		let test = tests[i],
		    title = 'should parse ' + test[0];

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