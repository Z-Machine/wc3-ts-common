import Handle from "./handle";

export default class GameCache extends Handle {
    protected static override map: WeakMap<gamecache, GameCache>;
    public declare readonly handle: gamecache;

    public constructor(campaignFile: string) {
        if (GameCache.initHandle) {
            super(GameCache.initHandle);
            return;
        }

        if (campaignFile === undefined) {
            error(`GameCache.Constructor missing required parameters.`, 3);
        }

        const handle = InitGameCache(campaignFile);
        if (handle) {
            super(handle);
            GameCache.map.set(handle, this);
            return;
        }

        error(`Failed to create gamecache handle.`, 3);
    }

    public override isValid(): this is GameCache {
        return GetHandleId(this.handle) !== 0;
    }

    public static fromHandle(handle?: gamecache) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: gamecache) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (GameCache as any)() as GameCache;
        this.initHandle = undefined;

        return o;
    }
}
