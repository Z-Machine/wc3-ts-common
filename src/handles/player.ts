import type Force from "./force";
import Handle from "./handle";

export default class MapPlayer extends Handle {
    protected static override map: WeakMap<player, MapPlayer>;
    public declare readonly handle: player;

    protected constructor(index: number) {
        if (MapPlayer.initHandle) {
            super(MapPlayer.initHandle);
            return;
        }

        if (index === undefined) {
            error(`MapPlayer.Constructor missing required parameters.`, 3);
        }

        const handle = Player(index);
        if (handle) {
            super(handle);
            MapPlayer.map.set(handle, this);
            return;
        }

        error(`Failed to create player handle.`, 3);
    }

    public override get id() {
        return GetPlayerId(this.handle);
    }

    public set color(color: playercolor) {
        SetPlayerColor(this.handle, color);
    }

    public get name() {
        return GetPlayerName(this.handle) ?? "";
    }

    public set name(v: string) {
        SetPlayerName(this.handle, v);
    }

    public inForce(force: Force) {
        return IsPlayerInForce(this.handle, force.handle);
    }

    public static fromEvent() {
        return this.fromHandle(GetTriggerPlayer());
    }

    public static fromFilter() {
        return this.fromHandle(GetFilterPlayer());
    }

    public static fromIndex(index: number) {
        return this.fromHandle(Player(index));
    }

    public static fromHandle(handle?: player) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: player) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (MapPlayer as any)() as MapPlayer;
        this.initHandle = undefined;

        return o;
    }

    /**
     * @async
     */
    public static fromLocal() {
        return this.fromHandle(GetLocalPlayer())!;
    }
}
