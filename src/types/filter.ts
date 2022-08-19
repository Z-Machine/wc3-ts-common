// TODO: move these to a filter file?
export type AnyFilter = boolexpr | (() => boolean);
export const asFilter = (filter: AnyFilter) => (typeof filter === "function" ? Filter(filter) : filter);
