module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!serverQueue)
            return message.channel.send("no music playing")
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("ur not in that vc")
    serverQueue.songs = [0];
    serverQueue.connection.dispatcher.destroy();
}

module.exports.config = {
    name: "stop",
    description: "stops and disconnects sbeve",
    aliases: ["kys", "st"]
}