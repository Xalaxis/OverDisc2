const fs = require("fs");
const configFile = JSON.parse(fs.readFileSync("config.json", "utf8"));

module.exports = {
	name: 'config',
	description: 'Configures various settings',
	execute(msg, args, Redisclient) {
		if (!args.length) {
            return msg.channel.send(`Command help: ${configFile.delim}config\n\noverwatchtag - Sets your Overwatch tag`);
        }
        // We're configuring someone.  Let's find out what setting they are using
        if (args[0].toLowerCase() === "overwatchtag") {
            // Let's set their Overwatch tag
            if (args[1]) {
                Redisclient.hset(`users:${msg.author.id}`, `Overwatch_Tag`, args[1]);
                msg.channel.send(`Your overwatch tag has been set to ${args[1]} ✅`);
            }
            else if (Redisclient.hexists(`users:${msg.author.id}`, `Overwatch_Tag`)) {
                Redisclient.hget(`users:${msg.author.id}`, `Overwatch_Tag`, function(err, reply) {
                    const overwatchtag = reply;
                    msg.channel.send(`Your current Overwatch tag is ${overwatchtag}`);
                });
            }
            else {
                msg.channel.send(`Command help: ${configFile.delim}config overwatchtag <tag>\n\n<tag> - Your Overwatch tag`);
            }
        
        }
        else {
            msg.channel.send(`Command help: ${configFile.delim}config
            \n
            \n
            overwatchtag - Sets your Overwatch tag`);
        };
	},
};

