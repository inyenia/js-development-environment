var sw = require("swagger-node-express");
var swe = sw.errors;

/**
 * Load the model files
 */
var Phone = require('../models/phone.js');

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
exports.getAllPhones = {
    'spec': {
        description : "List all phone models",
        path : "/api/phone",
        method: "GET",
        summary : "List all phone models",
        notes : "Returns a list of all phone models",
        type : "Phone",
        nickname : "getAllPhones",
        produces : ["application/json"],
        parameters : [],
        responseMessages : [swe.invalid('phones'), swe.notFound('phones')]
    },
    'action': function (req,res) {
        Phone.model.find(function(err, phones) {
            if (err) return next(swe.invalid('phones'))

            if (phones) {
                res.send(phones);
            } else {
                res.send(404, new Error('phones not found'));
            };
        });
    }
};

/**
 * Get record by ID methods
 */
exports.getPhoneById = {
    'spec': {
        description : "Operations about phones",
        path : "/api/phone/{phoneId}",
        method: "GET",
        summary : "Find phone by ID",
        notes : "Returns a phone based on ID",
        type : "Phone",
        nickname : "getPhoneById",
        produces : ["application/json"],
        parameters : [sw.pathParam("phoneId", "ID of the phone to return", "string")],
        responseMessages : [swe.invalid('id'), swe.notFound('phone')]
    },
    'action': function (req,res) {
        Phone.model.findOne({_id: req.params.phoneId}, function(err, phone) {
            if (err) return res.send(404, { error: 'invalid id' });

            if (phone) {
                res.send(phone);
            } else {
                res.send(404, new Error('phone not found'));
            }
        });
    }
};

/**
 * Add/create methods
 */
exports.addPhone = {
    'spec': {
        path : "/api/phone",
        notes : "Adds a new phone",
        summary : "Add a new phone",
        method: "POST",
        parameters : [sw.bodyParam("Phone name", "JSON object representing the phone to add", "Phone")],
        responseMessages : [swe.invalid('input')],
        nickname : "addPhone"
    },
    'action': function(req, res, next) {
        var body = req.body;
        if(!body || !body.name){
            throw swe.invalid('phone name');
        } else {
            // Create the new document (database will be updated automatically)
            Phone.model.create({ name: body.name }, function (err, name) {
                if (err) return res.send(500, { error: err });

                if (name) {
                    res.send(name);
                } else {
                    res.send(500, { error: 'phone not added' });
                };
            });
        }
    }
};

/**
 * Update methods
 */
exports.updatePhone = {
    'spec': {
        path : "/api/phone",
        notes : "Update an existing phone",
        summary : "Update an existing phone",
        method: "PUT",
        parameters : [
            sw.queryParam("id", "Phone ID to update", "string", true),
            sw.bodyParam("Phone model", "JSON object representing the model to update", "Phone")
        ],
        responseMessages : [swe.invalid('input')],
        type : "Phone",
        nickname : "updatePhone"
    },
    'action': function(req, res, next) {
        var query = req.query;
        var phone = req.body;
        if(!query || !query.id) {
            throw swe.invalid('phone id');
        } else if(!contact) {
            throw swe.invalid('phone');
        } else {
            // Update an existing document (database will be updated automatically)
            delete phone._id;
            delete phone.__v;
            Phone.model.update({ _id : query.id }, phone, function (err, numRowsAffected, raw) {
                if (err) return res.send(500, { error: err });

                if (numRowsAffected > 0) {
                    res.send(raw);
                } else {
                    res.send(500, { error: 'contact not updated' });
                };
            });
        }
    }
};


/**
 * Delete methods
 */
exports.deletePhone = {
    'spec': {
        path : "/api/phone",
        notes : "Delete an existing phone",
        summary : "Delete an existing phone",
        method: "DELETE",
        parameters : [
            sw.queryParam("id", "Phone ID to delete", "string", true)
        ],
        responseMessages : [swe.invalid('input')],
        type : "Phone",
        nickname : "updatePhone"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if(!query || !query.id) {
            throw swe.invalid('phone id');
        } else {
            // Delete an existing document (database will be updated automatically)
            Phone.model.remove({ _id : query.id }, function (err) {
                if (err) return res.send(500, { error: err });

                res.send(200, { 'msg' : 'ok' });
            });
        }
    }
};