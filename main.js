const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior
} = require("@discordjs/voice");

const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const BOT_TOKEN = "bot_tokeni";
const GUILD_ID = "sunucu_id";
const VOICE_CHANNEL_ID = "kanal_id";
const YETKİLİ_ROLE_ID = "yetkili_id";

let connection;
let player;
let isPlaying = false;

//rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here
function isRoleInChannel(guild) {
    const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
    if (!channel) return false;

    return channel.members.some(member =>
        member.roles.cache.has(YETKİLİ_ROLE_ID)
    );
}

client.once("ready", async () => {
    console.log(`${client.user.tag} aktif.`);

    const guild = client.guilds.cache.get(GUILD_ID);

    if (!guild) return console.log("Sunucu bulunamadı.");

    const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);

    if (!channel) return console.log("Ses kanalı bulunamadı.");

    connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false
    });

    player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    });
//rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here
    connection.subscribe(player);

    console.log(`Ses kanalına bağlandı: ${channel.name}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {

    const guild = newState.guild;

   //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here
    if (isRoleInChannel(guild)) {
        if (isPlaying && player) {
            player.stop();
            isPlaying = false;
            console.log("Yetkili var → müzik durdu");
        }
        return;
    }

  //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here
    if (!oldState.channelId && newState.channelId) {

        if (isPlaying) return;

        try {
            isPlaying = true;

            const resource = createAudioResource(
                path.join(__dirname, "giris2.mp3")
            );

            player.play(resource);
//rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here
            console.log(`${newState.member.user.tag} sese girdi → müzik çalıyor`);

            player.once(AudioPlayerStatus.Idle, () => {
                isPlaying = false;
                console.log("Müzik bitti");
            });

        } catch (err) {
            console.error(err);
            isPlaying = false;
        }
    }
});
//rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here
client.login(BOT_TOKEN);
//rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here //rewizar was here
