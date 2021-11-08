import fetcher from './fetcher';

export function loginAdmin(phone: string, passcode: string) {
    return fetcher.post(`/loginAdmin`, {phone, passcode});
}

export function tokenLogin() {
    return fetcher.get(`/tokenLogin`);
}
