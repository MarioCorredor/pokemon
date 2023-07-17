export interface AMove {
    count: number;
    next: string;
    previous: string;
    results: { name: string, url: string }[]
}