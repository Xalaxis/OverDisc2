const owjs = require('overwatch-js');

module.exports = {
	name: 'debug',
	description: 'Debug commands',
	execute(msg, args, Redisclient) {
        if (args.length) {
            if (args[0].toLowerCase() === "getrank") {
                if (Redisclient.hexists(`users:${msg.author.id}`, `Overwatch_Tag`)) {
                    Redisclient.hget(`users:${msg.author.id}`, `Overwatch_Tag`, function (err, reply) {
                        msg.channel.send(`Looking up ${reply.replace("#", "-")} 🔄`);
                        owjs.getOverall('pc', 'eu', reply.replace("#", "-"))
                        .then((data) => {
                            // Send the profile information formatted as a JavaScript file in a code block
                            msg.channel.send(`\`\`\`js\n\n${JSON.stringify(data.profile)}\`\`\``);
                            console.log(data);
                        })
                        .catch(err => console.log(err));
                    })
                }
            }
        }
	},
};