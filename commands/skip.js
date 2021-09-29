const Discord = require('discord.js')

module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!serverQueue)
        return message.channel.send("no music playing");
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("ur not in the vc")

    let usersC = message.member.voice.channel.members.size;
    let required = Math.ceil(usersC/2);

    if(serverQueue.skipVotes.includes(message.member.id))
        return message.channel.send("you already voted to skip")

    serverQueue.skipVotes.push(message.member.id)
    message.channel.send(`you voted to skip ${serverQueue.skipVotes.length}/${required} votes`)

    if(serverQueue.skipVotes.length >= required){
        serverQueue.connection.dispatcher.end();
        serverQueue.skipVotes = [];
        message.channel.send("song has been skipped")
    }
}

module.exports.config = {
    name: "skip",
    description: "skips the current song",
    aliases: ["s"]
}