interface ItemType {
    id?: string | null | undefined,
    name?: string,
    notes?: string,
    expiryDate?: any,
    images?: string[],
    files?: string[],
    containing?: string[],
    containedWithin?: string
}

interface LocationType {
    containing?: string[],
    id?: string | null | undefined,
    images?: string[],
    name?: string,
    notes?: string
}
