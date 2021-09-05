import fetcher from './fetcher';

export async function getUser(id:string) {
    return fetcher.get(`/getUser/${id}`);
}

export async function getUsers(filter:string = "", page:number = 0) {
    return fetcher.get(`/getUsers?page=${page}${filter}`);
}

export async function updateUserProfile(id:string, phone:string, passcode:string|false) {
    return fetcher.post(`/updateUserProfile`, {id, phone, passcode});
}

export async function updateUserLabels(id:string, labels:string) {
    return fetcher.post(`/updateUserLabels`, {id, labels});
}

export async function addUserNote(id:string, noteTitle:string, note:string) {
    return fetcher.post(`/addUserNote`, {id, noteTitle, note});
}

export async function updateUserNote(note_id:string, noteTitle:string, note:string) {
    return fetcher.post(`/updateUserNote`, {note_id, noteTitle, note});
}

export async function removeUserNote(id:string) {
    return fetcher.post(`/removeUserNote`, {id});
}
