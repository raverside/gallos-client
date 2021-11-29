export function formatPasscode(passcode: string) {
    return passcode?.replace(/[^\dA-Z]/gi, '')
        .toUpperCase()
        .replace(/(.{3})/g, '$1 ')
        .trim() || "";
}

export function getImageUrl(filename: string) {
    return process.env.REACT_APP_NODE_API_URL + "/uploads/" + filename;
}

export function formatOzToLbsOz(oz:string) {
    const lbs = ""+(parseFloat(oz) / 16);
    const splitString = lbs.split('.');
    const pounds = parseInt(splitString[0]) || 0;
    const ozs = splitString[1] ? parseFloat("0."+splitString[1]) : 0;
    const ounces = ozs ? (ozs * 16).toFixed(2) : 0;
    const ozshort = (""+ounces).split('.')[0] || 0;
    const pointsShort = (""+ounces).split('.')[1] || 0;

    return pounds+"." + ozshort+"." + (pointsShort.toString().substring(0,1));
}

export function formatOzToLbsOzVerbal(oz:string) {
    const lbs = ""+(parseFloat(oz) / 16);
    const splitString = lbs.split('.');
    const pounds = parseInt(splitString[0]);
    const ozs = splitString[1] ? parseFloat("0."+splitString[1]) : false;
    const ounces = ozs ? (ozs * 16).toFixed(2) : false;

    return (pounds ? pounds + " Lbs " : "") + (ounces ? ounces + " Oz" : "");
}
