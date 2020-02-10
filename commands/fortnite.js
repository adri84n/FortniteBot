const Discord = require("discord.js");
const secret = require("../secret.json");
const Client = require('fortnite');
const ft = new Client(secret.fortnite);
const colors = require("../colors.json");

module.exports.run = async (bot, args, message) => {

  let username = args[0];
  var platform;
  if (!username) {
    let sintaxErrorEmbed = new Discord.RichEmbed()
    .setTitle("Error")
    .setAuthor(message.author.username)
    .addField("Message", "Sintax error.", true)
    .addField("Possible solution", "Use correct sintax.", true)
    .addField("Correct sintax", message.content.split(" ")[0] + " <username> [platform: pc/xb1/ps4]", true)
    .setColor(colors.red);
    return message.channel.send(sintaxErrorEmbed).then(msg => {msg.delete(5000)});
  }
  if (args.length < 2) {
    platform = "pc";
  } else {
    platform = args[1];
  }

  let data = ft.user(username, platform).then(data => {

    // console.log(data);

    var solo = data.stats.solo;
    var kills = solo.kills;
    var wins = solo.wins;
    var solokd = solo.kd;
    var mp = solo.matches;
    var solokpm = solo.kills_per_match;

    var duo = data.stats.duo;
    kills += duo.kills;
    wins += duo.wins;
    var duokd = duo.kd;
    mp += duo.matches;
    var duokpm = solo.kills_per_match;

    var squad = data.stats.squad;
    kills += squad.kills;
    wins += squad.wins;
    var squadkd = squad.kd;
    mp += squad.matches;
    var squadkpm = squad.kills_per_match;

    var kd = (squadkd + duokd + solokd)/3;
    var kpm = (squadkpm + solokpm + duokpm)/3;

    kd = Math.floor(kd*100)/100;
    kpm = Math.floor(kpm*100)/100;

    let deaths = mp-wins;
    let embed = new Discord.RichEmbed()
    .setTitle("Fortnite stats")
    .setColor(colors.purple)
    .setAuthor(data.username)
    .addField("Kills", kills, true)
    .addField("Deaths", deaths, true);
    if (wins == 0) {
      embed.addField("Wins", wins + " (NOOB!)", true);
    } else {
      embed.addField("Wins", wins, true);
    }
    embed.addField("Matches Played", mp, true)
    .addField("Kill Death Ratio (KD)", kd, true)
    .addField("Kills per match", kpm, true);
    message.channel.send(embed);
}).catch(e => {
  let errorEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setTitle("Error")
  .addField("Message", "Could not find **" + args[0] + "** in the database")
  .setColor(colors.red);
  message.channel.send(errorEmbed).then(msg => {msg.delete(5000)});
  message.delete();
});
}

module.exports.help = {
  name: ["fortnite", "ft", "stats", "adriiilm", "furnut"]
}
