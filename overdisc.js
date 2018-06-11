const owjs = require('overwatch-js');
const redis = require("redis");
const Redisclient = redis.createClient();
const Discord = require("discord.js");
const Discordclient = new Discord.Client();
const fs = require("fs");
const schedule = require('node-schedule');
Discordclient.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    Discordclient.commands.set(command.name, command);
}

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

Discordclient.on('message', msg => {
	if (msg.content.startsWith === configFile.delim || msg.author.bot) return;
	// Only look at messages with our delim and not from a bot
	const args = msg.content.slice(configFile.delim.length).split(' ');
	const command = args.shift().toLowerCase();
	if (command === `ping`) {
		Discordclient.commands.get("ping").execute(msg, args);
	}
	else if (command == `config`) {
		Discordclient.commands.get("config").execute(msg, args, Redisclient);
	}
	else if (command == `debug`) {
		Discordclient.commands.get("debug").execute(msg, args, Redisclient);
	}
});

Discordclient.login(configFile.bot_token);