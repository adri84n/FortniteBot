const Discord = require("discord.js");
const secret = require("./secret.json");
const bot = new Discord.Client({disableEveryone : true});
const fs = require("fs");
const colors = require("./colors.json");
let cooldown = new Set();
let cdseconds = 1;
bot.commands = new Discord.Collection();

fs.readdir("./commands", (err, file) => {

  if (err) console.error(err);
  let jsfile = file.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.error("Could not find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    if (!f) {
      return console.error("Could not find one file");
    }
    for (let i = 0; i < props.help.name.length; i++) {
      bot.commands.set(props.help.name[i], props);
    }
  });

});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online in ${bot.guilds.size} servers.`);
  bot.user.setActivity("Searching information");

});

bot.login(secret.token);

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let msg = message.content.split(" ");
  let cmd = msg[0].toLowerCase();
  let args = msg.slice(1);

  let prefix = "!";

  if (cmd.split("")[0] !== prefix) return;

  if (cooldown.has(message.author.id)) {
    message.delete();

    let delayEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor(colors.red)
    .addField("ESP", `Tienes que esperar ${cdseconds} segundos entre comandos.`, true)
    .addField("ENG", `You have to wait ${cdseconds} seconds between commands`)
    .setTitle("Error");


    return message.channel.send(delayEmbed)
    .then(msg => {msg.delete(3000)});
    return;
  }

  /*if (message.channel.name !== "bot-commands") {
    message.delete();

    let embed = new Discord.RichEmbed()
    .setTitle("Error")
    .setAuthor(message.author.username)
    .addField("ESP", "Los comandos de bots solo pueden ser enviados en #bot-commands", true)
    .addField("ENG", "Bot commands may only be sent in #bot-commands", true)
    .setColor(colors.red);

    message.channel.send(embed).then(msg => {msg.delete(5000)});
    return;
  }*/

  cooldown.add(message.author.id);
  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cdseconds * 1000);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if (!commandfile) {
    let unknownCommandEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor(colors.red)
    .setTitle("Error")
    .addField("Error", "That command doesn't exist", true)
    .addField("Solution", "Type !help");

    message.channel.send(unknownCommandEmbed).then(msg => {msg.delete(5000)});
    message.delete();
    return;
  }
  commandfile.run(bot, args, message);



});
