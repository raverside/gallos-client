import fetcher from './fetcher';

export async function getEvent(id:string) {
    return fetcher.get(`/getEvent/${id}`);
}

export async function getEvents(filter:string = "", page:number = 0) {
    return fetcher.get(`/getEvents?page=${page}${filter}`);
}

export async function upsertEvent(payload: {image_upload?: File|null, image?: string|null|undefined}) {
    if (payload.image_upload) {
        let formData = new FormData();
        formData.append('event', payload.image_upload);
        const {filename} = await fetcher.upload('/uploadEventPicture', formData);
        payload.image = filename;
    }

    return fetcher.post('/upsertEvent', payload);
}

export async function removeEvent(id:string) {
    return fetcher.get(`/removeEvent/${id}`)
}
