var Elevenways,
    Blast;

// Get an existing Protoblast instance or create a new one
if (typeof __Protoblast != 'undefined') {
	Blast = __Protoblast;
} else {
	Blast = require('protoblast')(false);
}

// Get the Elevenways namespace
Elevenways = Blast.Bound.Function.getNamespace('Elevenways');

// Set the argument info
Blast.arguments.elevenways = {
	names  : ['Elevenways', 'Blast', 'Bound',      'Classes',      'Fn'],
	values : [ Elevenways,   Blast,   Blast.Bound,  Blast.Classes,  Blast.Collection.Function]
};

options = {

	// The directory to start looking in
	pwd        : __dirname,

	// Make sure Blast doesn't add this to any client-side files
	client     : false,

	// The argument configuration to use for the wrapper function
	arguments  : 'elevenways'
};

Blast.requireAll([
	['color'],
	['color_names']
], options);

// Export the Vrtnu namespace
module.exports = Elevenways.Color;