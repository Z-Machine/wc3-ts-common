import Handle from "./handle";

export default class Group extends Handle {
    protected static override map: WeakMap<group, Group>;
    public declare readonly handle: group;

    public constructor() {
        if (Group.initHandle) {
            super(Group.initHandle);
            return;
        }

        const handle = CreateGroup();
        if (handle) {
            super(handle);
            Group.map.set(handle, this);
            return;
        }

        error(`Failed to create group handle.`, 3);
    }

    public override isValid(): this is Group {
        return GetHandleId(this.handle) !== 0;
    }

    public static fromHandle(handle?: group) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: group) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Group as any)() as Group;
        this.initHandle = undefined;

        return o;
    }
}
