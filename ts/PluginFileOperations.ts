import { JumpFm } from './JumpFm'
import { Plugin } from './Plugin'

import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'
import * as cmd from 'node-cmd'
import { misc } from './settings'

class PluginFileOperations extends Plugin {
    onLoad(): void {
        const jumpFm = this.jumpFm
        const dialog = jumpFm.dialog
        const bind = this.jumpFm.bindKeys
        const activePanel = () => jumpFm.panels.getActivePanel()

        const del = () =>
            shell.rm('-rf', activePanel().getSelectedItemsUrls())

        const edit = () =>
            cmd.run(misc.editor + " " + activePanel().getCurItem().url);

        const rename = () => {
            dialog.open({
                label: 'Rename',
                onOpen: input => {
                    const name = activePanel().getCurItem().name
                    input.value = name
                    input.select()
                    input.setSelectionRange(0, name.length - path.extname(name).length);
                },
                onAccept: name => {
                    const pan = activePanel()
                    fs.renameSync(
                        pan.getCurItem().url,
                        path.join(pan.getUrl(), name)
                    )
                },
            })
        }

        const newFolder = () => {
            dialog.open({
                label: 'New Folder',
                onOpen: input => {
                    input.value = 'New Folder'
                    input.select()
                },
                onAccept: name => {
                    const pan = activePanel()
                    fs.mkdirSync(
                        path.join(pan.getUrl(), name)
                    )
                },
            })
        }

        bind('del', ['del'], del)
        bind('rename', ['f2'], rename)
        bind('newFolder', ['f7'], newFolder)
    }
}

module.exports = PluginFileOperations