import fetcher from './fetcher';

export async function getMembership(id:string) {
    return fetcher.get(`/getMemberships/${id}`);
}

export async function getMemberships() {
    return fetcher.get(`/getMemberships`);
}

export async function upsertMembership(payload: {}) {
    return fetcher.post('/upsertMembership', payload);
}

export async function deleteMembership(id:string) {
    return fetcher.get(`/deleteMembership/${id}`);
}
