const Discord = require("discord.js");
const newUsers = new Discord.Collection();
const client = new Discord.Client();
const fs = require("fs");
const {get} = require("snekfetch");
const ms = require('ms');
const moment = require('moment');
moment.locale();
const time = moment().format('Do MMMM YYYY, h:mm:ss')
const token = 'token here'

let points = JSON.parse(fs.readFileSync("./points.json", "utf-8"));
const prefix = "$";


client.on('ready', () => {
  client.user.setPresence({ game: {name : 'discord.gg/Y46RgyR', type: 0}});

  console.log(`===========================`);
  console.log(`Connecté en tant que ${client.user.tag}`);
  console.log('Votre token: ' + token);
  console.log('');
  console.log(`===========================`);
});

client.on('message', message => {

  var member = message.mentions.members.first();
  const log = '[' + time + '] Commande executé par ' + message.author + ': '


    if (message.content.startsWith(prefix + 'link')) {
      if(message.member.roles.some(r=>["Admin"].includes(r.name)) ) {
      const embed = new Discord.RichEmbed()
      .setColor(0x1ABC9C)
      .setTitle("Bienvenue !")
      .addField("Lien du GitHub", "https://github.com/Lunarly")
      .addField("Lien du site", "https://lunarly.github.io/")
      .addField("Lien d'invitation", "https://discord.gg/Y46RgyR")
      message.channel.send(embed)
      console.log(log+"link")
    }
  };

    if (message.content.startsWith(prefix + 'rules')) {
      const embed = new Discord.RichEmbed()
      .setColor(0x1ABC9C)
      .setTitle("Bienvenue !")
      .addField("Les règles", "Pas de provocations, d'insultes, de violences verbales et toutes autres réactions inutiles.\nPas de flood ni de flame, réglez vos problèmes en privé.\nPas de propos ou images pornographiques, racistes, xénophobes, subversifs, obscènes, homophobe etc...\nPas de liens illégaux dans les discussions, par message ou autre.\nCe discord n'est pas un panneau de pub, donc interdiction de puber son propre Discord personnel ici.\n Tout pseudo, tag ou propos à caractère diffamatoire, antisémite, homophobe, agressif ou injurieux est interdit.\nRespectez-vous les uns les autres et restez courtois, vous êtes tous ici avec un point commun alors pas besoin de faire la bagarre.")
      message.channel.send(embed)
      console.log(log+"rules")
    }

    if (message.content.startsWith(prefix + "help")) {
      const embed = new Discord.RichEmbed()
      .setColor(0x1ABC9C)
      .setTitle("Listes des commandes")
      .addField("$rules", "Envoie les règles")
      .addField("$link", "Envoie les liens du serveur")
      .addField("$info", "Envoie quelques infos sur le bot")
      .addField("$lenny", "( ͡° ͜ʖ ͡°)")
      .addField("$level", "Envoie votre niveau et vos points")
      .addField("$kick", "Expulser un membre (Admin seulement)")
      .addField("$mute/$demute", "Mute un membre (Admin seulement)")
      message.channel.send(embed);
      console.log(log+"help")
    }

    if (message.content.startsWith(prefix + "info")) {
      const embed = new Discord.RichEmbed()
      .setColor(0x1ABC9C)
      .setTitle("À propos")
      .addField("Créateur", "@sirkodle#1362")
      .addField("Lien du GitHub", "https://github.com/kodle/neptr")
      message.channel.send(embed);
      console.log(log+"info")
    }

    if (message.content.startsWith(prefix + 'lenny')) {
    message.channel.send("( ͡° ͜ʖ ͡°)")
    console.log(log+"( ͡° ͜ʖ ͡°)")
    }

    if (message.content.startsWith(prefix + 'kick')) {
      if(message.member.roles.some(r=>["Admin"].includes(r.name)) ) {
        if (message.mentions.members.size === 0)
        return message.reply("merci d'entrer un utilisateur !");
        member.kick().then((member) => {
            // Successmessage
            message.channel.send(":wave: " + member.displayName + " à été kick du serveur ! ");
            console.log(log+"kick @"+ member.displayName)
        }).catch(() => {
             // Failmessage
            message.reply("Accès réfusé, permission pas assez haute.");
            console.log(log+"kick @" + member.displayName + "(Accès refusé)")
        });
      }
    }

    if (message.content.startsWith(prefix + 'mute')) {
        if(message.member.roles.some(r=>["Admin", "N.E.P.T.R"].includes(r.name)) ) {
        let role = message.guild.roles.find("name", "Mute");
        if(role) return message.reply("merci d'entrer un utilisateur !");
        member.addRole(role)
        console.log(log+"mute @"+ member.displayName)
      }
    }

    if (message.content.startsWith(prefix + 'demute')) {
        if(message.member.roles.some(r=>["Admin", "N.E.P.T.R"].includes(r.name)) ) {
        let role = message.guild.roles.find("name", "Mute");
        if(role) return message.reply("merci d'entrer un utilisateur !");
        member.removeRole(role)
        console.log(log+"demute @"+ member.displayName)
      }
    }

    if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };
  let userData = points[message.author.id];
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`Tu passes au level **${curLevel}**!`);
  }

  if (message.content.startsWith(prefix + "level")) {
    message.reply(`Tu es level ${userData.level}, avec ${userData.points} points.`);
  }
  fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
  });

});

client.on('guildMemberAdd', member => {
    member.guild.channels.get('329322280201224203').send("Bienvenue sur Lunarly !");
});

client.on("guildMemberRemove", (member) => {
  if(newUsers.has(member.id)) newUsers.delete(member.id);
});



client.login(token);
