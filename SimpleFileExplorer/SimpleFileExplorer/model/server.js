const express = require("express")
const path = require("path")
const logger = require("../services/logger.js")
const commandLine = require("./command-line.js")

const hostname = "127.0.0.1";
const port = 3000;
const pageDir = path.join(__dirname, "..", "public")


const app = express()

app.use(express.json())
app.use(express.static(pageDir))

// Получение списка файлов
app.get(
    "/api/files",
    (req, res) =>
    {
        res.json({ contents: commandLine.processInput("ls") })
    }
)

// Удаление каталогв
app.delete(
    "/api/files/delete/directory/:directory",
    (req, res) =>
    {
        let directory = req.params.directory

        res.json({ status: commandLine.processInput(`rmdir ${directory}`) })
    }
)

// Удаление файла
app.delete(
    "/api/files/delete/file/:filename",
    (req, res) =>
    {
        let filename = req.params.filename

        res.json({ status: commandLine.processInput(`rm ${filename}`) })
    }
)

// Создание файла
app.post(
    "/api/files/create/file/:filename",
    (req, res) =>
    {
        let filename = req.params.filename

        res.json({ status: commandLine.processInput(`touch ${filename}`) })
    }
)

// Создание каталога
app.post(
    "/api/files/create/directory/:directory",
    (req, res) =>
    {
        let directory = req.params.directory

        res.json({status: commandLine.processInput(`mkdir ${directory}`)})
    }
)

// Перемещение файла
app.patch(
    "/api/files/move/:filename/to/:destination",
    (req, res) =>
    {
        let filename = req.params.filename
        let destination = req.params.destination

        res.json({status: commandLine.processInput(`mv ${filename} ${destination}`)})
    }
)

// Изменение рабочего каталога
app.patch(
    "/api/files/change/directory/:directory",
    (req, res) =>
    {
        let directory = req.params.directory
        res.json(
            {
                status: commandLine.processInput(`cd ${directory}`),
                newPath: commandLine.processInput(`pwd`)
            }
        )
    }
)

module.exports = app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    logger.info(`Server running at http://${hostname}:${port}/`);
});
