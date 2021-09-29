const { MessageEmbed } = require("discord.js")
const Discord = require('discord.js')

module.exports.run = (client, message, args) => {
    
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setColor('#7c4fd0')
        .setTitle("all commands");
        
      client.commands.forEach((command) => {
        embed.addField(command.config.name, command.config.description);
      });

      message.channel.send(embed);
    } else {
      const command = client.commands.has(args[0]);

      if (command) {
        const cmd = client.commands.get(args[0])
        const embed = new Discord.MessageEmbed()
          .setColor('#7c4fd0')
          .setTitle(`info about ${cmd.config.name}`)
          .setDescription(`desc: ${cmd.config.description}`)
          .setFooter(`aliases: ${cmd.config.aliases}`);
          message.author.send(embed);
      } else {
        message.channel.send("command doesn't exist");
      }  
    }
}
module.exports.config = {
    name: "help",
    aliases: [],
    description: "see info about commands",
    cooldown: 5
}