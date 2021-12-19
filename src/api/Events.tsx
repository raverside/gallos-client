import fetcher from './fetcher';
import Resizer from "react-image-file-resizer";

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
        const resizedImage = await resizeFile(payload.image_upload);
        let formData = new FormData();
        // @ts-ignore
        formData.append('participant', resizedImage);
        const {filename} = await fetcher.upload('/uploadParticipantPicture', formData);
        payload.image = filename;
    }

    return fetcher.post('/upsertParticipant', payload);
}

export async function findParticipantByStadiumData(stadium_id:string, stadium_name:string) {
    return fetcher.post(`/findParticipantByStadiumData`, {stadium_id, stadium_name});
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

export async function deleteMatch(match_id:string) {
    return fetcher.get(`/deleteMatch/${match_id}`);
}

export async function cancelMatch(match_id:string) {
    return fetcher.get(`/cancelMatch/${match_id}`);
}

export async function announceMatchResult(match_id:string, result:number, match_time:number) {
    return fetcher.post(`/announceMatchResult/${match_id}`, {result, match_time});
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

export async function getStatisticsByStadium(stadium_id:string, type: string, dateFilter: {}) {
    return fetcher.post(`/statistics/${stadium_id}/${type}`, {dateFilter});
}

const resizeFile = (file:File) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            1920,
            1920,
            "JPEG",
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "file"
        );
    });
