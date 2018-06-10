const owjs = require('overwatch-js');

module.exports = {
	name: 'debug',
	description: 'Debug commands',
	execute(msg, args, Redisclient) {
        if (args.length) {
            if (args[0].toLowerCase() === "getrank") {
                if (Redisclient.hexists(`users:${msg.author.id}`, `Overwatch_Tag`)) {
                    owjs.getOverall('pc', 'eu', Redisclient.hget(`users:${msg.author.id}`, `Overwatch_Tag`)) // TODO: Convert # to - for query
                    .then((data) => console.dir(data, {depth : 2, colors : true}))
                    .catch(err => console.log(err));
                }
            }
        }
	},
};