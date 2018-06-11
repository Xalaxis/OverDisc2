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
                            msg.channel.send(`\`\`\`js\n\n${JSON.stringify(data.profile)}\`\`\``);
                            msg.channel.messages.fetch({around: "352292052538753025", limit: 1})
                            .then(messages => {
                                messages.first().edit("This fetched message was edited");
                            });
                            console.log(data);
                        })
                        .catch(err => console.log(err));
                    })
                }
            }
        }
	},
};