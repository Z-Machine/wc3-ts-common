import Handle from "./handle";
import type Quest from "./quest";

export default class QuestItem extends Handle {
    protected static override map: WeakMap<questitem, QuestItem>;
    public declare readonly handle: questitem;

    public constructor(whichQuest: Quest) {
        if (QuestItem.initHandle) {
            super(QuestItem.initHandle);
            return;
        }

        if (whichQuest === undefined) {
            error(`QuestItem.Constructor missing required parameters.`, 3);
        }

        const handle = QuestCreateItem(whichQuest.handle);
        if (handle) {
            super(handle);
            QuestItem.map.set(handle, this);
            return;
        }

        error(`Failed to create questitem handle.`, 3);
    }

    public override isValid(): this is QuestItem {
        return GetHandleId(this.handle) !== 0;
    }

    public static fromHandle(handle?: questitem) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: questitem) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (QuestItem as any)() as QuestItem;
        this.initHandle = undefined;

        return o;
    }
}
