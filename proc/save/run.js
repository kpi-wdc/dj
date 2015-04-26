/**
 * @help :: https://nodejs.org/api/all.html
 */

process.on('message', function (msg) {
	
	
	
	
	
	//Process has to send back the msg. (See how it is done in some other process).
	//process.send({});
	process.exit(0);
});
