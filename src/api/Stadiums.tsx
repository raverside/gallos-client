import fetcher from './fetcher';

export async function getStadium(id:string) {
    return fetcher.get(`/getStadium/${id}`);
}

export async function getStadiums(filter:string = "", page:number = 0) {
    return fetcher.get(`/getStadiums?page=${page}${filter}`);
}

export async function fetchAllStadiums() {
    return fetcher.get(`/getAllStadiums`);
}

export async function upsertStadium(payload: {image_upload?: File|null, image?: string|null|undefined, logo_upload?: File|null, logo?: string|null|undefined}) {
    if (payload.image_upload) {
        let formData = new FormData();
        formData.append('stadium', payload.image_upload);
        const {filename} = await fetcher.upload('/uploadStadiumPicture', formData);
        payload.image = filename;
    }

    if (payload.logo_upload) {
        let formData = new FormData();
        formData.append('stadium', payload.logo_upload);
        const {filename} = await fetcher.upload('/uploadStadiumPicture', formData);
        payload.logo = filename;
    }

    return fetcher.post('/upsertStadium', payload);
}
