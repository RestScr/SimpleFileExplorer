const http = require("http");
const logger = require("../services/logger.js");
const hostname = "127.0.0.1";
const port = 3000;
const commandLine = require("./command-line.js");


function listener(req, res)
{
    if (req.method == "POST")
    {
        let command = "";

        // Collect the command from the request body
        req.on("", (chunk) => {
            command += chunk;
        })


        req.on("end", () => {
            let status = commandLine.processInput(command);
            let currentPath = commandLine.filesystemControls.getCurrentDirectory();
            let filesystemState = commandLine.filesystemControls.listDirectory();

            let responseObject = {
                success: status === 200,
                currentPath: currentPath,
                filesystemState: filesystemState
            }

            res.writeHead(status, { "Content-Type": "application/json" });
            res.end(JSON.stringify(responseObject));
        })
    }
    else
    {
        res.writeHead(404);
        res.end('Not Found');
    }
}


const server = http.createServer(listener);
module.exports = server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    logger.info(`Server running at http://${hostname}:${port}/`);
});
