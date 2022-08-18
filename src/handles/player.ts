import type Force from "./force";
import Handle from "./handle";

export default class MapPlayer extends Handle {
    protected static override map: WeakMap<handle, MapPlayer>;
    public declare readonly handle: player;

    protected constructor(index?: number) {
        if (MapPlayer.initHandle) {
            super(MapPlayer.initHandle);
            return;
        }

        assert(index !== undefined, `MapPlayer.Constructor missing index.`);

        const handle = Player(index!);
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

    public static fromHandle(handle?: handle) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject<C extends unknown = MapPlayer>(handle: handle): C {
        let o = this.map.get(handle);
        if (o !== undefined) return o as C;

        this.initHandle = handle;
        o = new MapPlayer();
        this.initHandle = undefined;

        return o as C;
    }

    /**
     * @async
     */
    public static fromLocal() {
        return this.fromHandle(GetLocalPlayer())!;
    }
}
