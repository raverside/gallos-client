export function formatPasscode(passcode: string) {
    return passcode?.replace(/[^\dA-Z]/gi, '')
        .toUpperCase()
        .replace(/(.{3})/g, '$1 ')
        .trim() || "";
}

export function getImageUrl(filename: string) {
    return process.env.REACT_APP_DOMAIN + ":" + process.env.REACT_APP_NODE_PORT + "/uploads/" + filename;
}
