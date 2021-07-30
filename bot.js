require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const poll = require('./poll')
const welcome = require('./welcome')
const { auditInit, audit } = require('./audit')


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)

    const cmdBaseFile = 'command.js';
    const cmdBase = require(`./commands/${cmdBaseFile}`);

    // recursively read directory for commands
    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== cmdBaseFile) {
                const option = require(path.join(__dirname, dir, file))
                // call the command
                cmdBase(option)
            }
        }
    }

    readCommands('commands')
    cmdBase.listen(client)

    poll(client);
    //welcome(client);
});

client.login(process.env.TOKEN);
