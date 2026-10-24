async function getDirList()
{
    let response = await fetch('/api/files')
    let dirContent = await response.json()
    console.log(dirContent)

    let explorer = document.getElementById("explorer")
    explorer.innerHTML = `
        <tr>
            <th>Filename</th>
            <th>Type</th>
            <th>Extension</th>
        </tr>
    `
    for (let filesystemObject of dirContent["contents"])
    {
        explorer.innerHTML += `
        <tr>
            <th>${filesystemObject["name"]}</th>
            <th>${filesystemObject["type"]}</th>
            <th>${filesystemObject["extension"]}</th>
        </tr>
        `
    }
}


async function createDirectory()
{
    let directoryNameArea = document.getElementById("directoryNameInput")
    let dirName = directoryNameArea.value.trim(" ")
    console.log(dirName)
    if (dirName === "")
    {
        alert("Введите название директории")
        return
    }

    let request = await fetch(
        `/api/files/create/directory/${encodeURIComponent(dirName)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ })
        }
    )
    console.log((await request.json())["status"])
    getDirList()
}


async function createFile()
{
    let fileNameArea = document.getElementById("fileNameInput")
    let fileName = fileNameArea.value.trim()
    if (fileName === "") {
        alert("Введите название файла")
        return
    }

    let request = await fetch(
        `/api/files/create/file/${encodeURIComponent(fileName)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }
    )
    console.log((await request.json())["status"])
    getDirList()
}


async function deleteFile()
{
    let fileNameArea = document.getElementById("deleteFileNameInput")
    let fileName = fileNameArea.value.trim()
    if (fileName === "")
    {
        alert("Введите название файла")
        return
    }


    let request = await fetch(
        `/api/files/delete/file/${encodeURIComponent(fileName)}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }
    )
    console.log((await request.json())["status"])
    getDirList()
}


async function moveFile()
{
    let moveFileNameArea = document.getElementById("moveFileNameInput");
    let newFileNameArea = document.getElementById("newFileNameInput");

    let moveFileName = moveFileNameArea.value.trim()
    let newFileName = newFileNameArea.value.trim()

    if (moveFileName === "")
    {
        alert("Введите название файла")
        return
    }
    if (newFileName === "")
    {
        alert("Введите новое название файла")
        return
    }

    let request = await fetch(
        `/api/files/move/${encodeURIComponent(moveFileName)}/to/${encodeURIComponent(newFileName)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }
    )
    console.log((await request.json())["status"])
    await getDirList()
}

/*
async function changeDirectory()
{
    let pathArea = document.getElementById("pathInput")
    let path = pathArea.value.trim()
    if (path === "")
    {
        path = "."
    }

    console.log(encodeURIComponent(path))

    let request = await fetch(
        `/api/files/change/directory/${encodeURIComponent(path)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }
    )

    let response = await request.json()
    console.log(response["status"])
    let currentPathDemo = document.getElementById("currentPathDemo")
    currentPathDemo.textContent = response["newPath"]
    await getDirList()
}
*/

function bindButtons()
{
   // let changeDirectoryButton = document.getElementById("changeDirectoryButton")
    let createDirectoryButton = document.getElementById("createDirectoryButton")
    let addFileButton = document.getElementById("addFileButton")
    let moveFileButton = document.getElementById("moveFileButton")
    let deleteFileButton = document.getElementById("deleteFileButton")

    //changeDirectoryButton.addEventListener("click", async () => { await changeDirectory() })
    createDirectoryButton.addEventListener("click", async () => { await createDirectory() })
    addFileButton.addEventListener("click", async () => { await createFile() })
    moveFileButton.addEventListener("click", async () => { await moveFile() })
    deleteFileButton.addEventListener("click", async () => { await deleteFile() })
}


getDirList()
bindButtons()
