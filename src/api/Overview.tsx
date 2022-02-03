import fetcher from './fetcher';


export async function getOverviewInfo() {
    return fetcher.get(`/getOverviewInfo`);
}
