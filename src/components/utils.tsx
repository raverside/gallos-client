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

export function isDesktop() {
    // @ts-ignore
    const navigatorAgent = navigator.userAgent || navigator.vendor || window.opera;
    return !(
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
            navigatorAgent
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ /])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
            navigatorAgent.substr(0, 4)
        )
    );
}
