export type AnyFilter = boolexpr | (() => boolean);

export const asFilter = (filter: AnyFilter) => (typeof filter === "function" ? Filter(filter) : filter);
export const asCondition = (filter: AnyFilter) => (typeof filter === "function" ? Condition(filter) : filter);
