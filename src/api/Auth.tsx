import fetcher from './fetcher';

export function loginAdmin(username: string, passcode: string) {
    return fetcher.post(`/loginAdmin`, {username, passcode});
}

export function tokenLogin() {
    return fetcher.get(`/tokenLogin`);
}
