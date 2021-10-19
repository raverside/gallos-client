import fetcher from './fetcher';

export async function getEvent(id:string) {
    return fetcher.get(`/getEvent/${id}`);
}

export async function getEvents(filter:string = "", page:number = 0) {
    return fetcher.get(`/getEvents?page=${page}${filter}`);
}

export async function getOngoingEvents() {
    return fetcher.get(`/getOngoingEvents`);
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

export async function upsertParticipant(payload: {image_upload?: File|null, image?: string|null|undefined, image_flipped: boolean}) {
    if (payload.image_upload) {
        let formData = new FormData();
        formData.append('participant', payload.image_upload);
        const {filename} = await fetcher.upload('/uploadParticipantPicture', formData);
        payload.image = filename;
    }

    return fetcher.post('/upsertParticipant', payload);
}

export async function generateMatches(event_id:string, method:number, special_guests:any) {
    return fetcher.post(`/generateMatches/${event_id}`, {method, special_guests});
}

export async function goLive(payload:{}) {
    return fetcher.post(`/publishMatches`, payload);
}

export async function publishMatch(match_id:string) {
    return fetcher.get(`/publishMatch/${match_id}`);
}

export async function cancelMatch(match_id:string) {
    return fetcher.get(`/cancelMatch/${match_id}`);
}

export async function announceMatchResult(match_id:string, result:number) {
    return fetcher.post(`/announceMatchResult/${match_id}`, {result});
}

export async function swapSides(match_id:string) {
    return fetcher.get(`/switchSides/${match_id}`);
}

export async function announceEvent(event_id:string) {
    return fetcher.get(`/announceEvent/${event_id}`);
}

export async function createMatch(event_id:string, participant_id:string, opponent_id:string, live:boolean) {
    return fetcher.post(`/createMatch`, {event_id, participant_id, opponent_id, live});
}
