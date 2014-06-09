java script development environment 
================
This is only a test, not a functional application

###Stack

* Node.js -> http://nodejs.org/
* Swagger -> https://helloreverb.com/developers/swagger
* mongoDB -> http://www.mongodb.org/
* Angular.js -> https://angularjs.org/
* Bootstrap -> http://getbootstrap.com/
* bower.io -> http://bower.io/

####Run Data Base
<pre>
	> mongod
</pre>

####Run Server
<pre>
	> npm install
	> node server.js
</pre> 

####Project architecture
<pre>
	+ public 				(front end folder)
		+ components
			\ angular
			\ bootstrap
			\ jquery
			\ swagger-ui
			
		\ stylesheets
		\ images
		\ controller 		(angular.js controllers)
		\ services 			(angular.js services)
		+ views 			(angular.js views)
		app.js 				(routers and swagger doc reader)
		
	+ model 				(data base and swagger models)
	\ services 				(rest services)
	\ swagger 				(swagger spec generator)
	
	package.json 			(node dependencies)
	config.js 				(configure enviroment)
	db.js 					(data base manager)
	server.js 				(node.js server)
</pre> 

####Interesting links to install environment

* Install node.js -> http://nodejs.org/download/
* Install mongoDB in OSX -> http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
* Webstorm debugging -> http://blog.jetbrains.com/webstorm/2014/02/running-and-debugging-node-js-application/

####Interesting links to learn

* http://mean.io
* http://carlosazaustre.es/blog/tutorial-ejemplo-de-aplicacion-web-con-angular-js-y-api-rest-con-node/
* https://github.com/wordnik/swagger-node-express
* https://github.com/dgiul/node-swagger-express-mongodb
* https://github.com/Dayde/angularjs-frontend-using-swagger-documentation
* https://github.com/zkirill/nodejs-mongo-angular-crud
