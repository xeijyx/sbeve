const Discord = require('discord.js')

module.exports.run = async (client, message, args, queue, searcher) => {
const serverQueue = queue.get(message.guild.id)
if(!serverQueue)
    return message.channel.send("no music playing");
if(message.member.voice.channel != message.guild.me.voice.channel)
    return message.channel.send("ur not in the vc")

let nowPlaying = serverQueue.songs[0];
let qMsg =  `playing: ${nowPlaying.title}\n------------------------\n`
for(var i = 1; i < serverQueue.songs; i++){
    qMsg += `${i}, ${serverQueue.songs[i].title}\n`
}

message.channel.send('```' + qMsg + 'requested by: ' + message.author.username + '```')
}

module.exports.config = {
    name: "nowplaying",
    description: "shows the current song playing",
    aliases: ["np"]
}