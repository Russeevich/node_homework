const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')

const mainDir = process.argv[2] ? path.resolve(__dirname, process.argv[2]) : path.resolve(__dirname, './test1')
const pathMain = process.argv[3] ? path.resolve(__dirname, process.argv[3]) : path.resolve(__dirname, './test2')
const deleteFolder = process.argv[4] ? process.argv[4] : false

const takeError = (err) => {
    if (err) {
        throw new Error(err)
    }
}

fs.remove(pathMain, takeError)


glob(mainDir + '/**/*.*', async(err, res) => {

    takeError(err)

    const files = res.map(item => ({ name: item.split('/')[item.split('/').length - 1], path: item }))

    fs.mkdir(pathMain, takeError)

    for (const item of files) {
        const pathx = path.resolve(`${pathMain}/${item.name[0].toUpperCase()}`)

        if (!fs.pathExists(pathx)) {
            fs.mkdir(pathx, takeError)
        }

        if (deleteFolder === true) {
            fs.move(item.path, path.resolve(`${pathx}/${item.name}`), takeError)
        } else {
            fs.copyFile(item.path, path.resolve(`${pathx}/${item.name}`), takeError)
        }
    }
    if (deleteFolder === 'true')
        fs.remove(mainDir, takeError)
})