const console = require("node:console");
const logger = require("../services/logger.js")
const fs = require("node:fs")
const path = require("node:path")

let localDirectory = "."
const localFilesystem = path.join(__dirname, "..", "localdir")
fs.mkdirSync(localFilesystem, { recursive: true })


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
        aliases: ["mkdir", "makedirectory", "makedir", "createdirectory", "createdir"],
        description: "Create a new directory",
        usage: "mkdir [path]",
        params: {}
    },

    getCurrentDirectoryCommand: {
        aliases: ["whereami", "pwd"],
        description: "Get a path of your current directory",
        usage: "pwd",
        params: {}
    },

    listDirectoryCommand: {
        aliases: ["ls", "list"],
        description: "Get a list of files and catalogs of a current directory",
        usage: "ls",
        params: {}
    },

    changeDirectoryCommand: {
        aliases: ["cd", "changedir"],
        description: "Change the current directory",
        usage: "cd [path]",
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
        aliases: ["rm", "remove", "delete"],
        description: "Remove File from catalog",
        usage: "rm [path]",
        params: {}
    },

    createFileCommand:
    {
        aliases: ["touch", "createfile", "create", "cf"],
        description: "Create a new file",
        usage: "touch [path]",
        params: {}
    },

    clearConsoleCommand:
    {
        aliases: ["clear", "cls"],
        description: "Clear console",
        usage: "clear",
        params: {}
    },

    deleteFileCommand:
    {
        aliases: ["rm", "remove", "delete"],
        description: "Remove File from catalog",
        usage: "rm [path]",
        params: {}
    }
}


function clearConsole()
{
    logger.info("User cleared the console")
    console.clear()
}


function commandExists(commandName) {
    for (const command of Object.keys(commands)) {
        if (commands[command]["aliases"].includes(commandName)) {
            return command
        }
    }

    return null
}


function isSubdirectory(parentDir, subDir)
{
    const relative = path.relative(parentDir, subDir);

    return !relative.startsWith('..' + path.sep) &&
        relative !== '..' &&
        !path.isAbsolute(relative);
}


function isPathExistsInLocalFileSystem(filepath)
{
    return fs.existsSync(path.join(localFilesystem, localDirectory, filepath))
}


function isDirectoryOutOfLocalFilesystem(newDirectory)
{
    return !isSubdirectory(localFilesystem, path.join(localFilesystem, newDirectory));
}


function changeDirectory(newDirectory)
{
    logger.info(`User wants to change directory from ${localDirectory} to ${newDirectory} . Potentially he could globally changed to ${path.join(localFilesystem, localDirectory, newDirectory)}`)

    if (isPathExistsInLocalFileSystem(newDirectory)) {
        newLocalDirectory = path.join(localDirectory, newDirectory)
        // ѕроверка, не вышел ли пользователь за рамки локальной директории
        // ѕользователь мог прописать что-то вроде "../someFolder" и выйти за пределы локальной директории
        // »з-за того что someFolder может быть существующей директорией
        if (!isDirectoryOutOfLocalFilesystem(newLocalDirectory))
        {
            localDirectory = newLocalDirectory
        }
        logger.info(`User changed directory to ${localDirectory}. Now globally he is in ${path.join(localFilesystem, localDirectory)}`)
    }
    else if (fs.existsSync(path.join(localFilesystem, newDirectory))) {
        newLocalDirectory = newDirectory
        if (!isDirectoryOutOfLocalFilesystem(newLocalDirectory))
        {
            localDirectory = newLocalDirectory
        }
        logger.info(`User changed directory to ${localDirectory}. Now globally he is in ${path.join(localFilesystem, localDirectory)}`)
    }
    else
    {
        console.log(`Directory "${path.join(localDirectory, newDirectory)}" does not exist.`)
        logger.info(`Directory "${path.join(localDirectory, newDirectory)}" does not exist.`)
    }
    return localDirectory
}


function createDirectory(dirpath)
{
    if (isDirectoryOutOfLocalFilesystem(path.join(localDirectory, dirpath))) {
        logger.warn(`User tried to create directory ${dirpath} outside of local filesystem`)
        console.log(`Directory ${dirpath} does not exist`)
    }
    else
    {
        fs.mkdirSync(path.join(localFilesystem, localDirectory, dirpath), { recursive: true })
        logger.info(`User created directory ${path.join(localDirectory, dirpath)}.`)
        console.log(`Directory ${dirpath} created.`)
    }
}


function createFile(filepath)
{
    logger.info(`User wants to create file ${filepath} in ${localDirectory}. Potentially he could globally created file in ${path.join(localFilesystem, localDirectory, filepath)}`)
    if (isDirectoryOutOfLocalFilesystem(path.join(localDirectory, filepath))) {
        logger.warn(`User tried to create file ${filepath} outside of local filesystem`)
        console.log(`Path ${path.dirname(filepath)} does not exist`)
    }
    else
    {
        fs.mkdirSync(path.join(localFilesystem, localDirectory, path.dirname(filepath)), { recursive: true })
        fs.writeFileSync(path.join(localFilesystem, localDirectory, filepath), "w")
        logger.info(`User created file ${path.join(localFilesystem,localDirectory, filepath)}.`)
        console.log(`File ${filepath} created.`)
    }
}


function deleteFile(filepath)
{
    logger.info(`User wants to delete file ${filepath} in ${localDirectory}. Potentially he could globally deleted file in ${path.join(localFilesystem, localDirectory, filepath)}`)
    if (isDirectoryOutOfLocalFilesystem(path.join(localDirectory, filepath))) {
        logger.warn(`User tried to create file ${filepath} outside of local filesystem`)
        console.log(`Path ${path.dirname(filepath)} does not exist`)
    }
    else {
        if (isPathExistsInLocalFileSystem(filepath)) {
            console.log(`File ${filepath} deleted.`)
            fs.unlinkSync(path.join(localFilesystem, localDirectory, filepath))
        }
        else
        {
            console.log(`File "${filepath}" does not exist.`)
            logger.info(`File "${filepath}" does not exist.`)
        }
    }
}


function printDirectoryContents(directoryContents)
{
    logger.info(`User gets directory contents printed`)
    console.log("-----List of directories and files:-----")
    for (file of directoryContents)
    {
        console.log(file)
        logger.info(`User gets: ${file}`)
    }
}


function listDirectory(dir=null)
{
    directoryContents = null
    if (dir !== null)
    {
        if (isDirectoryOutOfLocalFilesystem(path.join(localDirectory, dir))) {
            logger.warn(`User tried to list directory ${dir} outside of local filesystem`)
            console.log(`Directory ${dir} does not exist`)
        }
        else
        {
            directoryContents = fs.readdirSync(path.join(localFilesystem, localDirectory, dir))
        }
    }
    else
    {
        directoryContents = fs.readdirSync(path.join(localFilesystem, localDirectory))
        printDirectoryContents(directoryContents)
    }
    return directoryContents
}


function printConcreticCommandDescription(concreticCommand)
{
    if (!Object.keys(commands).includes(concreticCommand))
    {
        logger.info(`Command ${concreticCommand} doest not exist.`)
        return;
    }

    console.log(`${commands[concreticCommand]["aliases"].at(0)}:`)
    console.log(`Aliases: ${commands[concreticCommand]["aliases"]}`)
    console.log(`Description: ${commands[concreticCommand]["description"]}`)
    console.log(`Usage: ${commands[concreticCommand]["usage"]}`)
    console.log()
    console.log(`Params:`)
    for (param of Object.keys(commands[concreticCommand]["params"]))
    {

    }
}


function printHelp(commandName=null)
{
    logger.info(`Printing command documentation of: ${commandName}`)
    if (commandName)
    {
        // ѕроверка введенной команды на корректность
        concreticCommand = commandExists(commandName)
        if (!concreticCommand)
        {
            console.log("Command does not exist. Type 'help' to get a list of available commands")
            logger.warn(`Command ${commandName} does not exist`)
            return
        }

        printConcreticCommandDescription(concreticCommand)
    }
    else
    {
        for (const command of Object.keys(commands))
        {
            printConcreticCommandDescription(command)
        }
    }
}


function getCurrentDirectory()
{
    logger.info(`User got current directory: ${localDirectory}`)
    console.log(localDirectory)
    return localDirectory
}


function processInput(input)
{
    logger.info(`Entered: ${input}`)
    input = input.trim()
    if (input.length == 0)
    {
        readline.prompt()
        return
    }
    splittedInputWithStrings = input.split("\"").filter(item => item.trim() != "")
    splittedInput = splittedInputWithStrings[0].split(" ")

    command = splittedInput[0]

    if (commands["helpCommand"]["aliases"].includes(command))
    {
        if (splittedInputWithStrings.length < 2) {
            if (splittedInput.length > 1) {
                printHelp(splittedInput.at(-1))
            }
            else {
                printHelp()
            }
        }
        else
        {
            printHelp(splittedInputWithStrings.at(1))
        }
    }
    else if (commands["createDirectoryCommand"]["aliases"].includes(command))
    {
        if (splittedInputWithStrings.length > 2) {
            createDirectory(splittedInputWithStrings[1])
        }
        else if (splittedInput.length > 1) {
            createDirectory(splittedInput.at(-1))
        }
        else {
            console.log(`Invalid amount of arguments. Path is needed`)
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`)
        }
    }
    else if (commands["changeDirectoryCommand"]["aliases"].includes(command))
    {
        if (splittedInputWithStrings.length > 2) {
            changeDirectory(splittedInputWithStrings[1])
        }
        else if (splittedInput.length > 1) {
            changeDirectory(splittedInput.at(-1))
        }
        else
        {
            console.log(`Invalid amount of arguments. Path is needed`)
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`)
        }
    }
    else if (commands["clearConsoleCommand"]["aliases"].includes(command))
    {
        clearConsole()
    }
    else if (commands["getCurrentDirectoryCommand"]["aliases"].includes(command))
    {
        getCurrentDirectory()
    }
    else if (commands["createFileCommand"]["aliases"].includes(command))
    {
        if (splittedInputWithStrings.length > 1) {
            createFile(splittedInputWithStrings[1])
        }
        else if (splittedInput.length > 1) {
            createFile(splittedInput.at(-1))
        }
        else {
            console.log(`Invalid amount of arguments. Path is needed`)
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`)
        }
    }
    else if (commands["listDirectoryCommand"]["aliases"].includes(command))
    {
        if (splittedInputWithStrings.length > 2) {
            listDirectory(splittedInputWithStrings[1])
        }
        else if (splittedInput.length > 1) {

            listDirectory(splittedInput.at(-1))
        }
        else {
            listDirectory()
        }
    }
    else if (commands["deleteFileCommand"]["aliases"].includes(command))
    {
        if (splittedInputWithStrings.length > 1) {
            deleteFile(splittedInputWithStrings[1])
        }
        else if (splittedInput.length > 1) {
            deleteFile(splittedInput.at(-1))
        }
        else
        {
            console.log(`Invalid amount of arguments. Path is needed`)
            logger.info(`User received message: "Invalid amount of arguments. Path is needed"`)
        }
    }
    else
    {
        logger.info(`User entered unknown command: ${command}`)
        console.log(`Unknown command: ${command}. Type 'help' to get a list of available commands`)
    }

    readline.setPrompt(`${localDirectory} > `)
    readline.prompt()
}


function start()
{
    readline.setPrompt(`${localDirectory} > `)
    readline.prompt()

    logger.info("Set up command prompt")

    readline.on("line", processInput)
}


commandLine = {
    listen: start
}

module.exports = commandLine
