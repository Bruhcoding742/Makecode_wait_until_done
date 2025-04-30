//% color=#FF8800 icon="⏳" block="ActionUtils"
namespace ActionUtils {
    let lastActionDone = true;
    let namedActions: { [name: string]: { endTime: number, pausedTime: number, isFinished: boolean } } = {};

    /**
     * Starts a generic action and marks it done after the specified duration.
     * @param duration how long the action takes, in ms
     */
    //% block
    export function startAction(duration: number): void {
        lastActionDone = false;
        control.inBackground(() => {
            pause(duration);
            lastActionDone = true;
        });
    }

    /**
     * Returns true if the last generic action is finished.
     */
    //% block
    export function isActionDone(): boolean {
        return lastActionDone;
    }

    /**
     * Waits until the last generic action is done, then runs callback.
     */
    //% block
    export function waitUntilActionDoneThen(callback: () => void): void {
        control.inBackground(() => {
            while (!lastActionDone) pause(50);
            callback();
        });
    }

    /**
     * Starts a named action that completes after a specified duration.
     * @param name The case-sensitive name of the action.
     * @param duration Duration in milliseconds before the action completes.
     */
    //% block
    export function startNamedAction(name: string, duration: number): void {
        namedActions[name] = { endTime: control.millis() + duration, pausedTime: 0, isFinished: false };
    }

    /**
     * Returns true if the named action is done (or unknown).
     * @param name The case-sensitive name of the action.
     */
    //% block
    export function isNamedActionDone(name: string): boolean {
        const action = namedActions[name];
        if (action === undefined) return true; // Action does not exist
        if (control.millis() >= action.endTime + action.pausedTime) {
            action.isFinished = true; // Mark action as finished
            return true;
        }
        return false;
    }

    /**
     * Waits until the named action is done, then runs a callback.
     * @param name The case-sensitive name of the action.
     * @param callback Code to run once the action is completed.
     */
    //% block
    export function waitUntilNamedActionDone(name: string, callback: () => void): void {
        control.inBackground(() => {
            while (!isNamedActionDone(name)) pause(50);
            callback();
        });
    }

    /**
     * Cancels a named action immediately.
     * @param name The case-sensitive name of the action.
     */
    //% block
    export function cancelNamedAction(name: string): void {
        delete namedActions[name];
    }

    /**
     * Gets remaining time for a named action (0 if it's done or unknown).
     * @param name The case-sensitive name of the action.
     */
    //% block
    export function getRemainingTime(name: string): number {
        const action = namedActions[name];
        if (action === undefined) return 0;
        return Math.max(0, action.endTime - control.millis() - action.pausedTime);
    }

    /**
     * Pauses a named action without cancelling it.
     * @param name The case-sensitive name of the action.
     */
    //% block
    export function pauseNamedAction(name: string): void {
        const action = namedActions[name];
        if (action) {
            action.pausedTime += control.millis() - action.endTime;
        }
    }

    /**
     * Resumes a paused action.
     * @param name The case-sensitive name of the action.
     */
    //% block
    export function resumeNamedAction(name: string): void {
        const action = namedActions[name];
        if (action && action.pausedTime > 0) {
            action.endTime = control.millis() + (action.endTime - action.pausedTime);
            action.pausedTime = 0;
        }
    }

    /**
     * Starts an action and immediately runs the provided block of code once it's done.
     * This is a wrapper around the "startAction" block for quick tasks.
     * @param duration The duration of the action in ms.
     * @param block The block of code to run when the action is finished.
     */
    //% block
    export function withAction(duration: number, block: () => void): void {
        startAction(duration);
        waitUntilActionDoneThen(block);
    }

    /**
     * Wraps a block of code in a named action context. The action is immediately marked as "done" after the block executes.
     * @param name The name of the action.
     * @param block The code to execute.
     */
    //% block
    export function withNamedAction(name: string, block: () => void): void {
        block();
        namedActions[name] = { endTime: control.millis(), pausedTime: 0, isFinished: true };
    }

    /**
     * Checks if any named action exists with the specified name.
     * @param name The case-sensitive name of the action.
     * @returns True if the action exists, otherwise false.
     */
    //% block
    export function hasNamedAction(name: string): boolean {
        return namedActions[name] !== undefined;
    }

    /**
     * Waits for any action to complete before executing a callback.
     * @param callback The code to execute once any active action completes.
     */
    //% block
    export function waitForAnyActionDone(callback: () => void): void {
        control.inBackground(() => {
            while (Object.keys(namedActions).length > 0) {
                let isActionComplete = true;
                for (let action in namedActions) {
                    if (!isNamedActionDone(action)) {
                        isActionComplete = false;
                        break;
                    }
                }
                if (isActionComplete) {
                    break;
                }
                pause(50);
            }
            callback();
        });
    }

    /**
     * Returns whether a named action is finished.
     * @param name The case-sensitive name of the action.
     */
    //% block
    export function isActionFinished(name: string): boolean {
        const action = namedActions[name];
        return action ? action.isFinished : false;
    }
}
