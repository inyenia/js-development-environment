var param = require("../swagger/paramTypes.js");
var sw = require("../swagger/swagger.js");
var swe = sw.errors;

/**
 * Load the model files
 */
var Manufacturer = require('../models/manufacturer.js');

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
exports.getAllManufacturers = {
    'spec': {
        description : "List all phone manufacturers",
        path : "/api/manufacturer/list",
        method: "GET",
        summary : "List all phone manufacturers",
        notes : "Returns a list of all phone manufacturers",
        type : "Manufacturer",
        nickname : "getAllManufacturers",
        produces : ["application/json"],
        parameters : [],
        responseMessages : [swe.invalid('manufacturers'), swe.notFound('manufacturers')]
    },
    'action': function (req,res) {
        Manufacturer.model.find(function(err, manufacturers) {
            if (err) return next(swe.invalid('manufacturers'))

            if (manufacturers) {
                res.send(manufacturers);
            } else {
                res.send(404, new Error('manufacturers not found'));
            };
        });
    }
};

/**
 * Get record by ID methods
 */
exports.getManufacturerById = {
    'spec': {
        description : "Operations about manufacturers",
        path : "/api/manufacturer/{manufId}",
        method: "GET",
        summary : "Find manufacturer by ID",
        notes : "Returns a manufacturer based on ID",
        type : "Manufacturer",
        nickname : "getManufacturerById",
        produces : ["application/json"],
        parameters : [param.path("manufId", "ID of the manufacturer to return", "string")],
        responseMessages : [swe.invalid('id'), swe.notFound('manufacturer')]
    },
    'action': function (req,res) {
        Manufacturer.model.findOne({_id: req.params.manufId}, function(err, manufacturer) {
            if (err) return res.send(404, { error: 'invalid id' });

            if (manufacturer) {
                res.send(manufacturer);
            } else {
                res.send(404, new Error('manufacturer not found'));
            }
        });
    }
};

/**
 * Add/create methods
 */
exports.addManufacturer = {
    'spec': {
        path : "/api/manufacturer",
        notes : "Adds a new manufacturer",
        summary : "Add a new manufacturer",
        method: "POST",
        parameters : [param.body("Manufacturer name", "JSON object representing the manufacturer to add", "Manufacturer")],
        responseMessages : [swe.invalid('input')],
        nickname : "addManufacturer"
    },
    'action': function(req, res, next) {
        var body = req.body;
        if(!body || !body.name){
            throw swe.invalid('manufacturer name');
        } else {
            // Create the new document (database will be updated automatically)
            Manufacturer.model.create({ name: body.name }, function (err, name) {
                if (err) return res.send(500, { error: err });

                if (name) {
                    res.send(name);
                } else {
                    res.send(500, { error: 'manufacturer not added' });
                };
            });
        }
    }
};

/**
 * Update methods
 */
exports.updateManufacturer = {
    'spec': {
        path : "/api/manufacturer",
        notes : "Update an existing manufacturer",
        summary : "Update an existing manufacturer",
        method: "PUT",
        parameters : [
            param.query("id", "Manufacturer ID to update", "string", true),
            param.query("name", "New manufacturer name to use", "string", true)
        ],
        responseMessages : [swe.invalid('input')],
        type : "Manufacturer",
        nickname : "updateManufacturer"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if(!query || !query.id) {
            throw swe.invalid('manufacturer id');
        } else if(!query || !query.name) {
            throw swe.invalid('manufacturer name');
        } else {
            // Update an existing document (database will be updated automatically)
            Manufacturer.model.update({ _id : query.id }, { name: query.name }, function (err, numRowsAffected, raw) {
                if (err) return res.send(500, { error: err });

                if (numRowsAffected > 0) {
                    res.send(raw);
                } else {
                    res.send(500, { error: 'manufacturer not updated' });
                };
            });
        }
    }
};

/**
 * Delete methods
 */
exports.deleteManufacturer = {
    'spec': {
        path : "/api/manufacturer",
        notes : "Delete an existing manufacturer",
        summary : "Delete an existing manufacturer",
        method: "DELETE",
        parameters : [
            param.query("id", "Manufacturer ID to delete", "string", true)
        ],
        responseMessages : [swe.invalid('input')],
        type : "Manufacturer",
        nickname : "updateManufacturer"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if(!query || !query.id) {
            throw swe.invalid('manufacturer id');
        } else {
            // Delete an existing document (database will be updated automatically)
            Carrier.model.remove({ _id : query.id }, function (err) {
                if (err) return res.send(500, { error: err });

                res.send(200, { 'msg' : 'ok' });
            });
        }
    }
};