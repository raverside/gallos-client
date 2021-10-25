import fetcher from './fetcher';

export async function getMembership(id:string) {
    return fetcher.get(`/getMemberships/${id}`);
}

export async function getMemberships(filter:string = "", page:number = 0) {
    return fetcher.get(`/getMemberships?page=${page}${filter}`);
}

export async function upsertMembership(payload: {}) {
    return fetcher.post('/upsertMembership', payload);
}

export async function deleteMembership(id:string) {
    return fetcher.get(`/deleteMembership/${id}`);
}
