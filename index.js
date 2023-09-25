const Discord = require('discord.js');
const TinyURL = require('tinyurl');
const bot = new Discord.Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
  });
const config = require('./config');
const prefix = config.bot.prefix;
const status = config.bot.status;
const activity = config.bot.activity.toUpperCase()
const /*First command - link shortener*/mainAliases = [`${prefix}short`];
const /*Second command - help command */secondAliases = [`${prefix}help`]

bot.on('ready', async () => {
  bot.user.setActivity(status, {type: activity})
  console.log("✅ " + bot.user.username + " is now working")
});


bot.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const msgArray = message.content.split(" ");
    const cmd = msgArray[0];
    const args = msgArray.slice(1);

    if (new Set(mainAliases).has(cmd)) {
        const link = args[0];
        const alias = args[1];
        const embedNoLink = new Discord.MessageEmbed().setColor('#be1931').setDescription("⛔ " + "**訊息沒有連結**");
        if (!link) return message.channel.send(embedNoLink);
    
        if(!alias) {
          TinyURL.shorten(link,
            function(res, err) {
              if (err || res === 'Error') {
                if (err) console.log(err);
                const embedError = new Discord.MessageEmbed().setColor('#be1931').setDescription("⛔ " + `**[原本連結](${link}) 你提供的資料沒有連結**`)
                return message.channel.send(embedError);
              }
              const result = res
              const embedSuccess = new Discord.MessageEmbed().setColor('#77b255').setDescription(`✅ [**原本連結**](${link}) 縮短為 **${result}**`)
              message.channel.send(embedSuccess);
            }
          );
        } else if (alias) {
          const informace = { 'url': link, 'alias': alias }
          TinyURL.shortenWithAlias(informace,
            function(res, err) {
                if (err || res === 'Error') {
                  if (err) console.log(err);
                  const embedError = new Discord.MessageEmbed().setColor('#be1931').setDescription("⛔ " + `**[原本連結](${link}) 你提供的資料沒有連結**`)
                  return message.channel.send(embedError);
                }
                const result = res;
                const embedSuccess = new Discord.MessageEmbed().setColor('#77b255').setDescription(`✅ [**原本連結**](${link}) 縮短為 **${result}**`)
                message.channel.send(embedSuccess);
            }
          );
        };
    };

    if (new Set(secondAliases).has(cmd)) {
      const embedHelp = new Discord.MessageEmbed()
        .setColor('#0377fc')
        .setAuthor(bot.user.username, bot.user.displayAvatarURL())
        .setTitle('Help指令')
        .setDescription(`# HELP指令\n(本功能不是本人製作,只是翻譯)\n 主要使用 :\n \`${mainAliases}\`\n> Help指令 :\n \`${secondAliases}\``);
      message.channel.send(embedHelp);
    }
});


bot.login(config.bot.token);