const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')

const mainDir = path.resolve(__dirname, process.argv[2])
const pathMain = path.resolve(__dirname, process.argv[3])
const deleteFolder = process.argv[4]

const types = [
    { type: ".pdf", dir: 'documents' },
    { type: ".png", dir: 'images' },
    { type: ".mp3", dir: "music" }
]

fs.removeSync(pathMain)

glob(mainDir + '/**/*.*', (err, res) => {
    const files = res.map(item => ({ name: item.split('/')[item.split('/').length - 1], path: item, ext: item.split('/')[item.split('/').length - 1].split('.')[1] }))
    if (!fs.existsSync(pathMain))
        fs.mkdirSync(pathMain)
    for (const item of files) {
        const dirPath = path.resolve(`${pathMain}/${types.find(type => type.type.includes(item.ext)) ?types.find(type => type.type.includes(item.ext)).dir : 'other' }`)
        if (!fs.existsSync(dirPath))
            fs.mkdirSync(dirPath)
        const pathx = path.resolve(`${dirPath}/${item.name[0]}`).toString()
        if (!fs.existsSync(pathx))
            fs.mkdirSync(pathx)
        fs.moveSync(item.path, path.resolve(`${pathx}/${item.name}`).toString())
    }
    if (deleteFolder === 'true')
        fs.removeSync(mainDir)
})