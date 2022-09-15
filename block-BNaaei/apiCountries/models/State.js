var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stateSchema = new Schema({
    name: String,
    Country: { type: mongoose.Types.ObjectId, ref: "Country" },
    population: Number,
    area: Number,
    neighbouringStates: [{ type: mongoose.Types.ObjectId, ref: "State" }]
})

var State = mongoose.model('State', stateSchema);
module.exports = State;