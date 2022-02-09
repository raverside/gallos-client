import fetcher from './fetcher';

export async function getTeamOwner(id:string) {
    return fetcher.get(`/getTeamOwner/${id}`);
}

export async function getTeamOwnerByDigitalId(id:number) {
    return fetcher.get(`/getTeamOwnerByDigitalId/${id}`);
}

export async function getTeamOwners() {
    return fetcher.get(`/getTeamOwners`);
}

export async function upsertTeamOwner(payload: {}) {
    return fetcher.post('/upsertTeamOwner', payload);
}

export async function addTeamOwnerNote(id:string, noteTitle:string, note:string) {
    return fetcher.post(`/addTeamOwnerNote`, {id, noteTitle, note});
}

export async function updateTeamOwnerNote(note_id:string, noteTitle:string, note:string) {
    return fetcher.post(`/updateTeamOwnerNote`, {note_id, noteTitle, note});
}

export async function removeTeamOwnerNote(id:string) {
    return fetcher.post(`/removeTeamOwnerNote`, {id});
}

export async function addTeamOwnerTeam(id:string, payload:{}) {
    return fetcher.post(`/addTeamOwnerTeam`, {id, payload});
}

export async function addTeamOwnerLiberty(owner_id:string, reason:string, opponent_id:string) {
    return fetcher.post(`/addTeamOwnerLiberty`, {owner_id, reason, opponent_id});
}

export async function updateTeamOwnerLiberty(id:string, reason:string, opponent_id:string) {
    return fetcher.post(`/updateTeamOwnerLiberty`, {id, reason, opponent_id});
}

export async function removeTeamOwnerLiberty(id:string) {
    return fetcher.post(`/removeTeamOwnerLiberty`, {id});
}

export async function updateTeamOwnerTeam(id:string, name:string) {
    return fetcher.post(`/updateTeamOwnerTeam`, {id, name});
}

export async function removeTeamOwnerTeam(id:string) {
    return fetcher.post(`/removeTeamOwnerTeam`, {id});
}

export async function removeTeamOwner(id:string) {
    return fetcher.post(`/removeTeamOwner`, {id});
}
