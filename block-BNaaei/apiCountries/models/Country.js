var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countrySchema = new Schema({
    name: { type: String },
    states: [{ type: mongoose.Types.ObjectId, ref: 'State' }],
    continent: String,
    population: Number,
    ethnicity: [String],
    neighbouringCountries: [{ type: mongoose.Types.ObjectId, ref: 'Country' }],
    area: Number,
})

var Country = mongoose.model('Country', countrySchema);
module.exports = Country;