import Handle from "./handle";

export default class Frame extends Handle {
    protected static override map: WeakMap<framehandle, Frame>;
    public declare readonly handle: framehandle;

    public constructor(name: string, owner: Frame, priority: number, createContext: number) {
        if (Frame.initHandle) {
            super(Frame.initHandle);
            return;
        }

        if (name === undefined || owner === undefined || priority === undefined || createContext === undefined) {
            error(`Frame.Constructor missing required parameters.`, 3);
        }

        const handle = BlzCreateFrame(name, owner.handle, priority, createContext);
        if (handle) {
            super(handle);
            Frame.map.set(handle, this);
            return;
        }

        error(`Failed to create frame handle.`, 3);
    }

    public override isValid(): this is Frame {
        return GetHandleId(this.handle) !== 0;
    }

    public static fromEvent() {
        return this.fromHandle(BlzGetTriggerFrame());
    }

    public static fromSimple(name: string, owner: Frame, createContext: number) {
        return this.fromHandle(BlzCreateSimpleFrame(name, owner.handle, createContext));
    }

    public static fromType(typeName: string, name: string, owner: Frame, inherits: string, createContext: number) {
        return this.fromHandle(BlzCreateFrameByType(typeName, name, owner.handle, inherits, createContext));
    }

    public static fromHandle(handle?: framehandle) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: framehandle) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Frame as any)() as Frame;
        this.initHandle = undefined;

        return o;
    }
}
