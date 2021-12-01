import fetcher from './fetcher';

export function login(phone: string, passcode: string) {
    return fetcher.post(`/login`, {phone, passcode});
}

export function loginAdmin(phone: string, passcode: string) {
    return fetcher.post(`/loginAdmin`, {phone, passcode});
}

export function tokenLogin() {
    return fetcher.get(`/tokenLogin`);
}

export function checkPhone(phone:string) {
    return fetcher.post(`/checkPhone`, {phone});
}

export function registerUser(phone: string, passcode: string) {
    return fetcher.post(`/registerUser`, {phone, passcode});
}
