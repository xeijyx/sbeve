const ytdl = require('ytdl-core');
const ytpl = require('ytpl')
const Discord = require('discord.js')

function timeFormat(duration) {
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;
  
    var ret = "";
  
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
  
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }
  
module.exports.run = async (client, message, args, queue, searcher) => {
const vc = message.member.voice.channel;
if(!vc)
    return message.channel.send("join a vc first");
if (args.length < 1)
    return message.channel.send("enter something to search")
let url = args.join("");
if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
    try{
        await ytpl(url).then(async playlist => {
            message.channel.send(`playlist: "${playlist.title}" has been added`)
            playlist.items.forEach(async item => {
                await videoHandler(await ytdl.getInfo(item.shortUrl), message, vc, true);
            })
        })
    }catch(err){
        return message.channel.send(`playlist is either private or link is invalid\n${err}`)
    }
}
else{
    let result = await searcher.search(args.join(" "), { type: "video" })
    if(result.first == null)
        return message.channel.send("no results found");
    try {
    let songInfo = await ytdl.getInfo(result.first.url);
    return videoHandler(songInfo, message, vc)
    }catch(err){
        message.channel.send(`cannot queue song \n ${err} `)
        console.log(err)
    }

}

async function videoHandler(songInfo, message, vc, playlist = false){
    const serverQueue = queue.get(message.guild.id);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        vLength: songInfo.videoDetails.lengthSeconds,
        thumbnail: songInfo.videoDetails.thumbnails[3].url
    }
    if(!serverQueue){
        const queueConstructor = {
            txtChannel: message.channel,
            vChannel: vc,
            connection: null,
            songs: [],
            volume: 10,
            playing: true,
            loopone: false,
            loopall: false,
            skipVotes: []
        };
        queue.set(message.guild.id, queueConstructor);

        queueConstructor.songs.push(song);

        try{
            let connection = await queueConstructor.vChannel.join();
            queueConstructor.connection = connection;
            message.guild.me.voice.setSelfDeaf(true);
            play(message.guild, queueConstructor.songs[0]);
        }catch (err){
            console.error(err);
            queue.delete(message.guild.id);
            return message.channel.send(`unable to join vc ${err}`)
        }
    }else{
        serverQueue.songs.push(song);
        if(playlist) return undefined


        let dur = `${parseInt(song.vLength / 60)}:${song.vLength - 60 * parseInt(song.vLength / 60)}`
        let msg = new Discord.MessageEmbed()
            .setTitle("Song Added")
            .addField(song.title, "-----------")
            .addField("Song duration: ", dur)
            .addField("Song Place", serverQueue.songs.lastIndexOf(song) + 1)
            .setThumbnail(song.thumbnail)
            .setColor("#C69EF7")
        return message.channel.send(msg);
    }
}
function play(guild, song){
    const serverQueue = queue.get(guild.id);
    if(!song){
        serverQueue.vChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on('finish', () =>{
            if(serverQueue.loopone){  
                play(guild, serverQueue.songs[0]);
            }
            else if(serverQueue.loopall){
                serverQueue.songs.push(serverQueue.songs[0])
                serverQueue.songs.shift()
            }else{
                serverQueue.songs.shift()
                play(guild, serverQueue.songs[0]);
            }
        })
        let dur = `${parseInt(serverQueue.songs[0].vLength / 60)}:${serverQueue.songs[0].vLength - 60 * parseInt(serverQueue.songs[0].vLength / 60)}`
        let msg = new Discord.MessageEmbed()
            .setTitle("Now Playing:")
            .addField(serverQueue.songs[0].title, "----------")
            .addField("Song duration: ", dur)
            .setThumbnail(serverQueue.songs[0].thumbnail)
            .setColor("#C69EF7")
        return message.channel.send(msg);
    }
}
module.exports.config = {
    name: "play",
    description: "plays a song, also works with playlists",
    aliases: ["p", "pl"]
}