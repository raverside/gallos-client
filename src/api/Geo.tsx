import fetcher from './fetcher';

export async function getCountries(countriesWithStadium:boolean = false) {
    if (countriesWithStadium) {
        return fetcher.get(`/getCountries?withStadium=true`);
    } else {
        return fetcher.get(`/getCountries`);
    }

}

export async function getStatesByCountry(country_id:number) {
    return fetcher.get(`/getStates/${country_id}`);
}

export async function getCitiesByState(state_id:number) {
    return fetcher.get(`/getCities/${state_id}`);
}
