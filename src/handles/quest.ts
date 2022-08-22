import Handle, { IDestroyable } from "./handle";
import QuestItem from "./questitem";

export default class Quest extends Handle implements IDestroyable {
    protected static override map: WeakMap<quest, Quest>;
    public declare readonly handle: quest;

    public constructor() {
        if (Quest.initHandle) {
            super(Quest.initHandle);
            return;
        }

        const handle = CreateQuest();
        if (handle) {
            super(handle);
            Quest.map.set(handle, this);
            return;
        }

        error(`Failed to create quest handle.`, 3);
    }

    public override isValid(): this is Quest {
        return GetHandleId(this.handle) !== 0;
    }

    public destroy(): void {
        Quest.map.delete(this.handle);
        DestroyQuest(this.handle);
    }

    public get completed() {
        return IsQuestCompleted(this.handle);
    }

    public set completed(b: boolean) {
        QuestSetCompleted(this.handle, b);
    }

    public get discovered() {
        return IsQuestDiscovered(this.handle);
    }

    public set discovered(b: boolean) {
        QuestSetDiscovered(this.handle, b);
    }

    public get enabled() {
        return IsQuestEnabled(this.handle);
    }

    public set enabled(b: boolean) {
        QuestSetEnabled(this.handle, b);
    }

    public get failed() {
        return IsQuestFailed(this.handle);
    }

    public set failed(b: boolean) {
        QuestSetFailed(this.handle, b);
    }

    public get required() {
        return IsQuestRequired(this.handle);
    }

    public set required(b: boolean) {
        QuestSetRequired(this.handle, b);
    }

    public addItem(description: string) {
        const questItem = new QuestItem(this);

        questItem?.setDescription(description);

        return questItem;
    }

    public setDescription(value: string) {
        QuestSetDescription(this.handle, value);
    }

    public setIcon(value: string) {
        QuestSetIconPath(this.handle, value);
    }

    public setTitle(value: string) {
        QuestSetTitle(this.handle, value);
    }

    public static flashQuestDialogButton() {
        FlashQuestDialogButton();
    }

    public static forceQuestDialogUpdate() {
        ForceQuestDialogUpdate();
    }

    public static fromHandle(handle?: quest) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: quest) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Quest as any)() as Quest;
        this.initHandle = undefined;

        return o;
    }
}
