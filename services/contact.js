var sw = require("swagger-node-express");
var swe = sw.errors;

/**
 * Load the model files
 */
var Contact = require('../models/contact.js');

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
exports.getAllContacts = {
    'spec': {
        description : "List all phone carriers",
        path : "/api/contact",
        method: "GET",
        summary : "List all contacts",
        notes : "Returns a list of all contacts",
        type : "Contact",
        nickname : "getAllContacts",
        produces : ["application/json"],
        parameters : [],
        responseMessages : [swe.invalid('contacts'), swe.notFound('contacts')]
    },
    'action': function (req,res) {
        Contact.model.find(function(err, contacts) {
            if (err) return next(swe.invalid('contacts'))

            if (contacts) {
                res.send(contacts);
            } else {
                res.send(404, swe.notFound('contacts'));
            };
        });
    }
};

/**
 * Get record by ID methods
 */
exports.getContactById = {
    'spec': {
        description : "Operations about carriers",
        path : "/api/contact/{contactId}",
        method: "GET",
        summary : "Find contact by ID",
        notes : "Returns a contact based on ID",
        type : "Contact",
        nickname : "getContactById",
        produces : ["application/json"],
        parameters : [sw.pathParam("contactId", "ID of the contact to return", "string")],
        responseMessages : [swe.invalid('id'), swe.notFound('contact')]
    },
    'action': function (req,res) {
        Contact.model.findOne({_id: req.params.contactId}, function(err, contact) {
            if (err) return res.send(404, { error: 'invalid id' });

            if (contact) {
                res.send(contact);
            } else {
                res.send(404, new Error('contact not found'));
            }
        });
    }
};

/**
 * Add/create methods
 */
exports.addContact = {
    'spec': {
        path : "/api/contact",
        notes : "Adds a new contact",
        summary : "Add a new contact",
        method: "POST",
        parameters : [sw.bodyParam("Contact name", "JSON object representing the carrier to add", "Contact")],
        responseMessages : [swe.invalid('input')],
        nickname : "addContact"
    },
    'action': function(req, res, next) {
        var contact = req.body;
        if(!contact || !contact.name){
            throw swe.invalid('contact name');
        } else {
            // Create the new document (database will be updated automatically)
            Contact.model.create(contact, function (err, name) {
                if (err) return res.send(500, { error: err });

                if (name) {
                    res.send(name);
                } else {
                    res.send(500, { error: 'contact not added' });
                };
            });
        }
    }
};

/**
 * Update methods
 */
exports.updateContact = {
    'spec': {
        path : "/api/contact",
        notes : "Update an existing contact",
        summary : "Update an existing contact",
        method: "PUT",
        //parameters : [param.body("Carrier ID", "Carrier ID to update", "Carrier"), param.body("Carrier name", "New carrier name", "Carrier")],
        parameters : [
            sw.queryParam("id", "Contact ID to update", "string", true),
            sw.queryParam("name", "New contact name to use", "string", true)
        ],
        responseMessages : [swe.invalid('input')],
        type : "Contact",
        nickname : "updateContact"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if(!query || !query.id) {
            throw swe.invalid('contact id');
        } else if(!query || !query.name) {
            throw swe.invalid('contact name');
        } else {
            // Update an existing document (database will be updated automatically)
            Contact.model.update({ _id : query.id }, { name: query.name }, function (err, numRowsAffected, raw) {
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
exports.deleteContact = {
    'spec': {
        path : "/api/contact",
        notes : "Delete an existing contact",
        summary : "Delete an existing contact",
        method: "DELETE",
        parameters : [
            sw.queryParam("id", "Contact ID to delete", "string", true)
        ],
        responseMessages : [swe.invalid('input')],
        type : "Contact",
        nickname : "updateContact"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if(!query || !query.id) {
            throw swe.invalid('contact id');
        } else {
            // Delete an existing document (database will be updated automatically)
            Contact.model.remove({ _id : query.id }, function (err) {
                if (err) return res.send(500, { error: err });

                res.send(200, { 'msg' : 'ok' });
            });
        }
    }
};