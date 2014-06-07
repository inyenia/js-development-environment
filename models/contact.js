/**
* The schema and model for carrier data
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var carrierSchema = new mongoose.Schema({
	id: Number,
    name: String,
    lastName: String
});

exports.models =
	{
		"Contact":{
			"id":"Contact",
			"required": ["id", "name"],
			"properties":{
				"id":{
					"type":"integer",
					"format": "int64",
					"description": "Carrier unique identifier",
					"minimum": "0.0",
					"maximum": "100.0"
				},
				"name":{
					"type":"string",
					"description": "Contact Name"
				},
                "lastName":{
                    "type":"string",
                    "description": "Contact Last Name"
                }
			}
		}
	};

exports.model = mongoose.model('contacts', carrierSchema);