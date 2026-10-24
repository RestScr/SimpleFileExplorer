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
        aliases: ["ls", "listdir"],
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
    },

    removeDirectoryCommand:
    {
        aliases: ["rmdir", "removedir", "removedirectory"],
        description: "Remove directory from catalog",
        usage: "rmdir [path]",
        params: {}
    }
}


module.exports = commands
