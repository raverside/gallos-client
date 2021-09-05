import fetcher from './fetcher';

export async function getTeamOwner(id:string) {
    return fetcher.get(`/getTeamOwner/${id}`);
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
//
// export async function updateTeamOwnerTeam(team_id:string, title:string) {
//     return fetcher.post(`/updateTeamOwnerTeam`, {team_id, title});
// }
//
// export async function removeTeamOwnerTeam(id:string) {
//     return fetcher.post(`/removeTeamOwnerTeam`, {id});
// }
