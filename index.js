const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')

const mainDir = path.resolve(process.argv[2])
const pathMain = path.resolve(process.argv[3])
const deleteFolder = process.argv[4]

fs.removeSync(pathMain)

glob(mainDir + '/**/*.*', (err, res) => {
    const files = res.map(item => ({ name: item.split('/')[item.split('/').length - 1], path: item }))
    if (!fs.existsSync(pathMain))
        fs.mkdirSync(pathMain)
    for (const item of files) {
        const pathx = path.resolve(`${pathMain}/${item.name[0]}`).toString()
        if (!fs.existsSync(pathx))
            fs.mkdirSync(pathx)
        fs.moveSync(item.path, path.resolve(`${pathx}/${item.name}`).toString())
    }
    if (deleteFolder === 'true')
        fs.removeSync(mainDir)
})