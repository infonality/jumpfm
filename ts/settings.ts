import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

export const root = path.join(homedir(), ".jumpfm");

if (!fs.existsSync(root)) fs.mkdirSync(root);

const typeOf = obj => Array.isArray(obj) ? 'array' : typeof obj

function sync<T>(obj: any, defaults: T): T {
    // console.log(
    //     'sync',
    //     JSON.stringify(obj),
    //     JSON.stringify(defaults),
    //     typeof obj,
    //     typeof defaults
    // )

    if (typeOf(obj) !== 'object')
        return typeOf(obj) === typeOf(defaults) ?
            obj :
            defaults

    Object.keys(defaults).forEach(key => {
        obj[key] = obj.hasOwnProperty(key) ?
            sync(obj[key], defaults[key]) :
            defaults[key]
    })

    Object.keys(obj).forEach(key => {
        if (!defaults.hasOwnProperty(key)) delete obj[key]
    })

    return obj
}

function load<T>(fullPath: string, defaults: T): T {
    const save = (settings) => {
        fs.writeFileSync(fullPath, JSON.stringify(settings, null, 4));
        return settings
    }

    try {
        return save(
            fs.existsSync(fullPath) ?
                sync(require(fullPath), defaults) :
                defaults
        )
    } catch (e) {
        console.log(e)
        return save(defaults)
    }
}

export const miscFullPath = path.join(root, 'misc.json')
export const pluginsFullPath = path.join(root, 'plugins.json')
export const keysFullPath = path.join(root, 'keys.json')

export const misc = load(miscFullPath, {
    editor: 'gedit',
    maxFilesInPanel: 1000
})

export const plugins = load(pluginsFullPath, {
    plugins: []
})

export const keys = load(keysFullPath, {
    nav: {
        down: ['down'],
        downSelect: ['shift+down'],
        pgDown: ['pagedown'],
        pgDownSelect: ['shift+pagedown'],
        up: ['up'],
        upSelect: ['shift+up'],
        pgUp: ['pageup'],
        pgUpSelect: ['shift+pageup'],
        home: ['home'],
        homeSelect: ['shift+home'],
        end: ['end'],
        endSelect: ['shift+end'],
        enter: ['enter'],
        back: ['backspace'],
        homeDir: ['ctrl+home'],
        openToRight: ['ctrl+right'],
        openToLeft: ['ctrl+left'],
        historyBack: ['alt+left'],
        historyForward: ['alt+right'],
    },
    selection: {
        toggle: ['space'],
        all: ['ctrl+a'],
        clear: ['esc'],
    },
    file: {
        del: ['del'],
        edit: ['f4'],
        newFile: ['shift+f4'],
        newDir: ['f7'],
        rename: ['f2']
    },
    panels: {
        switch: ['tab'],
        copy: ['f5'],
        move: ['f6'],
        swap: ['s'],
    }
})