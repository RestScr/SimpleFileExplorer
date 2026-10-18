const console = require("node:console");
const logger = require("../services/logger.js")
const fs = require("node:fs")
const path = require("node:path")
const commands = require("./commands.js")

const localFilesystem = path.join(__dirname, "..", "localdir")

const readline = require("node:readline").createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
)


class FilesystemControls
{
    localDirectory = "."

    constructor()
    {
        fs.mkdirSync(localFilesystem, { recursive: true })
    }

    clearConsole(echo = true)
    {
        logger.info("User cleared the console")
        console.clear()
    }

    commandExists(commandName, echo = true)
    {
        for (const command of Object.keys(commands)) {
            if (commands[command]["aliases"].includes(commandName)) {
                return command
            }
        }

        return null
    }

    isSubdirectory(parentDir, subDir, echo = true)
    {
        const relative = path.relative(parentDir, subDir);

        return !relative.startsWith('..' + path.sep) &&
            relative !== '..' &&
            !path.isAbsolute(relative);
    }

    isPathExistsInLocalFileSystem(filepath, echo = true)
    {
        return fs.existsSync(path.join(localFilesystem, this.localDirectory, filepath))
    }

    isDirectoryOutOfLocalFilesystem(newDirectory, echo = true)
    {
        return !this.isSubdirectory(localFilesystem, path.join(localFilesystem, newDirectory));
    }


    changeDirectory(newDirectory, echo = true)
    {
        logger.info(`User wants to change directory from ${this.localDirectory} to ${newDirectory} . Potentially he could globally changed to ${path.join(localFilesystem, this.localDirectory, newDirectory)}`)

        if (this.isPathExistsInLocalFileSystem(newDirectory))
        {
            let newLocalDirectory = path.join(this.localDirectory, newDirectory)
            // ѕроверка, не вышел ли пользователь за рамки локальной директории
            // ѕользователь мог прописать что-то вроде "../someFolder" и выйти за пределы локальной директории
            // »з-за того что someFolder может быть существующей директорией
            if (!this.isDirectoryOutOfLocalFilesystem(newLocalDirectory))
            {
                this.localDirectory = newLocalDirectory
            }
            logger.info(`User changed directory to ${this.localDirectory}. Now globally he is in ${path.join(localFilesystem, this.localDirectory)}`)
        }
        else if (fs.existsSync(path.join(localFilesystem, newDirectory)))
        {
            let newLocalDirectory = newDirectory
            if (!this.isDirectoryOutOfLocalFilesystem(newLocalDirectory))
            {
                this.localDirectory = newLocalDirectory
            }
            logger.info(`User changed directory to ${this.localDirectory}. Now globally he is in ${path.join(localFilesystem, this.localDirectory)}`)
        }
        else
        {
            let message = `Directory "${path.join(this.localDirectory, newDirectory)}" does not exist.`
            console.log(message)
            logger.info(message)
        }
        return this.localDirectory
    }


    createDirectory(dirpath, echo=true) {
        if (this.isDirectoryOutOfLocalFilesystem(path.join(this.localDirectory, dirpath)))
        {
            logger.warn(`User tried to create directory ${dirpath} outside of local filesystem`)
            console.log(`Directory ${dirpath} does not exist`)
        }
        else
        {
            fs.mkdirSync(path.join(localFilesystem, this.localDirectory, dirpath), { recursive: true })
            logger.info(`Directory ${path.join(this.localDirectory, dirpath)}.`)
            console.log(`Directory ${dirpath} created.`)
        }
    }


    createFile(filepath, echo=true) {
        logger.info(`User wants to create file ${filepath} in ${this.localDirectory}. 
        Potentially he could globally created file in ${path.join(localFilesystem, this.localDirectory, filepath)}`)
        if (this.isDirectoryOutOfLocalFilesystem(path.join(this.localDirectory, filepath)))
        {
            logger.warn(`User tried to create file ${filepath} outside of local filesystem`)
            console.log(`Path ${path.dirname(filepath)} does not exist`)
        }
        else
        {
            fs.mkdirSync(path.join(localFilesystem, this.localDirectory, path.dirname(filepath)), { recursive: true })
            fs.writeFileSync(path.join(localFilesystem, this.localDirectory, filepath), "w")
            logger.info(`User created file ${path.join(localFilesystem, this.localDirectory, filepath)}.`)
            console.log(`File ${filepath} created.`)
        }
    }


    deleteFile(filepath, echo=true) {
        logger.info(`User wants to delete file ${filepath} in ${this.localDirectory}. 
        Potentially he could globally deleted file in ${path.join(localFilesystem, this.localDirectory, filepath)}`)

        if (this.isDirectoryOutOfLocalFilesystem(path.join(this.localDirectory, filepath)))
        {
            logger.warn(`User tried to create file ${filepath} outside of local filesystem`)
            console.log(`Path ${path.dirname(filepath)} does not exist`)
        }
        else
        {
            if (this.isPathExistsInLocalFileSystem(filepath))
            {
                try
                {
                    fs.unlinkSync(path.join(localFilesystem, this.localDirectory, filepath))
                    console.log(`File ${filepath} deleted.`)
                }
                catch (error)
                {
                    if (error.code === 'EPERM')
                    {
                        console.log(`Could not find the file "${filepath}".`)
                        logger.warn(`Could not find the file "${filepath}". Message: ${error.message}`)
                    }
                    else
                    {
                        console.log(`Error deleting file "${filepath}": ${error.message}`)
                        logger.warn(`Some error occured while deleting file "${filepath}": ${error.message}.
                        Message: ${error.message}`)
                    }
                }
            }
            else
            {
                console.log(`File "${filepath}" does not exist.`)
                logger.info(`File "${filepath}" does not exist.`)
            }
        }
    }


    printDirectoryContents(directoryContents, basename=".", echo = true)
    {
        logger.info(`User gets directory contents printed`)
        console.log("-----List of directories and files:-----")
        console.log(`NAME\t\tTYPE\t\tEXT`)
        for (let file of directoryContents)
        {
            let fileType = ""
            if (fs.statSync(path.join(localFilesystem, this.localDirectory, path.join(basename, file))).isDirectory())
            {
                fileType = "DIR"
            }
            else
            {
                fileType = "FILE"
            }
            let extension = path.extname(file)

            console.log(`${path.join(basename, file)}\t\t${fileType}\t\t${extension}`)
            logger.info(`User gets: ${file}`)
        }
    }


    listDirectory(dir = null, echo=true) {
        let directoryContents = null
        if (dir !== null)
        {
            if (this.isDirectoryOutOfLocalFilesystem(path.join(this.localDirectory, dir)))
            {
                logger.warn(`User tried to list directory ${dir} outside of local filesystem`)
                console.log(`Directory ${dir} does not exist`)
            }
            else
            {
                directoryContents = fs.readdirSync(path.join(localFilesystem, this.localDirectory, dir))
                this.printDirectoryContents(directoryContents, dir)
            }
        }
        else
        {
            directoryContents = fs.readdirSync(path.join(localFilesystem, this.localDirectory))
            this.printDirectoryContents(directoryContents)
        }
        return directoryContents
    }


    printConcreticCommandDescription(concreticCommand, echo = true)
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
        if (Object.keys(commands[concreticCommand]["params"]).length > 0)
        {
            console.log(`Params:`)
            for (param of Object.keys(commands[concreticCommand]["params"]))
            {
                // Empty
            }
        }
        console.log("\n\n")
    }


    printHelp(commandName = null, echo = true)
    {
        logger.info(`Printing command documentation of: ${commandName}`)

        if (commandName)
        {
            // ѕроверка введенной команды на корректность
            let concreticCommand = this.commandExists(commandName)
            if (!concreticCommand)
            {
                console.log("Command does not exist. Type 'help' to get a list of available commands")
                logger.warn(`Command ${commandName} does not exist`)
                return
            }

            this.printConcreticCommandDescription(concreticCommand)
        }
        else
        {
            for (const command of Object.keys(commands))
            {
                this.printConcreticCommandDescription(command)
            }
        }
    }

    getCurrentDirectory(echo = true)
    {
        if (echo)
        {
            logger.info(`User got current directory: ${this.localDirectory}`)
            console.log(this.localDirectory)
        }

        return this.localDirectory
    }


    moveFile(currentPath, newPath, echo = true)
    {
        let localFilename = path.join(this.localDirectory, currentPath);
        let newLocalFilename = path.join(this.localDirectory, newPath);

        if (this.isDirectoryOutOfLocalFilesystem(localFilename))
        {
            console.log(`Path ${path.dirname(currentPath)} does not exist`)
            logger.warn(`User tried to move file ${currentPath} outside of local filesystem`)
        }
        else if (this.isDirectoryOutOfLocalFilesystem(newLocalFilename))
        {
            console.log(`Path ${path.dirname(newPath)} does not exist`)
            logger.warn(`User tried to move file ${newPath} outside of local filesystem`)
        }
        else if (!this.isPathExistsInLocalFileSystem(currentPath))
        {
            console.log(`File ${currentPath} does not exist`)
            logger.warn(`User tried to move file ${currentPath} which does not exist`)
        }
        else if (!this.isPathExistsInLocalFileSystem(path.dirname(newPath))) {
            console.log(`Directory ${path.dirname(newPath)} does not exist`)
            logger.info(`User tried to move file ${newPath} to directory which does not exist`)
        }
        else if (this.isPathExistsInLocalFileSystem(newPath))
        {
            console.log(`Path ${path.dirname(newPath)} already exists`)
            logger.info(`User tried to move file ${newPath} to path which already exists`)
        }
        else
        {
            fs.renameSync(path.join(localFilesystem, this.localDirectory, currentPath), path.join(localFilesystem, this.localDirectory, newPath))
        }
    }

    removeDirectory(dirpath, echo = true)
    {
        let localDirpath = path.join(this.localDirectory, dirpath);

        if (this.isDirectoryOutOfLocalFilesystem(localDirpath))
        {
            console.log(`Path ${localDirpath} does not exist`)
            logger.warn(`User tried to remove directory ${localDirpath} outside of local filesystem`)
        }
        else if (!this.isPathExistsInLocalFileSystem(dirpath))
        {
            console.log(`Path ${localDirpath} does not exist`)
            logger.info(`User tried to remove directory ${localDirpath} which does not exist`)
        }
        else
        {
            fs.rmSync(path.join(localFilesystem, localDirpath), { recursive: true, force: true })
            console.log(`Directory ${localDirpath} removed.`)
            logger.info(`User removed directory ${localDirpath}`)
        }
    }
}


module.exports = {
    FilesystemControls: FilesystemControls,
    readline: readline
}
