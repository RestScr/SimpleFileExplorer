const logger = require("../services/logger.js");
const { FilesystemControls, readline } = require("./filesystem-controls.js");
const commands = require("./commands.js");

const filesystemControls = new FilesystemControls();
exports.filesystemControls = filesystemControls;


function processInput(input) {
    logger.info(`Entered: ${input}`);
    input = input.trim();
    if (input.length == 0)
    {
        readline.prompt();
        return;
    }
    splittedInputWithStrings = input.split("\"").filter(item => item.trim() != "");
    splittedInput = splittedInputWithStrings[0].split(" ");

    // Отделение команды от аргументов, если они были введены без кавычек
    splittedInput.push(...splittedInputWithStrings.filter((item, index) => index > 0));

    command = splittedInput[0];

    if (commands["helpCommand"]["aliases"].includes(command))
    {
        if (splittedInput.length > 1)
        {
            filesystemControls.printHelp(splittedInput.at(-1));
        }

        else
        {
            filesystemControls.printHelp();
        }
    }
    else if (commands["createDirectoryCommand"]["aliases"].includes(command))
    {
        if (splittedInput.length > 1)
        {
            filesystemControls.createDirectory(splittedInput.at(-1));
        }

        else
        {
            console.log(`Invalid amount of arguments. Path is needed`);
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`);
        }
    }
    else if (commands["changeDirectoryCommand"]["aliases"].includes(command))
    {
        if (splittedInput.length > 1)
        {
            filesystemControls.changeDirectory(splittedInput.at(-1));
        }

        else
        {
            console.log(`Invalid amount of arguments. Path is needed`);
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`);
        }
    }
    else if (commands["clearConsoleCommand"]["aliases"].includes(command))
    {
        filesystemControls.clearConsole();
    }
    else if (commands["getCurrentDirectoryCommand"]["aliases"].includes(command))
    {
        filesystemControls.getCurrentDirectory();
    }
    else if (commands["createFileCommand"]["aliases"].includes(command))
    {
        if (splittedInput.length > 1)
        {
            filesystemControls.createFile(splittedInput.at(-1));
        }

        else
        {
            console.log(`Invalid amount of arguments. Path is needed`);
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`);
        }
    }
    else if (commands["listDirectoryCommand"]["aliases"].includes(command))
    {
        if (splittedInput.length > 1)
        {
            filesystemControls.listDirectory(splittedInput.at(-1));
        }

        else
        {
            filesystemControls.listDirectory();
        }
    }
    else if (commands["deleteFileCommand"]["aliases"].includes(command))
    {
        if (splittedInput.length > 1)
        {
            filesystemControls.deleteFile(splittedInput.at(-1));
        }

        else
        {
            console.log(`Invalid amount of arguments. Path is needed`);
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`);
        }
    }
    else if (commands["removeDirectoryCommand"]["aliases"].includes(command))
    {
        if (splittedInput.length > 1)
        {
            filesystemControls.removeDirectory(splittedInput.at(-1));
        }
        else
        {
            console.log(`Invalid amount of arguments. Path is needed`);
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`);
        }
    }
    else if (commands["moveFileCommand"]["aliases"].includes(command))
    {
        if (splittedInput.length > 2)
        {
            filesystemControls.moveFile(splittedInput.at(-2), splittedInput.at(-1));
        }

        else
        {
            console.log(`Invalid amount of arguments. Path is needed`);
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`);
        }
    }
    else
    {
        logger.info(`User entered unknown command: ${command}`);
        console.log(`Unknown command: ${command}. Type 'help' to get a list of available commands`);
    }

    readline.setPrompt(`${filesystemControls.getCurrentDirectory(false)} > `);
    readline.prompt();
}

function start()
{
    readline.setPrompt(`${filesystemControls.getCurrentDirectory(false)} > `)
    readline.prompt()

    logger.info("Set up command prompt")

    readline.on("line", processInput)
}

commandLine = {
    listen: start
}

module.exports = commandLine
