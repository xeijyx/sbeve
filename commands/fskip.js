const Discord = require('discord.js')

module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!message.member.voice.channel)
            return message.channel.send("join the vc first");
    if(!serverQueue)
            return message.channel.send("cant skip nunn");
    
        let roleN = message.guild.roles.cache.find(role => role.name === "DJ")
    
        if(!message.member.roles.cache.get(roleN.id))
            return message.channel.send("u dont have dj role")
         
        serverQueue.connection.dispatcher.end();
        serverQueue.skipvotes = [];
}

module.exports.config = {
    name: "fskip",
    description: "force skips the current song",
    aliases: ["fs"]
}