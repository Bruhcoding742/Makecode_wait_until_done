# Makecode Wait Until Done Extension

This MakeCode extension provides utility blocks to start an action with a duration, check if the action has finished, and wait until it completes before running further code.

## Features
- `startAction(duration)`: Begin an action of given milliseconds.
- `isActionDone()`: Returns a boolean indicating if the action has completed.
- `waitUntilActionDoneThen(callback)`: Runs a callback once the action finishes.

## Usage
1. Import this extension in your MakeCode project: **Extensions > Import from GitHub**.
2. Search for `action-waiter` and add it.
3. Drag the blocks from the **ActionUtils** category.

```typescript
actionUtils.startAction(1000)
if (actionUtils.isActionDone()) {
    sprite.x += 5
} else {
    actionUtils.waitUntilActionDoneThen(() => {
        sprite.x += 5
    })
}
```