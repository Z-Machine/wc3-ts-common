import Ability from "./ability";
import { IDestroyable } from "./handle";
import type MapPlayer from "./player";
import Widget from "./widget";

export default class Unit extends Widget implements IDestroyable {
    protected static override map: WeakMap<unit, Unit>;
    public declare readonly handle: unit;

    public constructor(owner: MapPlayer, unitId: number, x: number, y: number, face?: number, skinId?: number) {
        if (Unit.initHandle) {
            super(Unit.initHandle);
            return;
        }

        if (owner === undefined || unitId === undefined || x === undefined || y === undefined) {
            error(`Unit.Constructor missing required parameters.`, 3);
        }

        if (face === undefined) {
            face = bj_UNIT_FACING;
        }

        const handle = skinId
            ? BlzCreateUnitWithSkin(owner.handle, unitId, x, y, face, skinId)
            : CreateUnit(owner?.handle, unitId, x, y, face);
        if (handle) {
            super(handle);
            Unit.map.set(handle, this);
            return;
        }

        error(`Failed to create unit handle.`, 3);
    }

    public override isValid(): this is Unit {
        return GetUnitTypeId(this.handle) !== 0;
    }

    public destroy(): void {
        Unit.map.delete(this.handle);
        RemoveUnit(this.handle);
    }

    public get typeId() {
        return GetUnitTypeId(this.handle);
    }

    public get name() {
        return GetUnitName(this.handle) ?? "";
    }

    public set name(v: string) {
        BlzSetUnitName(this.handle, v);
    }

    /**
     * Sets a unit's acquire range.  This is the value that a unit uses to choose targets to
     * engage with.  Note that this is not the attack range.  When acquisition range is
     * greater than attack range, the unit will attempt to move towards acquired targets, and then attack.
     * Setting acquisition range lower than attack range in the object editor limits the
     * unit's attack range to the acquisition range, but changing a unit's acquisition range
     * with this native does not change its attack range, nor the value displayed in the UI.
     *
     * @note It is a myth that reducing acquire range with this native can limit a unit's attack range.
     */
    public get acquireRange() {
        return GetUnitAcquireRange(this.handle);
    }

    public set acquireRange(value: number) {
        SetUnitAcquireRange(this.handle, value);
    }

    public get armor() {
        return BlzGetUnitArmor(this.handle);
    }

    public set armor(v: number) {
        BlzSetUnitArmor(this.handle, v);
    }

    public get canSleep() {
        return UnitCanSleep(this.handle);
    }

    public set canSleep(b: boolean) {
        UnitAddSleep(this.handle, b);
    }

    /**
     * Renders a unit invulnerable/lifts that specific invulnerability.
     *
     * @note The native seems to employ the `'Avul'` ability, which is defined in the default AbilityData.slk.
     * If there is no `'Avul'` defined, this will crash the game.
     */
    public set invulnerable(b: boolean) {
        SetUnitInvulnerable(this.handle, b);
    }

    public get invulnerable() {
        return BlzIsUnitInvulnerable(this.handle);
    }

    public get level() {
        return GetUnitLevel(this.handle);
    }

    public set level(v: number) {
        this.setInteger(UNIT_IF_LEVEL, v);
    }

    /**
     * TODO: check if there is a UNIT_RF_COLLISION_SIZE `ucol`
     */
    public get collisionSize() {
        return BlzGetUnitCollisionSize(this.handle);
    }

    //#region Hero
    public isHero() {
        return IsHeroUnitId(this.id);
    }

    public get heroXP() {
        return GetHeroXP(this.handle);
    }

    public set heroXP(v: number) {
        SetHeroXP(this.handle, v, true);
    }

    public setHeroXP(value: number, showEyeCandy: boolean) {
        SetHeroXP(this.handle, value, showEyeCandy);
    }

    public get heroLevel() {
        return GetHeroLevel(this.handle);
    }

    public set heroLevel(v: number) {
        SetHeroLevel(this.handle, v, true);
    }

    public stripHeroLevels(howManyLevels: number) {
        return UnitStripHeroLevel(this.handle, howManyLevels);
    }

    public setHeroLevel(level: number, showEyeCandy: boolean) {
        SetHeroLevel(this.handle, level, showEyeCandy);
    }

    public get strength() {
        return GetHeroStr(this.handle, false);
    }

    public set strength(v: number) {
        SetHeroStr(this.handle, v, true);
    }

    public getStrength(includeBonus: boolean) {
        return GetHeroStr(this.handle, includeBonus);
    }

    public setStrength(value: number, permanent: boolean = true) {
        return SetHeroStr(this.handle, value, permanent);
    }

    public get agility() {
        return GetHeroAgi(this.handle, false);
    }

    public set agility(v: number) {
        SetHeroAgi(this.handle, v, true);
    }

    public getAgility(includeBonus: boolean) {
        return GetHeroAgi(this.handle, includeBonus);
    }

    public setAgility(value: number, permanent: boolean = true) {
        return SetHeroAgi(this.handle, value, permanent);
    }

    public get intelligence() {
        return GetHeroInt(this.handle, false);
    }

    public set intelligence(v: number) {
        SetHeroInt(this.handle, v, true);
    }

    public getIntelligence(includeBonus: boolean) {
        return GetHeroInt(this.handle, includeBonus);
    }

    public setIntelligence(value: number, permanent: boolean = true) {
        return SetHeroInt(this.handle, value, permanent);
    }

    public get properName() {
        return GetHeroProperName(this.handle) ?? "";
    }

    public set properName(v: string) {
        BlzSetHeroProperName(this.handle, v);
    }

    public get skillPoints() {
        return GetHeroSkillPoints(this.handle);
    }

    public modifySkillPoints(skillPointDelta: number) {
        return UnitModifySkillPoints(this.handle, skillPointDelta);
    }
    //#endregion Hero
    //#region Ability

    public addAbility(abilCode: number) {
        return UnitAddAbility(this.handle, abilCode);
    }

    public hasAbility(abilCode: number) {
        return GetUnitAbilityLevel(this.handle, abilCode) > 0;
    }

    public getAbility(abilCode: number) {
        return Ability.fromUnit(this, abilCode);
    }

    public getAbilityIndex(index: number) {
        return Ability.fromUnitIndex(this, index);
    }

    public hideAbility(abilCode: number, flag: boolean) {
        BlzUnitHideAbility(this.handle, abilCode, flag);
    }

    public removeAbility(abilCode: number) {
        return UnitRemoveAbility(this.handle, abilCode);
    }

    /**
     * Decreases the level of a unit's ability by 1. The level will not go below 1.
     * @param abilCode The four digit rawcode representation of the ability.
     * @returns The new ability level.
     */
    public decAbilityLevel(abilCode: number) {
        return DecUnitAbilityLevel(this.handle, abilCode);
    }

    /**
     * Increases the level of a unit's ability by 1.
     * @param abilCode The four digit rawcode representation of the ability.
     * @returns The new ability level.
     *
     * @note `incAbilityLevel` can increase an abilities level to maxlevel+1. On maxlevel+1 all ability fields are 0.
     *
     * http://www.wc3c.net/showthread.php?p=1029039#post1029039
     * http://www.hiveworkshop.com/forums/lab-715/silenceex-everything-you-dont-know-about-silence-274351/.
     */
    public incAbilityLevel(abilCode: number) {
        return IncUnitAbilityLevel(this.handle, abilCode);
    }

    public disableAbility(abilCode: number, flag: boolean, hideUI: boolean) {
        BlzUnitDisableAbility(this.handle, abilCode, flag, hideUI);
    }

    public endAbilityCooldown(abilCode: number) {
        BlzEndUnitAbilityCooldown(this.handle, abilCode);
    }

    public getAbilityCooldown(abilCode: number, level: number) {
        return BlzGetUnitAbilityCooldown(this.handle, abilCode, level);
    }

    public getAbilityCooldownRemaining(abilCode: number) {
        return BlzGetUnitAbilityCooldownRemaining(this.handle, abilCode);
    }

    public setAbilityCooldown(abilId: number, level: number, cooldown: number) {
        BlzSetUnitAbilityCooldown(this.handle, abilId, level, cooldown);
    }

    /**
     * Returns the level of the ability for the unit.
     * @note This function is **not** zero indexed.
     */
    public getAbilityLevel(abilCode: number) {
        return GetUnitAbilityLevel(this.handle, abilCode);
    }

    public setAbilityLevel(abilCode: number, level: number) {
        return SetUnitAbilityLevel(this.handle, abilCode, level);
    }

    public getAbilityManaCost(abilId: number, level: number) {
        return BlzGetUnitAbilityManaCost(this.handle, abilId, level);
    }

    public setAbilityManaCost(abilId: number, level: number, manaCost: number) {
        BlzSetUnitAbilityManaCost(this.handle, abilId, level, manaCost);
    }

    public hasBuffs(
        removePositive: boolean,
        removeNegative: boolean,
        magic: boolean,
        physical: boolean,
        timedLife: boolean,
        aura: boolean,
        autoDispel: boolean
    ) {
        return UnitHasBuffsEx(
            this.handle,
            removePositive,
            removeNegative,
            magic,
            physical,
            timedLife,
            aura,
            autoDispel
        );
    }

    public removeBuffs(removePositive: boolean, removeNegative: boolean) {
        UnitRemoveBuffs(this.handle, removePositive, removeNegative);
    }

    public removeBuffsEx(
        removePositive: boolean,
        removeNegative: boolean,
        magic: boolean,
        physical: boolean,
        timedLife: boolean,
        aura: boolean,
        autoDispel: boolean
    ) {
        UnitRemoveBuffsEx(this.handle, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel);
    }

    /**
     * Makes the given ability persist through morphing.
     */
    public makeAbilityPermanent(abilCode: number, permanent: boolean) {
        return UnitMakeAbilityPermanent(this.handle, permanent, abilCode);
    }

    //#endregion Ability spam
    //#region Field spam

    public getBoolean(whichField: unitbooleanfield) {
        return BlzGetUnitBooleanField(this.handle, whichField);
    }

    public getInteger(whichField: unitintegerfield) {
        return BlzGetUnitIntegerField(this.handle, whichField);
    }

    public getNumber(whichField: unitrealfield) {
        return BlzGetUnitRealField(this.handle, whichField);
    }

    public getString(whichField: unitstringfield) {
        return BlzGetUnitStringField(this.handle, whichField) ?? "";
    }

    public setBoolean(whichField: unitbooleanfield, value: boolean) {
        BlzSetUnitBooleanField(this.handle, whichField, value);
    }

    public setInteger(whichField: unitintegerfield, value: number) {
        BlzSetUnitIntegerField(this.handle, whichField, value);
    }

    public setNumber(whichField: unitrealfield, value: number) {
        BlzSetUnitRealField(this.handle, whichField, value);
    }

    public setString(whichField: unitstringfield, value: string) {
        BlzSetUnitStringField(this.handle, whichField, value);
    }

    //#endregion Field spam

    public static fromEvent() {
        return this.fromHandle(GetTriggerUnit());
    }

    public static fromFilter() {
        return this.fromHandle(GetFilterUnit());
    }

    public static fromHandle(handle?: unit) {
        return handle ? this.getObject(handle) : undefined;
    }

    protected static override getObject(handle: unit) {
        let o = this.map.get(handle);
        if (o !== undefined) return o;

        this.initHandle = handle;
        o = new (Unit as any)() as Unit;
        this.initHandle = undefined;

        return o;
    }
}
