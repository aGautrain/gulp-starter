const colors = require('colors');
const log = require('fancy-log');

let showAuthentications = function(ids) {
	
	let hash = "";
	for(let i = 0; i < ids.password.length; i++){
		hash += "*";
	}
	
	let phrase = "Using following credentials : { ";
	phrase += ("host".gray + ": " + ids.host + ", ");
	phrase += ("user".gray + ": " + ids.user + ", ");
	phrase += ("password".gray + ": " + hash + " }");
	
	
	log.info(phrase);
};

let logFtpStart = function() {	
	
	log.info("-------- FTP CONNECTION STARTED --------");
};

let logFtpEnd = function() {	
	
	log.info("-------- FTP CONNECTION ENDED --------");
};

module.exports = {
	showAuthentications, logFtpStart, logFtpEnd
};