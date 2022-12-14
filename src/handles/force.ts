import { AnyFilter, asFilter } from "../types/filter";
import Handle, { IDestroyable } from "./handle";
import MapPlayer from "./player";

export default class Force extends Handle implements IDestroyable {
    protected static override map: WeakMap<force, Force>;
    public declare readonly handle: force;

    public constructor() {
        if (Force.initHandle) {
            super(Force.initHandle);
            return;
        }

        const handle = CreateForce();
        if (handle) {
            super(handle);
            Force.map.set(handle, this);
            return;
        }

        error(`Failed to create force handle.`, 3);
    }

    public addPlayer(whichPlayer: MapPlayer) {
        ForceAddPlayer(this.handle, whichPlayer.handle);
    }

    public clear() {
        ForceClear(this.handle);
    }

    public destroy(): void {
        Force.map.delete(this.handle);
        DestroyForce(this.handle);
    }

    public enumAllies(whichPlayer: MapPlayer, filter: AnyFilter) {
        ForceEnumAllies(this.handle, whichPlayer.handle, asFilter(filter));
    }

    public enumEnemies(whichPlayer: MapPlayer, filter: AnyFilter) {
        ForceEnumEnemies(this.handle, whichPlayer.handle, asFilter(filter));
    }

    public enumPlayers(filter: AnyFilter) {
        ForceEnumPlayers(this.handle, asFilter(filter));
    }

    public enumPlayersCounted(filter: AnyFilter, countLimit: number) {
        ForceEnumPlayersCounted(this.handle, asFilter(filter), countLimit);
    }

    public for(callback: () => void) {
        ForForce(this.handle, callback);
    }

    /**
     * Returns all player handles belonging to this force
     */
    public getPlayers() {
        const players: MapPlayer[] = [];

        ForForce(this.handle, () => {
            const pl = MapPlayer.fromHandle(GetEnumPlayer());
            if (pl?.isValid()) {
                players.push(pl);
            }
        });

        return players;
    }

    public hasPlayer(whichPlayer: MapPlayer) {
        return IsPlayerInForce(whichPlayer.handle, this.handle);
    }

    public removePlayer(whichPlayer: MapPlayer) {
        ForceRemovePlayer(this.handle, whichPlayer.handle);
    }

    public static override fromHandle(handle?: force) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: force): Force {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Force as any)() as Force;
        this.initHandle = undefined;

        return o;
    }

    public static fromPlayer(whichPlayer: MapPlayer) {
        return this.fromHandle(GetForceOfPlayer(whichPlayer.handle));
    }
}
