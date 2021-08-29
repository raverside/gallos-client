import fetcher from './fetcher';

export async function getEvents(dateFilter:string = "today", page:number = 0) {
    return fetcher.get(`/getEvents?dateFilter=${dateFilter}&page=${page}`);
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
