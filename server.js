/**
* Sample API build using Swagger by Wordnik, based loosly on their 
* swagger-node-express example at https://github.com/wordnik/swagger-node-express
*
* @author Dan Giulvezan
*
* @requires express 		Routing module
* @requires url 			Allows the URL to be read
* @requires fs 				Provides access to the servers file system
* @requires colors			Lets the app show colored output in the console window
* @requires swagger 		Generates the API docs dynamically
* @requires express-extras 	Adds additional middleware options to express; used for throttling
*
* @uses config.js
* @uses api.js
* @uses models/*
*
* @beta
*/

try {
	var express = require("express"),
		url = require("url"),
		fs = require('fs'),
		color = require('colors'),
        swagger = require("./swagger/swagger.js"),
		extras = require('express-extras'),
        db = require('./db.js');

} catch(err) {
	var msg = '\nCannot initialize API\n' + err + '\n';
	return console.log(msg.red);
};

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Setup throttling to keep users from abusing the API
app.use(extras.throttle({
	urlCount: 100,
	urlSec: 1,
	holdTime: 10,
	whitelist: {
		'127.0.0.1': true
	}
}));

// Set the main handler in swagger to the express app
swagger.setAppHandler(app);

// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
// methods, the header `api_key` OR query param `api_key` must be equal
// to the string literal `1234`.  All other HTTP ops are A-OK
swagger.addValidator(
	function validate(req, path, httpMethod) {
		//  example, only allow POST for api_key="special-key"
		if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
			var apiKey = req.headers["api_key"];
			if (!apiKey) {
				apiKey = url.parse(req.url,true).query["api_key"];
			}
			if ("1234" == apiKey) {
				return true; 
			}
			return false;
		}
		return true;
	}
);

// Find all of the model files in the 'models' folder and add the their definitions to swagger
// so it can be displayed in the docs
fs.readdir('models', function(err, list) {
	if (err) return done(err);

	if (list) {
		list.forEach(function(file) {
			file = 'models' + '/' + file;
			fs.stat(file, function(err, stat) {
				console.log('adding model def from ' + file);
                var model = require('./' + file);
				swagger.addModels(model);
			});
		});
	};
});

var api_carrier = require('./services/carrier.js');
var api_manufacturer = require('./services/manufacturer.js');
var api_phone = require('./services/phone.js');
var api_contact = require('./services/contact.js');

// Add models and methods to swagger
swagger.addGet(api_carrier.getAllCarriers)
	.addGet(api_manufacturer.getAllManufacturers)
	.addGet(api_phone.getAllPhones)
    .addGet(api_contact.getAllContacts)

    .addGet(api_carrier.getCarrierById)
	.addGet(api_manufacturer.getManufacturerById)
	.addGet(api_phone.getPhoneById)
    .addGet(api_contact.getContactById)

    .addPost(api_carrier.addCarrier)
	.addPost(api_manufacturer.addManufacturer)
	.addPost(api_phone.addPhone)
    .addPost(api_contact.addContact)

    .addPut(api_carrier.updateCarrier)
	.addPut(api_manufacturer.updateManufacturer)
	.addPut(api_phone.updatePhone)
    .addPut(api_contact.updateContact)

    .addDelete(api_carrier.deleteCarrier)
	.addDelete(api_manufacturer.deleteManufacturer)
	.addDelete(api_phone.deletePhone)
    .addDelete(api_contact.deleteContact);

/*swagger.configureDeclaration("carrier", {
	description : "Operations about phone carriers",
	authorizations : ["oauth2"],
	produces: ["application/json"]
});

swagger.configureDeclaration("manufacturer", {
	description : "Operations about phone manufacturers",
	authorizations : ["oauth2"],
	produces: ["application/json"]
});*/

// set api info
swagger.setApiInfo({
	title: "Swagger sample app",
	description: "This is a sample API for a small database of cell phones, manufacturers, and carriers. </br> For this sample, you can use the api key \"1234\" to test the authorization filters"
	//termsOfServiceUrl: "http://helloreverb.com/terms/",
	//contact: "apiteam@wordnik.com",
	//license: "Apache 2.0",
    //licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.setAuthorizations({
	apiKey: {
		type: "apiKey",
		passAs: "header"
	}
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure("http://127.0.0.1:3000", "1.0.0");


// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/public/swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
	if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
		res.writeHead(302, { 'Location' : req.url + '/' });
		res.end();
		return;
	}
	// take off leading /docs so that connect locates file correctly
	req.url = req.url.substr('/docs'.length);
	return docs_handler(req, res, next);
});

// Start the server on port 3000
app.listen(3000);