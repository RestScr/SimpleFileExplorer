const localDirectory = "";

const console = require("node:console");
const logger = require("../services/logger.js")
const fs = require("node:fs")

const readline = require("node:readline").createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
)

const commands = {
    helpCommand:
    {
        aliases: ["help"],
        description: "Get a list of available commands",
        usage: "help | help [command]",
        params: {}
    },

    createDirectoryCommand:
    {
        aliases: ["mkdir", "makedirectory", "makedir"],
        description: "",
        usage: "mkdir [path]",
        params: {}
    },

    listDirectoryCommand: {
        aliases: ["whereami", "pwd"],
        description: "Get a list of files and catalogs of a current directory",
        usage: "pwd",
        params: {}
    },

    moveFileCommand:
    {
        aliases: ["mv", "move"],
        description: "Move file from given catalog to another",
        usage: "mv [current-path] [path-to-move]",
        params: {}
    },

    deleteFileCommand:
    {
        aliases: ["rm", "remove"],
        description: "Remove File from catalog",
        usage: "rm [path]",
        params: {}
    }
}


function createDirectory(dirpath)
{

}


function listDirectory(dir)
{
    
}


function commandExists(commandName)
{
    for (command of commands)
    {
        if (commands[command][aliases].includes(commandName))
        {

        }
    }

    return null
}


function printConcreticCommandDescription(concreticCommand)
{
    console.log(`${commands[concreticCommand][aliases].at(0)}:`)
    console.log(`Aliases: ${commands[concreticCommand][aliases]}`)
    console.log(`Description: ${commands[concreticCommand][description]}`)
    console.log(`Usage: ${commands[concreticCommand][usage]}`)
    console.log()
    console.log(`Params:`)
    for (param of commands[concreticCommand][params])
    {
    }
}


function printHelp(commandName=null)
{
    logger.info(`Printing command documentation of: ${commandName}`)
    if (commandName)
    {
        // Проверка введенной команды на корректность
        concreticCommand = commandExists(commandName)
        if (!convreticCommand)
        {
            console.log("Command does not exist. Type 'help' to get a list of available commands")
            logger.warn(`Command ${commandName} does not exist`)
            return
        }

        printConcreticCommandDescription(concreticCommand)
    }
    else
    {
        for (command of commands)
        {
            printConcreticCommandDescription(command)
        }
    }
}


function processInput(input)
{
    logger.info(`Entered: ${input}`)
    splittedInput = input.split()

    if (splittedInput.length == 0)
    {
        return
    }

    command = splittedInput[0]

    if (commands[helpCommand][aliases].includes(command))
    {
        printHelp(splittedInput.at(-1))
    }
    else if (commands[createDirectoryCommand][aliases].includes(command))
    {

    }
    else
    {
        logger.info(`User entered unknown command: ${command}`)
        console.log("Unknown command. Type 'help' to get a list of available commands")
    }
}


function start()
{
    readline.setPrompt(">")
    readline.prompt()

    logger.info("Set up command prompt")

    readline.on("line", processInput)
}


commandLine = {
    listen: start
}

module.exports = commandLine
