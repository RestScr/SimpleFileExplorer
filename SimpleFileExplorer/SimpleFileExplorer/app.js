console.log("Hewwo")


const readline = require("node:readline").createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
)

function shutdown(args)
{
    console.log("Shutdown")
    process.kill(process.pid, "SIGTERM")
}

readline.question("Press ENTER to quit", shutdown)
