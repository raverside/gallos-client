import React from "react";
import moment from "moment";
import {formatOzToLbsOz} from "../utils";

const PrintMatches = React.forwardRef<any, any>(({event, mode}, ref) => {
    const matches = event.matches;
    const liveMatches = matches?.filter((p:any) => p.live) || [];
    const availableMatches = matches?.filter((p:any) => !p.live) || [];
    const allParticipants = event.participants;
    const allParticipantsNonLive = event.participants?.filter((p:any) => !event.matches.find((m:any) => m.live && (m.opponent_id === p.id || m.participant_id === p.id)));
    const unmatchedParticipants = allParticipants?.filter((participant:any) =>
        participant.status === "approved" && !event.matches?.find((match:any) =>
        match.participant_id === participant.id || match.opponent_id === participant.id
        )
    );
    const excludedParticipants = allParticipants?.filter((participant:any) => participant.status === "rejected");
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0});

    let printMatches = [];
    let title = "";

    switch(mode) {
        case 1:
            title = "Live Matches";
            printMatches = liveMatches;
        break;
        case 2:
            title = "Available Matches";
            printMatches = availableMatches;
        break;
        case 3:
            title = "Unmatched Animals";
            printMatches = unmatchedParticipants;
        break;
        case 4:
            title = "Excluded Animals";
            printMatches = excludedParticipants;
        break;
        case 5:
            title = "All Animals";
            printMatches = allParticipants;
        break;
        case 6:
            title = "All Animals (non-live matches)";
            printMatches = allParticipantsNonLive;
        break;
    }

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

    return (!event ? null : <>
        <div ref={ref} style={{textAlign:"center", width: "80mm", fontSize: "14px", fontFamily: "Arial"}}>
            <h1 style={{width: "100%", textAlign:"center", fontSize: "16px", fontWeight: "bold"}}>{event.stadium_name}</h1>
            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", margin: "0 0 20px 0"}}>{event.title || "Traditional Event"}</h2>
            <div style={{display:"flex", justifyContent: "space-between", borderBottom: "1px solid black"}}>
                <div>Date: {moment().format('YYYY-MM-DD')}</div>
                <div>Time: {moment().format("HH:mm")}</div>
            </div>
            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", fontWeight: "bold"}}>{title}</h2>
            {(mode == 1 || mode === 2) ? <div style={{width: "100%"}}>
                    {printMatches?.map((match:any, index:number) =>
                        <div>
                            <div style={{display:"flex", justifyContent: "space-between", background: "black", color:"white"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>Pelea #{index + 1}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>VS</div>
                                <div style={{textAlign: "center", width: "25mm"}}></div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm", fontWeight: "bold"}}>{match.participant?.team?.name}</div>
                                <div style={{textAlign: "center", width: "30mm"}}></div>
                                <div style={{textAlign: "center", width: "25mm", fontWeight: "bold"}}>{match.opponent?.team?.name}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.type}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Marcaje</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.type}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{formatOzToLbsOz(match.participant?.weight)}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Weight</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{formatOzToLbsOz(match.opponent?.weight)}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.color}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Color</div>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.color}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.alas}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Alas</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.alas}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.cresta}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Cresta</div>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.cresta}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.pata}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Patas</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.pata}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.physical_advantage?.replace('_', ' ')}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Advantage</div>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.physical_advantage.replace('_', ' ')}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.participated_before ? "Yes" : "No"}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Participated?</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.participated_before ? "Yes" : "No"}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.breeder_name}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Breeder</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.breeder_name}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{getBettingAmount(match.participant)}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>Bet</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{getBettingAmount(match.participant)}</div>
                            </div>
                        </div>
                    ) }
            </div> : <table style={{width: "80mm", fontSize: "14px"}}>
                <thead>
                <tr style={{background: "black", color: "white", fontWeight:"bold"}}>
                    <th>#</th>
                    <th style={{textAlign:"left"}}>Team</th>
                    <th>Weight</th>
                    <th>M</th>
                </tr>
                </thead>
                <tbody>
                {printMatches?.map((participant:any, index:number) => {
                    const betting_amount = getBettingAmount(participant);

                    return (<tr style={{borderBottom: "1px solid black", lineHeight: "12px"}}>
                        <td style={{textAlign:"center", fontWeight: "bold"}}>#{index + 1}</td>
                        <td style={{textAlign:"left"}}>
                            <p style={{fontWeight: "bold", margin: "5px 0"}}>{participant.team?.name}</p>
                            <p style={{margin: "0", textTransform: "capitalize"}}>{participant.color} {participant.cresta}</p>
                            {participant.physical_advantage !== "none" && <p  style={{margin: "0", textTransform: "capitalize"}}>Ven: {participant.physical_advantage}</p>}
                            {participant.status === "rejected" && <div style={{maxWidth: "40mm"}}>
                                <p style={{ background: "black", color: "white", fontWeight:"bold", padding:"2px 5px"}}>Rejected</p>
                                <p>This animal was excluded since it doesn't meet the requirements</p>
                            </div>}
                        </td>
                        <td style={{textAlign:"center"}}>
                            <p style={{margin: "2px"}}>{formatOzToLbsOz(participant.weight)}</p>
                            <p style={{margin: "2px"}}>{betting_amount}</p>
                            <p style={{margin: "2px"}}>{participant.participated_before ? "Peliado" : "Sin Pelear"}</p>
                        </td>
                        <td style={{textAlign:"center"}}>{participant.type}</td>
                    </tr>);}
                ) }
                </tbody>
            </table>}
            <p style={{ fontSize: "16px", textAlign: "center", fontWeight: "bold", borderTop: "1px dashed black", padding: "10px"}}>gallosclub.com</p>
        </div>
    </>);
});

export default PrintMatches;
