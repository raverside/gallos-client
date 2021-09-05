import fetcher from './fetcher';

export async function getMembership(id:string) {
    return fetcher.get(`/getMemberships/${id}`);
}

export async function getMemberships() {
    return fetcher.get(`/getMemberships`);
}
