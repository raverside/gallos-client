export function formatPasscode(passcode: string) {
    return passcode?.replace(/[^\dA-Z]/gi, '')
        .toUpperCase()
        .replace(/(.{3})/g, '$1 ')
        .trim() || "";
}

export function getImageUrl(filename: string) {
    return process.env.REACT_APP_DOMAIN + ":" + process.env.REACT_APP_NODE_PORT + "/uploads/" + filename;
}

export function formatOzToLbsOz(oz:string) {
    const lbs = ""+(parseFloat(oz) / 16);
    const splitString = lbs.split('.');
    const pounds = parseInt(splitString[0]);
    const ozs = splitString[1] ? parseFloat("0."+splitString[1]) : false;
    const ounces = ozs ? (ozs * 16).toFixed(2) : false;

    return (pounds ? pounds + " Lbs " : "") + (ounces ? ounces + " Oz" : "");
}
