import roosterPlaceholder from "../img/rooster_transparent.png";
import roosterBlackPlaceholder from "../img/rooster_transparent_black.png";

const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});

export function formatPasscode(passcode: string) {
    return passcode?.replace(/[^\dA-Z]/gi, '')
        .toUpperCase()
        .replace(/(.{3})/g, '$1 ')
        .trim() || "";
}

export function getImageUrl(filename: string, black_placeholder = false) {
    if (!filename) return black_placeholder ? roosterBlackPlaceholder : roosterPlaceholder;

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

export function getStadiumInitials(stadium:string) {
    switch(stadium) {
        case "Santiago":
            return "ST";
        break;
        case "Santo Domingo":
            return "SD";
        break;
        case "San Francisco":
            return "SFM";
        break;
        case "Jo Kelner":
            return "JK";
        break;
        case "Regional":
            return "R";
        break;
        default:
            return "";
        break;
    }
}

export function getParticipantBettingAmount(participant:any, event:any) {
    if (!participant || !event) return "";
    let betting_pref = 'Open';
    switch (participant.betting_amount) {
        case "bronze":
            if (event.bronze > 0) betting_pref = ((event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.bronze));
            break;
        case "silver":
            if (event.silver_one > 0) betting_pref = (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.silver_one);
            if (event.silver_two > 0) betting_pref += " & " + numberFormatter.formatToParts(event.silver_two).find(x => x.type === "integer")?.value;
            break;
        case "gold":
            if (event.gold_one > 0) betting_pref = (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.gold_one);
            if (event.gold_two > 0) betting_pref += " & " + numberFormatter.formatToParts(event.gold_two).find(x => x.type === "integer")?.value;
            break;
    }
    return betting_pref;
}
