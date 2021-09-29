const Discord = require('discord.js')

module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!message.member.voice.channel)
            return message.channel.send("join the vc first")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
}

module.exports.config = {
    name: "stop",
    description: "stops and disconnects sbeve",
    aliases: ["st"]
}