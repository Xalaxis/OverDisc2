const owjs = require('overwatch-js');
const redis = require("redis");
const Redisclient = redis.createClient();
const Discord = require("discord.js");
const Discordclient = new Discord.Client();
const fs = require("fs");
const schedule = require('node-schedule');

const configFile = JSON.parse(fs.readFileSync("config.json", "utf8"));
const packageFile = JSON.parse(fs.readFileSync("package.json", "utf8"));

Redisclient.on("ready", () => console.log("Redis Ready"));

Redisclient.on("error", (err) => console.log("Error " + err));

Discordclient.on('ready', () => {
	console.log(`Logged in as ${Discordclient.user.tag}!`);
	Discordclient.user.setActivity(`OverDisc 2 v${packageFile.version}`, 1);
	console.log(`Status set as "OverDisc 2 v${packageFile.version}"`);
	// console.log(Discordclient.channels);
});

function adminLog(message) {
	const adminChannel = Discordclient.channels.get(configFile.adminchannel);
	adminChannel.send(`[DEBUG]${message}`);
}

function isAdmin(id) {
	if (id == configFile.adminid) {
		return true;
	}
	else {
		return false;
	}
}

const clean = text => {
	if (typeof(text) === "string")
	  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
  }

Discordclient.on('message', msg => {
	if (msg.content.startsWith === configFile.delim || msg.author.bot) return;
	// Only look at messages with our delim and not from a bot
	const args = msg.content.slice(configFile.delim.length).split(' ');
	const command = args.shift().toLowerCase();
	if (command === `ping`) {
		console.log(`${msg.author.tag} has just pinged us!`);
		adminLog(`${msg.author.tag} has just pinged us!`);
		console.log(`Their ID is ${msg.author.id}`);
		msg.channel.send('pong');
	}	

	else if (command === `config`) {
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
		}
	}

	else if (command === 'args-info') {
		if (!args.length) {
			return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
		}
		msg.channel.send(`Command name: ${command}\nArguments: ${args}`);
	}

	else if (command === "admin") {
		if (!args.length) {
			return;
		}
		if (args[0].toLowerCase() === "restart") {
			msg.channel.send("Bot restarting 🔁").then( // TODO: Why doesn't this work?
				process.exit()
			);
		}
	}
});

Discordclient.login(configFile.bot_token);