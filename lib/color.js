var rgb_per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
    Nr      = Blast.Bound.Number;

/**
 * The Color class
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Color = Fn.inherits(null, 'Elevenways.Color', function Color(input) {

	if (input) {
		this.parse(input);
	}
});

/**
 * Parse a HSLA string
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   input
 */
Color.setStatic(function addGetSet(name, model_property, index) {
	this.setProperty(name, function getter() {

		var values = this[model_property];

		if (!values) {
			return;
		}

		return values[index];
	}, function setter(new_value) {

		var values = this[model_property];

		values[index] = new_value;

		if (model_property == 'hsla') {
			this.syncFromHSLA();
		} else {
			this.syncFromRGBA();
		}
	});
});

/**
 * Parse a HSLA string
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   input
 */
Color.setStatic(function parseHSLA(input) {

	if (!input) {
		return;
	} else {
		input = input.trim().toLowerCase();
	}

	// Is it a hsla string?
	if (input[3] == 'a') {
		input = input.substr(5).split(')')[0].split(',');
	} else {
		// Determine the separator (can be a space for regular hsl)
		let sep = input.indexOf(',') > -1 ? ',' : ' ';
		input = input.substr(4).split(')')[0].split(sep);
	}

	let h = input[0],
	    s = Nr.clip(parseFloat(input[1]), 0, 100),
	    l = Nr.clip(parseFloat(input[2]), 0, 100),
	    a = parseFloat(input[3]);

	if (h.indexOf('deg') > -1) {
		h = h.substr(0, h.length - 3);
	} else if (h.indexOf('rad') > -1) {
		h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
	} else if (h.indexOf('turn') > -1) {
		h = Math.round(h.substr(0, h.length - 4) * 360);
	} else {
		h = parseFloat(h);
	}

	return [
		(h + 360) % 360,
		s,
		l,
		Nr.clip(isNaN(a) ? 1 : a, 0, 1)
	];
});

/**
 * Parse an RGBA string
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   input
 *
 * @return   {Array}
 */
Color.setStatic(function parseRGBA(input) {

	if (!input) {
		return;
	}

	if (Array.isArray(input)) {
		return input;
	}

	input = input.toLowerCase().trim();

	if (input == 'transparent') {
		return [0, 0, 0, 0];
	}

	if (input[0] === '#') {
		if (input.length < 7) {
			// convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
			input = '#' + input[1] + input[1] + input[2] + input[2] + input[3] + input[3] + (input.length > 4 ? input[4] + input[4] : '');
		}

		return [
			parseInt(input.substr(1, 2), 16),
			parseInt(input.substr(3, 2), 16),
			parseInt(input.substr(5, 2), 16),
			input.length > 7 ? parseInt(input.substr(7, 2), 16)/255 : 1
		];
	}

	let result;

	if (input.indexOf('rgb') === 0) {

		if (input.indexOf('%') > -1) {
			let match = input.match(rgb_per);

			if (!match) {
				return;
			}

			let i;
			result = [];

			for (i = 0; i < 3; i++) {
				result[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
			}

			if (match[4]) {
				result[3] = parseFloat(match[4]);
			}
		} else {
			result = input.match(/[\.\d]+/g, function(a) {
				return +a;
			});
		}
	} else {
		// Nothing matched, so we're dealing with keywords
		result = Color.color_names[input];

		if (!result) {
			return;
		} else {
			result = result.slice(0);
		}
	}

	if (result.length < 4) {
		result.push(1);
	}

	return result;
});

/**
 * Convert RGBA to HSLA
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Array}   input
 *
 * @return   {Array}
 */
Color.setStatic(function RGBAtoHSLA(input) {

	var r,
	    g,
	    b;

	if (typeof input == 'string') {
		input = Color.parseRGBA(input);
	}

	r = input[0] / 255;
	g = input[1] / 255;
	b = input[2] / 255;

	// Find greatest and smallest channel values
	let cmin  = Math.min(r, g, b),
	    cmax  = Math.max(r, g, b),
	    delta = cmax - cmin,
	    h     = 0,
	    s     = 0,
	    l     = 0;

	// Calculate hue
	// No difference
	if (delta == 0) {
		h = 0;
	} else if (cmax == r) {
		// Red is max
		h = ((g - b) / delta) % 6;
	} else if (cmax == g) {
		// Green is max
		h = (b - r) / delta + 2;
	} else {
		// Blue is max
		h = (r - g) / delta + 4;
	}

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) {
		h += 360;
	}

	// Calculate lightness
	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return [
		h,
		s,
		l,
		input[3]
	];
});

/**
 * Convert HSLA to RGBA
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Array}   input
 *
 * @return   {Array}
 */
Color.setStatic(function HSLAtoRGBA(input) {

	var h,
	    s,
	    l;

	if (typeof input == 'string') {
		input = Color.parseHSLA(input);
	}

	h = input[0];

	// Must be fractions of 1
	s = input[1] / 100;
	l = input[2] / 100;

	let c = (1 - Math.abs(2 * l - 1)) * s,
	    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
	    m = l - c/2,
	    r = 0,
	    g = 0,
	    b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
	} else if (120 <= h && h < 180) {
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return [
		r,
		g,
		b,
		input[3]
	];
});

/**
 * Convert RGBA to HWBA
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Array}   rgba
 * @param    {String|Array}   hsla   Optional hsla
 *
 * @return   {Array}
 */
Color.setStatic(function RGBAtoHWBA(rgba, hsla) {

	rgba = Color.parseRGBA(rgba);

	if (!Array.isArray(hsla)) {
		hsla = Color.RGBAtoHSLA(rgba);
	}

	let r = rgba[0],
	    g = rgba[1],
	    b = rgba[2],
	    a = rgba[3],
	    h = hsla[0];

	let whiteness = 1 / 255 * Math.min(r, Math.min(g, b)),
	    blackness = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, whiteness * 100, blackness * 100, a];
});

/**
 * Convert HWBA to RGBA
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Array}   hwba
 *
 * @return   {Array}
 */
Color.setStatic(function HWBAtoRGBA(hwba) {

	if (!Array.isArray(hwba)) {
		throw new Error('HWBA strings are not yet supported');
	}

	let h     = hwba[0] / 360,
	    wh    = hwba[1] / 100,
	    bl    = hwba[2] / 100,
	    ratio = wh + bl,
	    f;

	// Whiteness + blackness can't be bigger than 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	let i = Math.floor(6 * h),
	    v = 1 - bl;

	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	let n = wh + f * (v - wh);

	let r,
	    g,
	    b;

	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255, hwba[3]];
});

Color.addGetSet('red',   'rgba', 0);
Color.addGetSet('green', 'rgba', 1);
Color.addGetSet('blue',  'rgba', 2);

/**
 * The hsla property
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Mixed}   input
 */
Color.enforceProperty(function hsla(input) {

	var result;

	if (typeof input == 'string') {
		input = input.trim();

		if (input) {
			result = Color.parseHSLA(input);
		}
	} else if (input && Array.isArray(input)) {
		if (input.length == 3) {
			input.push(1);
		}

		result = input;
	}

	if (result) {
		let temp = Color.HSLAtoRGBA(result);
		temp.from_hsla = true;
		this.rgba = temp;
	} else if (this.rgba) {
		this.rgba = null;
	}

	return result;
});

/**
 * The rgba property
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Mixed}   input
 */
Color.enforceProperty(function rgba(input) {

	var result;

	if (typeof input == 'string') {
		input = input.trim();

		if (input) {
			result = Color.parseRGBA(input);
		}
	} else if (input && Array.isArray(input)) {
		result = input.slice(0);

		if (result.length == 3) {
			result.push(1);
		}
	}

	if (result && !input.from_hsla) {
		this.hsla = Color.RGBAtoHSLA(result);
	} else if (this.hsla) {
		this.hsla = null;
	}

	return result;
});

/**
 * The hwba property
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Mixed}   input
 */
Color.enforceProperty(function hwba(input, old_value) {

	// If explicitly setting null, clear the values
	if (input === null) {
		return;
	}

	let result;

	if (input == null) {
		result = Color.RGBAtoHWBA(this.rgba);
	} else {
		result = input;

		if (!result.length == 4) {
			result.push(1);
		}

		this.rgba = Color.HWBAtoRGBA(result);
	}

	return result;
});

/**
 * The luminosity
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type   {Number}
 */
Color.setProperty(function luminosity() {

	var rgba = this.rgba;

	if (!rgba) {
		return 0;
	}

	let chan,
	    lum = [],
	    i;

	for (i = 0; i < 3; i++) {
		chan = rgba[i] / 255;
		lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
	}

	return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
}, function setLuminosity(value) {

	var target_ratio,
	    current = this.luminosity,
	    prev = current,
	    tries = 0;

	while (tries < 30) {
		tries++;

		if (value < current) {
			target_ratio = 1 - (value / current);
		} else {
			target_ratio = 1 - (current / value);
		}

		if (target_ratio == 1) {
			// A target ratio of 1 means the current color is black
			// and we need it lighter, setting it to 50 skips a lot of loops
			target_ratio = 50;
		} else if (target_ratio >= 0.4) {
			target_ratio /= 3;
		} else if (target_ratio >= 0.3) {
			target_ratio /= 2.5;
		} else if (target_ratio >= 0.1) {
			target_ratio /= 4;
		} else if (target_ratio > 0.05) {
			target_ratio = 0.03;
		} else {
			target_ratio = 0.01;
		}

		if (value < current) {
			this.darken(target_ratio);
			prev = current;
			current = this.luminosity;

			if (current <= value || (tries > 5 && current == prev)) {
				break;
			}
		} else {
			this.lighten(target_ratio);
			prev = current;
			current = this.luminosity;

			if (current >= value || (tries > 5 && current == prev)) {
				break;
			}
		}
	}

	return current;
});

/**
 * Parse the input
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Mixed}   input
 */
Color.setMethod(function parse(input) {

	if (!input) {
		return;
	}

	let type = typeof input,
	    hsla;

	if (type == 'string') {

		let prefix = input.substring(0, 3).toLowerCase();

		if (prefix == 'hsl') {
			hsla = Color.parseHSLA(input);
		} else {
			hsla = Color.RGBAtoHSLA(input);
		}
	} else if (type == 'object') {

		if (input.a == null) {
			input.a = 1;
		}

		if (input.r != null) {
			hsla = Color.RGBAtoHSLA([input.r, input.g, input.b, input.a]);
		} else if (input.h != null) {
			hsla = [input.h, input.s, input.l, input.a];
		}
	}

	this.hsla = hsla;
});

/**
 * Sync the HSLA values to RGBA
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Color.setMethod(function syncFromHSLA() {
	this.hsla = this.hsla;
	this.hwba = null;
	return this;
});

/**
 * Sync the HWBA values to RGBA
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Color.setMethod(function syncFromHWBA() {
	this.hwba = this.hwba;
	return this;
});

/**
 * Convert this object back to a string
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Color.setMethod(function toString(type) {

	var result,
	    values;

	if (!type) {
		type = 'hsla';
	} else {
		type = type.toLowerCase();
	}

	if (type == 'hex') {
		values = this.rgba;

		result = ((Math.round(values[0]) & 0xFF) << 16)
		       + ((Math.round(values[1]) & 0xFF) << 8)
		       +  (Math.round(values[2]) & 0xFF);

		result = result.toString(16).toUpperCase();
		result = '#' + '000000'.substring(result.length) + result;
		return result;
	} else if (type == 'hsla') {
		values = this.hsla;

		let s = values[1],
		    l = values[2];

		if (!Number.isInteger(s)) {
			s = s.toFixed(1);
		}

		if (!Number.isInteger(l)) {
			l = l.toFixed(1);
		}

		result = values[0] + ', ' + s + '%' + ', ' + l + '%';
		result += ', ' + values[3];
	}

	return type + '(' + result + ')';
});

/**
 * Whiten this color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   ratio
 */
Color.setMethod(function whiten(ratio) {

	var change;

	if (this.hwba[1]) {
		change = this.hwba[1] * ratio;
	} else {
		change = ratio;
	}

	this.hwba[1] += change;

	return this.syncFromHWBA();
});

/**
 * Blacken this color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   ratio
 */
Color.setMethod(function blacken(ratio) {

	var change;

	if (this.hwba[2]) {
		change = this.hwba[2] * ratio;
	} else {
		change = ratio;
	}

	this.hwba[2] += change;

	return this.syncFromHWBA();
});

/**
 * Lighten this color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   ratio
 */
Color.setMethod(function lighten(ratio) {

	var change;

	if (this.hsla[2]) {
		change = this.hsla[2] * ratio;
	} else {
		change = ratio;
	}

	this.hsla[2] += change;

	return this.syncFromHSLA();
});

/**
 * Darken this color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   ratio
 */
Color.setMethod(function darken(ratio) {
	this.hsla[2] -= this.hsla[2] * ratio;
	return this.syncFromHSLA();
});

/**
 * Saturate this color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   ratio
 */
Color.setMethod(function saturate(ratio) {
	this.hsla[1] += this.hsla[1] * ratio;
	return this.syncFromHSLA();
});

/**
 * Desaturate this color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   ratio
 */
Color.setMethod(function desaturate(ratio) {
	this.hsla[1] -= this.hsla[1] * ratio;
	return this.syncFromHSLA();
});

/**
 * Calculate the contrast between this and the given color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Color}   other_color
 *
 * @return   {Number}
 */
Color.setMethod(function contrast(other_color) {

	if (typeof other_color == 'string') {
		other_color = new Color(other_color);
	}

	let lum1 = this.luminosity,
	    lum2 = other_color.luminosity;

	if (lum2 > lum1) {
		lum1 = lum2;
		lum2 = this.luminosity;
	}

	return (lum1 + 0.05) / (lum2 + 0.05);
});

/**
 * Calculate the level between this and the given color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Color}   other_color
 *
 * @return   {String}   AAA, AA or empty string
 */
Color.setMethod(function level(other_color) {

	var contrast_ratio = this.contrast(other_color);

	if (contrast_ratio >= 7.1) {
		return 'AAA';
	}

	return (contrast_ratio >= 4.5) ? 'AA' : '';
});

/**
 * Make this readable on the given color
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Color}   other_color
 * @param    {Number}         target_contrast
 * @param    {Boolean}        allow_changing_other_color
 *
 * @return   {Boolean}        If we succeeded in making it readable
 */
Color.setMethod(function makeReadable(other_color, target_contrast, allow_changing_other_color) {

	if (typeof other_color == 'string') {
		other_color = new Color(other_color);
		allow_changing_other_color = false;
	} else if (allow_changing_other_color == null) {
		allow_changing_other_color = true;
	}

	let contrast = this.contrast(other_color);

	if (!target_contrast) {
		target_contrast = 7.1;
	}

	// Nothing needs to be done, contrast is good!
	if (contrast >= target_contrast) {
		return;
	}

	let lum1 = this.luminosity,
	    lum2 = other_color.luminosity,
	    success;

	// The background is brighter than this,
	// so we need to make this darker
	if (lum1 > 0 && lum2 >= lum1) {
		lum1 = ((lum2 + 0.05) / target_contrast) - 0.05;
	} else {
		lum1 = ((lum2 + 0.05) * target_contrast) - 0.05;
	}

	if (lum1 < 0 || lum1 > 1) {

		if (allow_changing_other_color) {
			if (lum1 < 0) {
				// Change the other color, because we can't make this darker than possible
				success = other_color.makeReadable(this, target_contrast, false);
			} else if (lum1 > 1) {
				// Change the other color, because we can't make this lighter than possible
				success = other_color.makeReadable(this, target_contrast, false);
			}

			// Still no success? Than this color will still need to be changed,
			// but hopefully less so
			if (!success) {
				return this.makeReadable(other_color, target_contrast, false);
			}

		} else {
			success = false;
		}

		if (lum1 < 0) {
			lum1 = 0;
		} else {
			lum1 = 1;
		}
	}

	// If no other luminosity change resulted in a success
	if (!success) {
		this.luminosity = lum1;
	}

	return success;
});