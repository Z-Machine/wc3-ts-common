import Handle from "./handle";

export default class Quest extends Handle {
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
