var sw = require("swagger-node-express");
var swe = sw.errors;

/**
 * Load the model files
 */
var Carrier = require('../models/carrier.js');

/**
 * All methods and the database connection info for the API
 *
 * Everything inside of "spec" is for the documentation that Swagger generates,
 * everything in "actions" is the business end of things and that's where the
 * actual work is done
 *
 * Inside of spec...
 * 	@property path The path used to access the method
 * 	@property notes A longer version of what the operation does (shows up in the
 * 		"Implementation Notes" part of a methods decription when the method is
 *		expanded on the documentation page)
 * 	@property summary Short summary of what the operation does (shows up on the same line as
 *		the "path" when the method is hidden on the documentation page)
 * 	@property method The HTTP method used for the Operations
 * 	@property parameters Inputs to the methods (can be a blank array if no inputs are needed)
 * 	@property type The data type returned by the method. Can be void, a simple-type, a complex,
 or a container (more info at: https://github.com/wordnik/swagger-core/wiki/datatypes)
 * 	@property items An array of the model definitions
 * 	@property responseMessages Describes how messages from the method maps to the API logic
 * 	@property errorResponses Describes how errors messages from the method maps to the API logic
 * 	@property nickname Used to provide a shebang (#!) in the swagger-ui
 */

/**
 * List methods
 */
exports.getAllCarriers = {
    'spec': {
        description : "List all phone carriers",
        path : "/carrier/list",
        basePath : "/api",
        method: "GET",
        summary : "List all phone carriers",
        notes : "Returns a list of all phone carriers",
        type : "Carrier",
        nickname : "getAllCarriers",
        produces : ["application/json"],
        parameters : [],
        responseMessages : [swe.invalid('carriers'), swe.notFound('carriers')]
    },
    'action': function (req,res) {
        Carrier.model.find(function(err, carriers) {
            if (err) return next(swe.invalid('carriers'))

            if (carriers) {
                res.send(carriers);
            } else {
                res.send(404, swe.notFound('carriers'));
            };
        });
    }
};

/**
 * Get record by ID methods
 */
exports.getCarrierById = {
    'spec': {
        description : "Operations about carriers",
        path : "/api/carrier/{carrierId}",
        method: "GET",
        summary : "Find carrier by ID",
        notes : "Returns a carrier based on ID",
        type : "Carrier",
        nickname : "getCarrierById",
        produces : ["application/json"],
        parameters : [sw.pathParam("carrierId", "ID of the carrier to return", "string")],
        responseMessages : [swe.invalid('id'), swe.notFound('carrier')]
    },
    'action': function (req,res) {
        Carrier.model.findOne({_id: req.params.carrierId}, function(err, carrier) {
            if (err) return res.send(404, { error: 'invalid id' });

            if (carrier) {
                res.send(carrier);
            } else {
                res.send(404, new Error('carrier not found'));
            }
        });
    }
};

/**
 * Add/create methods
 */
exports.addCarrier = {
    'spec': {
        path : "/api/carrier",
        notes : "Adds a new carrier",
        summary : "Add a new carrier",
        method: "POST",
        parameters : [sw.bodyParam("Carrier name", "JSON object representing the carrier to add", "Carrier")],
        responseMessages : [swe.invalid('input')],
        nickname : "addCarrier"
    },
    'action': function(req, res, next) {
        var body = req.body;
        if(!body || !body.name){
            throw swe.invalid('carrier name');
        } else {
            // Create the new document (database will be updated automatically)
            Carrier.model.create({ name: body.name }, function (err, name) {
                if (err) return res.send(500, { error: err });

                if (name) {
                    res.send(name);
                } else {
                    res.send(500, { error: 'carrier not added' });
                };
            });
        }
    }
};

/**
 * Update methods
 */
exports.updateCarrier = {
    'spec': {
        path : "/api/carrier",
        notes : "Update an existing carrier",
        summary : "Update an existing carrier",
        method: "PUT",
        //parameters : [param.body("Carrier ID", "Carrier ID to update", "Carrier"), param.body("Carrier name", "New carrier name", "Carrier")],
        parameters : [
            sw.queryParam("id", "Carrier ID to update", "string", true),
            sw.queryParam("name", "New carrier name to use", "string", true)
        ],
        responseMessages : [swe.invalid('input')],
        type : "Carrier",
        nickname : "updateCarrier"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if(!query || !query.id) {
            throw swe.invalid('carrier id');
        } else if(!query || !query.name) {
            throw swe.invalid('carrier name');
        } else {
            // Update an existing document (database will be updated automatically)
            Carrier.model.update({ _id : query.id }, { name: query.name }, function (err, numRowsAffected, raw) {
                if (err) return res.send(500, { error: err });

                if (numRowsAffected > 0) {
                    res.send(raw);
                } else {
                    res.send(500, { error: 'carrier not updated' });
                };
            });
        }
    }
};

/**
 * Delete methods
 */
exports.deleteCarrier = {
    'spec': {
        path : "/api/carrier",
        notes : "Delete an existing carrier",
        summary : "Delete an existing carrier",
        method: "DELETE",
        parameters : [
            sw.queryParam("id", "Carrier ID to delete", "string", true)
        ],
        responseMessages : [swe.invalid('input')],
        type : "Carrier",
        nickname : "updateCarrier"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if(!query || !query.id) {
            throw swe.invalid('carrier id');
        } else {
            // Delete an existing document (database will be updated automatically)
            Carrier.model.remove({ _id : query.id }, function (err) {
                if (err) return res.send(500, { error: err });

                res.send(200, { 'msg' : 'ok' });
            });
        }
    }
};