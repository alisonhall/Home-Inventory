/* Utility and helper functions */

export type ItemType = {
    id?: string | null | undefined,
    name?: string,
    notes?: string,
    expiryDate?: any,
    images?: string[],
    files?: string[],
    containing?: string[],
    containedWithin?: string
}
