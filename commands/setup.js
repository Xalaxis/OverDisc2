module.exports = {
	name: 'setup',
	description: 'Sets up the bot to work in the current server',
	execute(msg, args, Redisclient) {
        //Check to see if we are already set-up.
        if (Redisclient.hget(`servers:${msg.guild.id}`, `configureComplete`) == "true") {
            console.log(msg.guild.id);
            console.log("Already configured");
        }
        else {
            //We are not already configured.  This is a first-time setup.
            console.log("First time setup");
        }
	},
};