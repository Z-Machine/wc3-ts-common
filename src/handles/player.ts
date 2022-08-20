import type Force from "./force";
import Handle from "./handle";
import type Point from "./point";

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

    public get controller() {
        return GetPlayerController(this.handle);
    }

    public set controller(v: mapcontrol) {
        SetPlayerController(this.handle, v);
    }

    public get handicap() {
        return GetPlayerHandicap(this.handle);
    }

    public set handicap(handicap: number) {
        SetPlayerHandicap(this.handle, handicap);
    }

    public get handicapXp() {
        return GetPlayerHandicapXP(this.handle);
    }

    public set handicapXp(handicap: number) {
        SetPlayerHandicapXP(this.handle, handicap);
    }

    public get race() {
        return GetPlayerRace(this.handle);
    }

    public get slotState() {
        return GetPlayerSlotState(this.handle);
    }

    public get startLocation() {
        return GetPlayerStartLocation(this.handle);
    }

    public set startLocation(v: number) {
        SetPlayerStartLocation(this.handle, v);
    }

    public get startLocationX() {
        return GetStartLocationX(this.startLocation);
    }

    public get startLocationY() {
        return GetStartLocationY(this.startLocation);
    }

    public get startLocationPoint() {
        return GetStartLocationLoc(this.startLocation);
    }

    public get team() {
        return GetPlayerTeam(this.handle);
    }

    public set team(v: number) {
        SetPlayerTeam(this.handle, v);
    }

    public get townHallCount() {
        return BlzGetPlayerTownHallCount(this.handle);
    }

    /**
     * In upgrades that have multiple levels, it will research the upgrade by the number of levels specified.
     * @param techId The four digit rawcode ID of the upgrade.
     * @param levels The number of levels to add to the current research level of the upgrade.
     */
    public addTechResearched(techId: number, levels: number) {
        AddPlayerTechResearched(this.handle, techId, levels);
    }

    public decTechResearched(techId: number, levels: number) {
        BlzDecPlayerTechResearched(this.handle, techId, levels);
    }

    /**
     * Used to store hero level data for the scorescreen, before units are moved to neutral passive in melee games.
     */
    public cacheHeroData() {
        CachePlayerHeroData(this.handle);
    }

    public getAlliance(whichPlayer: MapPlayer, whichAllianceSetting: alliancetype) {
        return GetPlayerAlliance(this.handle, whichPlayer.handle, whichAllianceSetting);
    }

    public setAlliance(otherPlayer: MapPlayer, whichAllianceSetting: alliancetype, value: boolean) {
        SetPlayerAlliance(this.handle, otherPlayer.handle, whichAllianceSetting, value);
    }

    public coordsFogged(x: number, y: number) {
        return IsFoggedToPlayer(x, y, this.handle);
    }

    public coordsMasked(x: number, y: number) {
        return IsMaskedToPlayer(x, y, this.handle);
    }

    public coordsVisible(x: number, y: number) {
        return IsVisibleToPlayer(x, y, this.handle);
    }

    public pointFogged(whichPoint: Point) {
        return IsLocationFoggedToPlayer(whichPoint.handle, this.handle);
    }

    public pointMasked(whichPoint: Point) {
        return IsLocationMaskedToPlayer(whichPoint.handle, this.handle);
    }

    public pointVisible(whichPoint: Point) {
        return IsLocationVisibleToPlayer(whichPoint.handle, this.handle);
    }

    /**
     * Reveals a player's remaining buildings to a force.
     * The black mask over the buildings will be removed as if the territory had been discovered
     * @param whichForce The players who will see whichPlayer's buildings.
     * @param flag If true, the buildings will be revealed. If false, the buildings will not be revealed.
     * Note that if you set it to false, it will not hide the buildings with a black mask.
     * @note this function will not check whether the player has a town hall before revealing.
     */
    public cripple(whichForce: Force, flag: boolean) {
        CripplePlayer(this.handle, whichForce.handle, flag);
    }

    public getScore(whichPlayerScore: playerscore) {
        return GetPlayerScore(this.handle, whichPlayerScore);
    }

    public getState(whichPlayerState: playerstate) {
        return GetPlayerState(this.handle, whichPlayerState);
    }

    public setState(whichPlayerState: playerstate, value: number) {
        SetPlayerState(this.handle, whichPlayerState, value);
    }

    public getStructureCount(includeIncomplete: boolean) {
        return GetPlayerStructureCount(this.handle, includeIncomplete);
    }

    public getTaxRate(otherPlayer: player, whichResource: playerstate) {
        return GetPlayerTaxRate(this.handle, otherPlayer, whichResource);
    }

    public setTaxRate(otherPlayer: player, whichResource: playerstate, rate: number) {
        return SetPlayerTaxRate(this.handle, otherPlayer, whichResource, rate);
    }

    public getTechCount(techId: number, specificonly: boolean) {
        return GetPlayerTechCount(this.handle, techId, specificonly);
    }

    public getTechMaxAllowed(techId: number) {
        return GetPlayerTechMaxAllowed(this.handle, techId);
    }

    public setTechMaxAllowed(techId: number, maximum: number) {
        SetPlayerTechMaxAllowed(this.handle, techId, maximum);
    }

    public getTechResearched(techId: number, specificonly: boolean) {
        return GetPlayerTechResearched(this.handle, techId, specificonly);
    }

    public setTechResearched(techId: number, setToLevel: number) {
        SetPlayerTechResearched(this.handle, techId, setToLevel);
    }

    public setOnScoreScreen(flag: boolean) {
        SetPlayerOnScoreScreen(this.handle, flag);
    }

    public getUnitCount(includeIncomplete: boolean) {
        return GetPlayerUnitCount(this.handle, includeIncomplete);
    }

    public getUnitCountByType(unitName: string, includeIncomplete: boolean, includeUpgrades: boolean) {
        return GetPlayerTypedUnitCount(this.handle, unitName, includeIncomplete, includeUpgrades);
    }

    public setUnitsOwner(whichPlayer: MapPlayer) {
        SetPlayerUnitsOwner(this.handle, whichPlayer.id);
    }

    public inForce(whichForce: Force) {
        return IsPlayerInForce(this.handle, whichForce.handle);
    }

    public isLocal() {
        return GetLocalPlayer() === this.handle;
    }

    public isObserver() {
        return IsPlayerObserver(this.handle);
    }

    public isPlayerAlly(otherPlayer: MapPlayer) {
        return IsPlayerAlly(this.handle, otherPlayer.handle);
    }

    public isPlayerEnemy(otherPlayer: MapPlayer) {
        return IsPlayerEnemy(this.handle, otherPlayer.handle);
    }

    public isRacePrefSet(pref: racepreference) {
        return IsPlayerRacePrefSet(this.handle, pref);
    }

    public isSelectable() {
        return GetPlayerSelectable(this.handle);
    }

    public remove(gameResult: playergameresult) {
        RemovePlayer(this.handle, gameResult);
    }

    public removeAllGuardPositions() {
        RemoveAllGuardPositions(this.handle);
    }

    public setAbilityAvailable(abilId: number, avail: boolean) {
        SetPlayerAbilityAvailable(this.handle, abilId, avail);
    }

    public static fromEnum() {
        return this.fromHandle(GetEnumPlayer());
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
