import Handle from "./handle";
import type MapPlayer from "./player";
import Unit from "./unit";

export default class GameCache extends Handle {
    protected static override map: WeakMap<gamecache, GameCache>;
    public declare readonly handle: gamecache;

    public constructor(public readonly campaignFile: string) {
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

    public save() {
        return SaveGameCache(this.handle);
    }

    public flush() {
        FlushGameCache(this.handle);
    }

    public flushBoolean(missionKey: string, key: string) {
        FlushStoredBoolean(this.handle, missionKey, key);
    }

    public flushInteger(missionKey: string, key: string) {
        FlushStoredInteger(this.handle, missionKey, key);
    }

    public flushMission(missionKey: string) {
        FlushStoredMission(this.handle, missionKey);
    }

    public flushNumber(missionKey: string, key: string) {
        FlushStoredInteger(this.handle, missionKey, key);
    }

    public flushString(missionKey: string, key: string) {
        FlushStoredString(this.handle, missionKey, key);
    }

    public flushUnit(missionKey: string, key: string) {
        FlushStoredUnit(this.handle, missionKey, key);
    }

    /**
     * Returns false if the specified value's data is not found in the cache.
     */
    public getBoolean(missionKey: string, key: string) {
        return GetStoredBoolean(this.handle, missionKey, key);
    }

    /**
     * Returns 0 if the specified value's data is not found in the cache.
     */
    public getInteger(missionKey: string, key: string) {
        return GetStoredInteger(this.handle, missionKey, key);
    }

    /**
     * Returns 0 if the specified value's data is not found in the cache.
     */
    public getNumber(missionKey: string, key: string) {
        return GetStoredReal(this.handle, missionKey, key);
    }

    /**
     * Returns "" if the specified value's data is not found in the cache.
     */
    public getString(missionKey: string, key: string) {
        return GetStoredString(this.handle, missionKey, key) ?? "";
    }

    public hasBoolean(missionKey: string, key: string) {
        return HaveStoredBoolean(this.handle, missionKey, key);
    }

    public hasInteger(missionKey: string, key: string) {
        return HaveStoredInteger(this.handle, missionKey, key);
    }

    public hasNumber(missionKey: string, key: string) {
        return HaveStoredReal(this.handle, missionKey, key);
    }

    public hasString(missionKey: string, key: string) {
        return HaveStoredString(this.handle, missionKey, key);
    }

    public restoreUnit(missionKey: string, key: string, forWhichPlayer: MapPlayer, x: number, y: number, face: number) {
        return Unit.fromHandle(RestoreUnit(this.handle, missionKey, key, forWhichPlayer.handle, x, y, face));
    }

    public setNumber(missionKey: string, key: string, value: number) {
        return StoreReal(this.handle, missionKey, key, value);
    }

    public setInteger(missionKey: string, key: string, value: number) {
        return StoreInteger(this.handle, missionKey, key, value);
    }

    public setBoolean(missionKey: string, key: string, value: boolean) {
        return StoreBoolean(this.handle, missionKey, key, value);
    }

    public setString(missionKey: string, key: string, value: string) {
        return StoreString(this.handle, missionKey, key, value);
    }

    public syncNumber(missionKey: string, key: string) {
        SyncStoredReal(this.handle, missionKey, key);
    }

    public syncInteger(missionKey: string, key: string) {
        SyncStoredInteger(this.handle, missionKey, key);
    }

    public syncBoolean(missionKey: string, key: string) {
        SyncStoredBoolean(this.handle, missionKey, key);
    }

    public syncString(missionKey: string, key: string) {
        SyncStoredString(this.handle, missionKey, key);
    }

    public static reloadFromDisk() {
        return ReloadGameCachesFromDisk();
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
