import { Panels } from './Panels'
import { Panel } from './Panel'
import { Q } from './Q'
import { JumpFm } from './JumpFm'
import { keys } from './settings'

import * as mousetrap from 'mousetrap'
import * as shell from 'shelljs'

export function bindPanelOperations(jumpFm: JumpFm) {
    const act = () => jumpFm.panels.getActivePanel()
    const pas = () => jumpFm.panels.passive()

    const switchPanel = () => {
        jumpFm.panels.switch()
        return false
    }

    const copy = () => {
        jumpFm.q.cp(
            act().getSelectedFilesFullPath(),
            pas().getCurDir()
        )
        act().deselectAll()
        return false
    }

    const move = () => {
        shell.mv(
            act().getSelectedFilesFullPath(),
            pas().getCurDir()
        )
        act().deselectAll()
        return false
    }

    const swap = () => {
        const pwd0 = act().getCurDir()
        const pwd1 = pas().getCurDir()
        act().cd(pwd1)
        pas().cd(pwd0)
        return false
    }

    const panels = keys.panels

    panels.switch.forEach(key => mousetrap.bind(key, switchPanel))
    panels.copy.forEach(key => mousetrap.bind(key, copy))
    panels.move.forEach(key => mousetrap.bind(key, move))
    panels.swap.forEach(key => mousetrap.bind(key, swap))
}