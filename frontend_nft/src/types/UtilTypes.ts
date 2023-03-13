export interface Paged<T> {
    page: number
    per_page: number
    pre_page: number
    next_page: number
    total: number
    total_pages:number
    data:T
}
