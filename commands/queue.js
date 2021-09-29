const Discord = require('discord.js')

module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id);
    if(!serverQueue)
        return message.channel.send("no music playing");
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("ur not in the vc")
    message.channel.send('```' + qMsg + 'requested by: ' + message.author.username + '```')
}

function embedGenerator(serverQueue){
    const embeds = [];
    let songs = 11;
    for (let i = 1; i < serverQueue.songs.length; i += 10){
        const current = serverQueue.songs.slice(i, songs)
        songs += 10;
        let j = i-1;
        const info = current.map(song => `${++j}. [${song.title}](${song.url})`).join('\n')
        const msg = new Discord.MessageEmbed()
            .setDescription(`Now playing: [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) \n ${info}`)

        embeds.push(msg)
    }
    return embeds;
}

module.exports.config = {
    name: "queue",
    description: "shows the queue",
    aliases: ["q", "np"]
}