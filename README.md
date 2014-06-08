java script development environment 
================
This is only a test, not a functional application

###Stack

* Node.js -> http://nodejs.org/
* Swagger -> https://helloreverb.com/developers/swagger
* mongoDB -> http://www.mongodb.org/
* Angular.js -> https://angularjs.org/
* Bootstrap -> http://getbootstrap.com/

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
	+ public
		+ components
			\ angular
			\ bootstrap
			\ jquery
			\ swagger-ui
			
		\ stylesheets
		\ images
		\ controller
		\ services
		+ views
		app.js
		
	+ model
	\ services
	\ swagger
	
	package.json
	config.js
	db.js
	server.js
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
