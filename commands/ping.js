module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(msg, args) {
		console.log(`${msg.author.tag} has just pinged us!`);
		console.log(`Their ID is ${msg.author.id}`);
		msg.channel.send('Pong.');
	},
};