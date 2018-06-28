const fs = require("fs");
const configFile = JSON.parse(fs.readFileSync("config.json", "utf8"));

module.exports = {
	name: 'config',
	description: 'Configures various settings',
	execute(msg, args, Redisclient) {
		if (!args.length) {
            return msg.channel.send(`Command help: ${configFile.delim}config
            \n
            \n
            overwatchtag - Sets your Overwatch tag
            monitoring - Turns on or off SR tracking for yourself`);
        }
        // We're configuring someone.  Let's find out what setting they are using
        if (args[0].toLowerCase() === "overwatchtag") {
            // Let's set their Overwatch tag
            if (args[1]) { // If we have a tag to set
                Redisclient.hset(`users:${msg.author.id}`, `Overwatch_Tag`, args[1]);
                msg.channel.send(`Your overwatch tag has been set to ${args[1]} ✅`);
            }
            else if (Redisclient.hexists(`users:${msg.author.id}`, `Overwatch_Tag`)) { //There's already one saved
                Redisclient.hget(`users:${msg.author.id}`, `Overwatch_Tag`, function(err, reply) {
                    const overwatchtag = reply;
                    msg.channel.send(`Your current Overwatch tag is ${overwatchtag}`);
                });
            }
            else { //Explain how to use the command
                msg.channel.send(`Command help: ${configFile.delim}config overwatchtag <tag>\n\n<tag> - Your Overwatch tag`);
            }
        
        }

        if (args[0].toLowerCase() === "monitoring") {
            // Let's configure SR tracking
            if (args[1]) { // If we have a setting to change
                //TODO: Set key on or off
                if (args[1].toLowerCase() === "off") {
                    Redisclient.hexists(`monitoring`, `${msg.author.id}`, function(err, data) {
                        if (data === 1) {
                            Redisclient.hget(`monitoring`, `${msg.author.id}`, function(err, data) {
                                if (data === "on") { // If monitoring is currently on
                                    Redisclient.hset(`monitoring`, `${msg.author.id}`, "off") // Turn off
                                    msg.channel.send(`SR Monitoring turned off ✅`);
                                }
                                else {
                                    msg.channel.send(`SR Monitoring already off ✅`);
                                }
                            })
                        }
                        else { // Monitoring has not been set before, so create the key for the first time
                            Redisclient.hset(`monitoring`, `${msg.author.id}`, "off");
                            msg.channel.send(`SR Monitoring already off ✅`);
                        }
                    })
                }
                else if (args[1].toLowerCase() === "on") {
                    Redisclient.hexists(`monitoring`, `${msg.author.id}`, function(err, data) {
                        if (data === 1) {
                            Redisclient.hget(`monitoring`, `${msg.author.id}`, function(err, data) {
                                if (data === "off") { //If monitoring is currently off
                                    Redisclient.hset(`monitoring`, `${msg.author.id}`, "on") // Turn on
                                    msg.channel.send(`SR Monitoring turned on ✅`);
                                }
                                else {
                                    msg.channel.send(`SR Monitoring already on ✅`);
                                }
                            })
                        }
                        else { // Monitoring has not been set before, so create the key for the first time
                            Redisclient.hset(`monitoring`, `${msg.author.id}`, "on");
                            msg.channel.send(`SR Monitoring turned on ✅`);
                        }
                    })
                }
                else { //Wrong arguments provided
                    msg.channel.send(`Command help: ${configFile.delim}config monitoring <mode>\n\n<mode> - ON or OFF`);
                } 
            }
            else { //Explain how to use the command and show current status
                msg.channel.send(`Command help: ${configFile.delim}config monitoring <mode>\n\n<mode> - ON or OFF`);
                Redisclient.hget(`monitoring`, `${msg.author.id}`, function(err, data) {
                    if (data === "on") {
                        msg.channel.send(`SR Monitoring currently ON 💚`);
                    }
                    else {
                        msg.channel.send(`SR Monitoring currently OFF 🔴`);
                    }
                })
            }
        }
	},
};

