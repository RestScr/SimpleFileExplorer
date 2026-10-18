// Application Entry point

const commandLine = require("./model/command-line.js")
const logger = require("./services/logger.js")

logger.info("Starting up application")

const server = require("./model/server.js")

