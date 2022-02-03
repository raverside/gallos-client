import fetcher from './fetcher';

export async function getUser(id:string) {
    return fetcher.get(`/getUser/${id}`);
}

export async function getUsers(filter:string = "", page:number = 0) {
    return fetcher.get(`/getUsers?page=${page}${filter}`);
}

export async function getDashUsers(filter:string = "") {
    return fetcher.get(`/getDashUsers?page=all${filter}`);
}

export async function updateUserProfile(id:string, phone:string, passcode:string|false) {
    return fetcher.post(`/updateUserProfile`, {id, phone, passcode});
}

export async function upsertUser(payload:any) {
    if (payload.photo_upload) {
        let formData = new FormData();
        formData.append('user', payload.photo_upload);
        const {filename} = await fetcher.upload('/uploadUserPicture', formData);
        payload.photo = filename;
    }

    return fetcher.post('/upsertUser', payload);
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

export async function getAllLabels() {
    return fetcher.get(`/getAllLabels`);
}

export async function upsertUserLabel(id:string, label:string) {
    return fetcher.post(`/upsertUserLabel`, {id, label});
}

export async function deleteUserLabel(id:string) {
    return fetcher.get(`/deleteUserLabel/${id}`);
}

export async function updateCurrentUser(payload:any) {
    if (payload.photo_upload) {
        let formData = new FormData();
        formData.append('user', payload.photo_upload);
        const {filename} = await fetcher.upload('/uploadUserPicture', formData);
        payload.photo = filename;
    }

    return fetcher.post('/updateCurrentUser', payload);
}

export async function toggleUserBlock(id:string) {
    return fetcher.post(`/toggleUserBlock`, {id});
}
