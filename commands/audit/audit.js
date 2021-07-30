const mongo = require('./../../mongo');
const auditSchema = require('./../../schemas/audit-schema');
module.exports = {
    aliases: 'audit',
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments, text) => {
        const { channel, guild } = message;

        // connect to mongodb and add if not exist, if exist -> update
        await mongo().then( async (mongoose) => {
            try {
                await auditSchema.findOneAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    channelId: channel.id
                }, {
                    upsert: true,
                    useFindAndModify: false
                })
            } finally {
                mongoose.connection.close()
            }
        })

        channel.send(`Set ${channel} as new audit channel`)
    },
}