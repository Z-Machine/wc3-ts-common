import { AnyFilter, asFilter } from "../types/filter";
import AnyWidget from "../types/widget";
import Handle, { IDestroyable } from "./handle";
import type MapPlayer from "./player";
import type Point from "./point";
import type Rectangle from "./rect";
import Unit from "./unit";

export default class Group extends Handle implements IDestroyable {
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
        return GetHandleId(this.handle) !== -1;
    }

    public destroy() {
        Group.map.delete(this.handle);
        DestroyGroup(this.handle);
    }

    public addGroupFast(whichGroup: Group): number {
        return BlzGroupAddGroupFast(this.handle, whichGroup.handle);
    }

    public addUnit(whichUnit: Unit) {
        return GroupAddUnit(this.handle, whichUnit.handle);
    }

    public clear() {
        GroupClear(this.handle);
    }

    public enumUnitsInRange(x: number, y: number, radius: number, filter?: AnyFilter) {
        GroupEnumUnitsInRange(this.handle, x, y, radius, filter !== undefined ? asFilter(filter) : filter);
    }

    /**
     * @bug Causes irregular behavior when used with large numbers
     */
    public enumUnitsInRangeCounted(x: number, y: number, radius: number, countLimit: number, filter?: AnyFilter) {
        GroupEnumUnitsInRangeCounted(
            this.handle,
            x,
            y,
            radius,
            filter !== undefined ? asFilter(filter) : filter,
            countLimit
        );
    }

    public enumUnitsInRangeOfPoint(whichPoint: Point, radius: number, filter?: AnyFilter) {
        GroupEnumUnitsInRangeOfLoc(
            this.handle,
            whichPoint.handle,
            radius,
            filter !== undefined ? asFilter(filter) : filter
        );
    }

    /**
     * @bug Causes irregular behavior when used with large numbers
     */
    public enumUnitsInRangeOfPointCounted(whichPoint: Point, radius: number, countLimit: number, filter?: AnyFilter) {
        GroupEnumUnitsInRangeOfLocCounted(
            this.handle,
            whichPoint.handle,
            radius,
            filter !== undefined ? asFilter(filter) : filter,
            countLimit
        );
    }

    public enumUnitsInRect(r: Rectangle, filter: AnyFilter) {
        GroupEnumUnitsInRect(this.handle, r.handle, filter !== undefined ? asFilter(filter) : filter);
    }

    /**
     * @bug Causes irregular behavior when used with large numbers
     */
    public enumUnitsInRectCounted(r: Rectangle, countLimit: number, filter?: AnyFilter) {
        GroupEnumUnitsInRectCounted(
            this.handle,
            r.handle,
            filter !== undefined ? asFilter(filter) : filter,
            countLimit
        );
    }

    /**
     * @note In contrast to other Enum-functions this function enumarates units with locust.
     */
    public enumUnitsOfPlayer(whichPlayer: MapPlayer, filter?: AnyFilter) {
        GroupEnumUnitsOfPlayer(this.handle, whichPlayer.handle, filter !== undefined ? asFilter(filter) : filter);
    }

    public enumUnitsOfType(unitName: string, filter?: AnyFilter) {
        GroupEnumUnitsOfType(this.handle, unitName, filter !== undefined ? asFilter(filter) : filter);
    }

    /**
     * @bug Causes irregular behavior when used with large numbers
     */
    public enumUnitsOfTypeCounted(unitName: string, countLimit: number, filter?: AnyFilter) {
        GroupEnumUnitsOfTypeCounted(
            this.handle,
            unitName,
            filter !== undefined ? asFilter(filter) : filter,
            countLimit
        );
    }

    public enumUnitsSelected(whichPlayer: MapPlayer, filter?: AnyFilter) {
        GroupEnumUnitsSelected(this.handle, whichPlayer.handle, filter !== undefined ? asFilter(filter) : filter);
    }

    public for(callback: () => void) {
        ForGroup(this.handle, callback);
    }

    /**
     * @bug May return `null` even if there are still units in the group.
     * This happens when a unit in the group dies and decays since the group still
     * holds a reference to that unit but that unit is pretty much null.
     * See [http://wc3c.net/showthread.php?t=104464](https://web.archive.org/web/20160305193019/http://www.wc3c.net/showthread.php?t=104464).
     */
    public get first() {
        return Unit.fromHandle(FirstOfGroup(this.handle));
    }

    public get size() {
        return BlzGroupGetSize(this.handle);
    }

    public getUnits(): Unit[] {
        const units: Unit[] = [];
        this.for(() => {
            const u = Unit.fromFilter();
            if (u?.isValid()) {
                units.push(u);
            }
        });
        return units;
    }

    public getUnitAt(index: number) {
        return Unit.fromHandle(BlzGroupUnitAt(this.handle, index));
    }

    public hasUnit(whichUnit: Unit) {
        return IsUnitInGroup(whichUnit.handle, this.handle);
    }

    public orderCoords(order: string | number, x: number, y: number) {
        if (typeof order === "string") {
            GroupPointOrder(this.handle, order, x, y);
        } else {
            GroupPointOrderById(this.handle, order, x, y);
        }
    }

    public orderImmediate(order: string | number) {
        if (typeof order === "string") {
            GroupImmediateOrder(this.handle, order);
        } else {
            GroupImmediateOrderById(this.handle, order);
        }
    }

    public orderPoint(order: string | number, whichPoint: Point) {
        if (typeof order === "string") {
            GroupPointOrderLoc(this.handle, order, whichPoint.handle);
        } else {
            GroupPointOrderByIdLoc(this.handle, order, whichPoint.handle);
        }
    }

    public orderTarget(order: string | number, targetWidget: AnyWidget) {
        if (typeof order === "string") {
            GroupTargetOrder(this.handle, order, targetWidget.handle);
        } else {
            GroupTargetOrderById(this.handle, order, targetWidget.handle);
        }
    }

    public removeGroupFast(whichGroup: Group): number {
        return BlzGroupRemoveGroupFast(this.handle, whichGroup.handle);
    }

    public removeUnit(whichUnit: Unit): boolean {
        return GroupRemoveUnit(this.handle, whichUnit.handle);
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
