import fetcher from './fetcher';

export async function getCountries(countriesWithStadium:boolean = false) {
    return fetcher.get(`/getCountries?withStadium=${countriesWithStadium}`);
}

export async function getStatesByCountry(country_id:number) {
    return fetcher.get(`/getStates/${country_id}`);
}

export async function getCitiesByState(state_id:number) {
    return fetcher.get(`/getCities/${state_id}`);
}
