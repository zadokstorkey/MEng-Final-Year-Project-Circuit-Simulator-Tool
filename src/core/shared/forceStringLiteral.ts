/**
 * Typescript type can be a specifc string literal but not the general string type
 */
export type ForcedStringLiteral<TStringLiteral> = string extends TStringLiteral ? never : string;