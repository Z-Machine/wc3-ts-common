import { AnyFilter, asCondition, asFilter } from "../types/filter";
import type AnyWidget from "../types/widget";
import type Dialog from "./dialog";
import type DialogButton from "./dialogbutton";
import type Frame from "./frame";
import Handle, { IDestroyable } from "./handle";
import type MapPlayer from "./player";
import type Timer from "./timer";
import type Trackable from "./trackable";
import type Unit from "./unit";

export default class Trigger extends Handle implements IDestroyable {
    protected static override map: WeakMap<trigger, Trigger>;
    public declare readonly handle: trigger;

    public constructor() {
        if (Trigger.initHandle) {
            super(Trigger.initHandle);
            return;
        }

        const handle = CreateTrigger();
        if (handle !== undefined) {
            super(handle);
            Trigger.map.set(handle, this);
            return;
        }

        error(`Failed to create trigger handle.`, 3);
    }

    // TODO: Check if this works.
    public override isValid(): this is Trigger {
        return GetHandleId(this.handle) !== 0;
    }

    /**
     * @bug Do not destroy the current running Trigger (when waits are involved)
     * as it can cause handle stack corruption as documented [here](http://www.wc3c.net/showthread.php?t=110519).
     */
    public destroy(): void {
        this.enabled = false;
        Trigger.map.delete(this.handle);
        DestroyTrigger(this.handle);
    }

    public get enabled() {
        return IsTriggerEnabled(this.handle);
    }

    public set enabled(b: boolean) {
        b ? EnableTrigger(this.handle) : DisableTrigger(this.handle);
    }

    public get execCount() {
        return GetTriggerExecCount(this.handle);
    }

    /**
     * Marks the given trigger to wait/no longer wait for `TriggerSleepAction`s in sub trigger executions started via `TriggerExecuteWait`.
     * Since this is an attribute of the execution rather than the trigger object, this affects future runs of the given trigger, and not
     * those already started.
     */
    public set waitOnSleeps(b: boolean) {
        TriggerWaitOnSleeps(this.handle, b);
    }

    public addAction(cb: () => void) {
        return TriggerAddAction(this.handle, cb);
    }

    public removeAction(whichAction: triggeraction) {
        TriggerRemoveAction(this.handle, whichAction);
    }

    public clearActions() {
        TriggerClearActions(this.handle);
    }

    public addCondition(filter: AnyFilter) {
        return TriggerAddCondition(this.handle, asCondition(filter));
    }

    public removeCondition(whichCondition: triggercondition) {
        TriggerRemoveCondition(this.handle, whichCondition);
    }

    public clearConditions() {
        TriggerClearConditions(this.handle);
    }

    /**
     * Evaluates all functions that were added to the trigger via `addCondition`.
     * All return-values from all added condition-functions are `and`ed together as the final return-value.
     * Returns the boolean value of the return value from the condition-function.
     * So if 0/0.0/null would be returned in the condition-function, `eval`
     * would return false. Note that `""` would return `true`.
     * @note If a condition-function crashes the thread or does not return any value `eval` will return false.
     * @note If you want to return false for a condition-function that returns string (for whatever reason) return `null` instead of `""`
     * @note *All* functions added via `addCondition` are run. There is no short-circuting. If you want short-circuting use `And` or `Or`.
     * @note All functions added via `addCondition` are run in the order they were added.
     */
    public eval() {
        return TriggerEvaluate(this.handle);
    }

    public exec() {
        return TriggerExecute(this.handle);
    }

    /**
     * Does the same as `exec` but if the caller has been marked with `waitOnSleeps` before its
     * execution, it will additionally wait for `TriggerSleepAction`s of the callee, so this really ensures that
     * the callee has finished. If there was a `TriggerSleepAction`, there will be a short delay before returning.
     */
    public execWait() {
        TriggerExecuteWait(this.handle);
    }

    public reset() {
        ResetTrigger(this.handle);
    }

    //#region Register spam

    public registerAnyUnitEvent(whichPlayerUnitEvent: playerunitevent) {
        return TriggerRegisterAnyUnitEventBJ(this.handle, whichPlayerUnitEvent);
    }

    public registerCommandEvent(whichAbility: number, order: string) {
        return TriggerRegisterCommandEvent(this.handle, whichAbility, order);
    }

    public registerDeathEvent(whichWidget: AnyWidget) {
        TriggerRegisterDeathEvent(this.handle, whichWidget.handle);
    }

    public registerDialogButtonEvent(whichButton: DialogButton) {
        return TriggerRegisterDialogButtonEvent(this.handle, whichButton.handle);
    }

    public registerDialogEvent(whichDialog: Dialog) {
        return TriggerRegisterDialogEvent(this.handle, whichDialog.handle);
    }

    public registerEnterRegion(whichRegion: region, filter?: AnyFilter) {
        return TriggerRegisterEnterRegion(this.handle, whichRegion, filter !== undefined ? asFilter(filter) : filter);
    }

    public registerFilterUnitEvent(whichUnit: Unit, whichEvent: unitevent, filter?: AnyFilter) {
        return TriggerRegisterFilterUnitEvent(
            this.handle,
            whichUnit.handle,
            whichEvent,
            filter !== undefined ? asFilter(filter) : filter
        );
    }

    public registerGameEvent(whichGameEvent: gameevent) {
        return TriggerRegisterGameEvent(this.handle, whichGameEvent);
    }

    public registerGameStateEvent(whichState: gamestate, opcode: limitop, limitval: number) {
        return TriggerRegisterGameStateEvent(this.handle, whichState, opcode, limitval);
    }

    public registerLeaveRegion(whichRegion: region, filter?: AnyFilter) {
        return TriggerRegisterLeaveRegion(this.handle, whichRegion, filter !== undefined ? asFilter(filter) : filter);
    }

    public registerPlayerAllianceChange(whichPlayer: MapPlayer, whichAlliance: alliancetype) {
        return TriggerRegisterPlayerAllianceChange(this.handle, whichPlayer.handle, whichAlliance);
    }

    public registerPlayerChatEvent(whichPlayer: MapPlayer, chatMessageToDetect: string, exactMatchOnly: boolean) {
        return TriggerRegisterPlayerChatEvent(this.handle, whichPlayer.handle, chatMessageToDetect, exactMatchOnly);
    }

    public registerPlayerEvent(whichPlayer: MapPlayer, whichPlayerEvent: playerevent) {
        return TriggerRegisterPlayerEvent(this.handle, whichPlayer.handle, whichPlayerEvent);
    }

    public registerPlayerKeyEvent(
        whichPlayer: MapPlayer,
        whichKey: oskeytype,
        metaKey: number,
        fireOnKeyDown: boolean
    ) {
        return BlzTriggerRegisterPlayerKeyEvent(this.handle, whichPlayer.handle, whichKey, metaKey, fireOnKeyDown);
    }

    public registerPlayerMouseEvent(whichPlayer: MapPlayer, whichMouseEvent: number) {
        return TriggerRegisterPlayerMouseEventBJ(this.handle, whichPlayer.handle, whichMouseEvent);
    }

    public registerPlayerStateEvent(
        whichPlayer: MapPlayer,
        whichState: playerstate,
        opcode: limitop,
        limitval: number
    ) {
        return TriggerRegisterPlayerStateEvent(this.handle, whichPlayer.handle, whichState, opcode, limitval);
    }

    public registerPlayerSyncEvent(whichPlayer: MapPlayer, prefix: string, fromServer: boolean) {
        return BlzTriggerRegisterPlayerSyncEvent(this.handle, whichPlayer.handle, prefix, fromServer);
    }

    public registerPlayerUnitEvent(whichPlayer: MapPlayer, whichPlayerUnitEvent: playerunitevent, filter?: AnyFilter) {
        return TriggerRegisterPlayerUnitEvent(
            this.handle,
            whichPlayer.handle,
            whichPlayerUnitEvent,
            filter !== undefined ? asFilter(filter) : filter
        );
    }

    /**
     * Creates it's own timer and triggers when it expires.
     */
    public registerTimerEvent(timeout: number, periodic: boolean) {
        return TriggerRegisterTimerEvent(this.handle, timeout, periodic);
    }

    /**
     * Triggers when the timer you tell it about expires
     **/
    public registerTimerExpireEvent(whichTimer: Timer) {
        return TriggerRegisterTimerExpireEvent(this.handle, whichTimer.handle);
    }

    public registerTrackableHitEvent(whichTrackable: Trackable) {
        return TriggerRegisterTrackableHitEvent(this.handle, whichTrackable.handle);
    }

    public registerTrackableTrackEvent(whichTrackable: Trackable) {
        return TriggerRegisterTrackableTrackEvent(this.handle, whichTrackable.handle);
    }

    public registerUnitEvent(whichUnit: Unit, whichEvent: unitevent) {
        return TriggerRegisterUnitEvent(this.handle, whichUnit.handle, whichEvent);
    }

    public registerUnitInRange(whichUnit: Unit, range: number, filter?: AnyFilter) {
        return TriggerRegisterUnitInRange(
            this.handle,
            whichUnit.handle,
            range,
            filter !== undefined ? asFilter(filter) : filter
        );
    }

    public registerUnitStateEvent(whichUnit: Unit, whichState: unitstate, opcode: limitop, limitval: number) {
        return TriggerRegisterUnitStateEvent(this.handle, whichUnit.handle, whichState, opcode, limitval);
    }

    public registerUpgradeCommandEvent(whichUpgrade: number) {
        return TriggerRegisterUpgradeCommandEvent(this.handle, whichUpgrade);
    }

    public registerVariableEvent(varName: string, opcode: limitop, limitval: number) {
        return TriggerRegisterVariableEvent(this.handle, varName, opcode, limitval);
    }

    public registerFrameEvent(frame: Frame, eventId: frameeventtype) {
        return BlzTriggerRegisterFrameEvent(this.handle, frame.handle, eventId);
    }

    //#endregion Register spam

    public static get eventId() {
        return GetTriggerEventId();
    }

    public static fromEvent() {
        return this.fromHandle(GetTriggeringTrigger());
    }

    public static fromHandle(handle?: trigger) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: trigger) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Trigger as any)() as Trigger;
        this.initHandle = undefined;

        return o;
    }
}
