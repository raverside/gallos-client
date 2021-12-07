import React from "react";
import moment from "moment";
import {formatOzToLbsOz} from "../utils";
import {useTranslation} from "react-multi-lang";

const PrintMatch = React.forwardRef<any, any>(({event, match}, ref) => {
    const t = useTranslation();
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0});

    const getBettingAmount = (participant:any) => {
        if (!participant) return "";
        let betting_pref = 'Open';
        switch (participant.betting_amount) {
            case "bronze":
                if (event.bronze > 0) betting_pref = ((event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.bronze));
                break;
            case "silver":
                if (event.silver_one > 0) betting_pref = " | " + (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.silver_one);
                if (event.silver_two > 0) betting_pref = " & " + numberFormatter.formatToParts(event.silver_two).find(x => x.type === "integer")?.value;
                break;
            case "gold":
                if (event.gold_one > 0) betting_pref = " | " + (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.gold_one);
                if (event.gold_two > 0) betting_pref = " & " + numberFormatter.formatToParts(event.gold_two).find(x => x.type === "integer")?.value;
                break;
        }
        return betting_pref;
    };

    return ((!event || !match) ? null : <>
        <div ref={ref} style={{textAlign:"center", width: "80mm", fontSize: "14px", fontFamily: "Arial"}}>
            <h1 style={{width: "100%", textAlign:"center", fontSize: "16px", fontWeight: "bold"}}>{event.stadium_name}</h1>
            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", margin: "0 0 20px 0"}}>{event.title || t('events.default_event_name')}</h2>
            <div style={{display:"flex", justifyContent: "space-between", borderBottom: "1px solid black"}}>
                <div>{t('events.date')}: {moment().format('YYYY-MM-DD')}</div>
                <div>{t('events.time')}: {moment().format("HH:mm")}</div>
            </div>
            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", fontWeight: "bold"}}>{t('events.individual_match')}</h2>
            <div style={{width: "100%"}}>
                <div>
                    <div style={{display:"flex", justifyContent: "space-between", background: "black", color:"white"}}>
                        <div style={{textAlign: "center", width: "25mm"}}></div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>VS</div>
                        <div style={{textAlign: "center", width: "25mm"}}></div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm", fontWeight: "bold"}}>{match.participant?.team?.name}</div>
                        <div style={{textAlign: "center", width: "30mm"}}></div>
                        <div style={{textAlign: "center", width: "25mm", fontWeight: "bold"}}>{match.opponent?.team?.name}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.cage}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.cage')}</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.cage}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{t('judge.blue')}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('judge.side_color')}</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{t('judge.white')}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.type}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.type')}</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.type}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{formatOzToLbsOz(match.participant?.weight)}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.weight')}</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{formatOzToLbsOz(match.opponent?.weight)}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.participated_before ? t('events.participated_yes') : t('events.participated_no')}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.participated')}?</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.participated_before ? t('events.participated_yes') : t('events.participated_no')}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.color}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.color')}</div>
                        <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.color}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.alas}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.alas')}</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.alas}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.cresta}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.cresta')}</div>
                        <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.cresta}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.pata}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.patas')}</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.pata}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.physical_advantage?.replace('_', ' ')}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.advantage')}</div>
                        <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.physical_advantage.replace('_', ' ')}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.breeder_name}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.breeder')}</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.breeder_name}</div>
                    </div>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>{getBettingAmount(match.participant)}</div>
                        <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.bet')}</div>
                        <div style={{textAlign: "center", width: "25mm"}}>{getBettingAmount(match.participant)}</div>
                    </div>
                </div>
            </div>
            <p style={{ fontSize: "16px", textAlign: "center", fontWeight: "bold", borderTop: "1px dashed black", padding: "10px"}}>gallosclub.com</p>
        </div>
    </>);
});

export default PrintMatch;
