//% color=#FF8800 icon="\u23F3" block="ActionUtils"
namespace ActionUtils {
    let actionDone = true

    /**
     * Starts an action and waits for the given duration before marking it done.
     * @param duration how long the action takes, eg: 2000
     */
    //% block
    export function startAction(duration: number): void {
        actionDone = false
        control.inBackground(function () {
            pause(duration)
            actionDone = true
        })
    }

    /**
     * Returns whether the action is finished.
     */
    //% block
    export function isActionDone(): boolean {
        return actionDone
    }

    /**
     * Waits until the action is done, then runs the given function.
     * @param callback the code to run after the action is done
     */
    //% block
    export function waitUntilActionDoneThen(callback: () => void): void {
        control.inBackground(function () {
            while (!actionDone) {
                pause(50)
            }
            callback()
        })
    }
}
