const pino = require("pino")
const fs = require("node:fs")
const path = require("node:path")

// logs folder initialization
const logsDir = path.join(__dirname, "..", "logs")
fs.mkdirSync(logsDir, { recursive: true })

// logger files saving destinations
const destinations = {
    info: pino.destination(path.join(logsDir, "info.log")),
    error: pino.destination(path.join(logsDir, "error.log"))
}

// Loger object
const logger = pino(
    {
        level: "trace"
    },
    pino.multistream(
        [
            {
                level: "info",
                stream: destinations[info]
            },
            {
                level: "error",
                stream: destinations[error]
            }
        ]
    )
)


module.exports = logger
