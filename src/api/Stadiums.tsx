import fetcher from './fetcher';

export async function getStadium(id:string) {
    return fetcher.get(`/getStadium/${id}`);
}

export async function getStadiums(filter:string = "", page:number = 0) {
    return fetcher.get(`/getStadiums?page=${page}${filter}`);
}
