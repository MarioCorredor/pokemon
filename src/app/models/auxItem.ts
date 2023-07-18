export interface AItem {
    count: number,
    next: any,
    previous: any,
    results: {
        name: string,
        url: string
    }[]
}