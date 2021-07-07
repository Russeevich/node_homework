const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')

const mainDir = process.argv[2] ? path.resolve(__dirname, process.argv[2]) : path.resolve(__dirname, './test1')
const pathMain = process.argv[3] ? path.resolve(__dirname, process.argv[3]) : path.resolve(__dirname, './test2')
const deleteFolder = process.argv[4] ? process.argv[4] : false

const cpFile = (item, pathx) => {
    return new Promise((resolve, reject) => {
        if (deleteFolder === true) {
            fs.move(item.path, path.resolve(`${pathx}/${item.name}`), (err) => {
                if (err) {
                    reject(new Error(err))
                }

                resolve('File moved')
            })
        } else {
            fs.copyFile(item.path, path.resolve(`${pathx}/${item.name}`), (err) => {
                if (err) {
                    reject(new Error(err))
                }

                resolve('File copied')
            })
        }
    })
}

const getFile = (dir) => {
    return new Promise((resolve, reject) => {
        glob(dir, (err, res) => {
            if (err) {
                reject(new Error(err))
            }
            const files = res.map(item => ({ name: item.split('/')[item.split('/').length - 1], path: item }))

            if (files.length < 1)
                reject(new Error('No files found'))

            resolve(files)
        })
    })
}

const makeDir = (dirPath) => {
    return new Promise((resolve, reject) => {
        if (!fs.pathExistsSync(dirPath)) {
            fs.mkdir(dirPath, (err) => {
                if (err) {
                    reject(new Error(err))
                }
                resolve('Dir created')
            })
        } else {
            resolve('OK')
        }
    })
}

const removeFolder = (path) => {
    return new Promise((resolve, reject) => {
        fs.remove(path, (err) => {
            if (err) {
                reject(new Error(err))
            }

            resolve('Dir removed')
        })
    })
}

const startApp = async() => {
    try {
        await removeFolder(pathMain)
        const files = await getFile(mainDir + '/**/*.*')

        await makeDir(pathMain)

        for await (const item of files) {
            const pathx = path.resolve(`${pathMain}/${item.name[0].toUpperCase()}`)
            await makeDir(pathx)
            await cpFile(item, pathx)
        }
        if (deleteFolder === 'true')
            await removeFolder(mainDir)
    } catch (err) {
        console.log(err.message)
    }
}

startApp()