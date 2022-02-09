import React from "react";
import moment from "moment";
import {formatOzToLbsOz, getStadiumInitials, getParticipantBettingAmount, getBettingPreference} from "../utils";
import {useTranslation} from "react-multi-lang";

const PrintMatches = React.forwardRef<any, any>(({event, mode}, ref) => {
    const t = useTranslation();
    const matches = event.matches;
    const liveMatches = matches?.filter((p:any) => p.live) || [];
    const availableMatches = matches?.filter((p:any) => !p.live) || [];
    const allParticipants = event.participants?.sort((a:any, b:any) => (+new Date(a.createdAt)) - (+new Date(b.createdAt)));
    const allParticipantsNonLive = event.participants?.filter((p:any) => !event.matches.find((m:any) => m.live && (m.opponent_id === p.id || m.participant_id === p.id))).sort((a:any, b:any) => (+new Date(a.createdAt)) - (+new Date(b.createdAt)));
    const unmatchedParticipants = allParticipants?.filter((participant:any) =>
        participant.status === "approved" && !event.matches?.find((match:any) =>
        match.participant_id === participant.id || match.opponent_id === participant.id
        )
    ).sort((a:any, b:any) => (+a.weight - +b.weight));
    const excludedParticipants = allParticipants?.filter((participant:any) => participant.status === "rejected").sort((a:any, b:any) => (+new Date(a.createdAt)) - (+new Date(b.createdAt)));
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});

    let printMatches = [];
    let title = "";
    let cut = false;

    switch(mode) {
        case 1:
            title = t('events.print_live_matches');
            printMatches = liveMatches;
        break;
        case 2:
            title = t('events.print_live_matches');
            printMatches = liveMatches;
            cut = true;
            break;
        case 3:
            title = t('events.print_available_matches');
            printMatches = availableMatches;
        break;
        case 4:
            title = t('events.print_available_matches');
            printMatches = availableMatches;
            cut = true;
            break;
        case 5:
            title = t('events.print_unmatched');
            printMatches = unmatchedParticipants;
        break;
        case 6:
            title = t('events.print_excluded');
            printMatches = excludedParticipants;
        break;
        case 7:
            title = t('events.print_all_animals');
            printMatches = allParticipants;
        break;
        case 8:
            title = t('events.print_participant_summary');
            printMatches = allParticipants;
            cut = true;
            break;
        case 9:
            title = t('events.print_all_animals_nonlive');
            printMatches = allParticipantsNonLive;
        break;
        case 0:
            title = t('events.print_live_matches');
            printMatches = liveMatches;
        break;
    }

    return (!event ? null : <>
        <div ref={ref} style={{textAlign:"center", width: "80mm", fontSize: "14px", fontFamily: "Arial"}}>
            {(mode == 1 || mode === 2 || mode === 3 || mode === 4) ? <div style={{width: "100%"}}>
                    {printMatches?.sort((a:any, b:any) => a.number - b.number).map((match:any, index:number) => (<>
                        {(index === 0 || cut) && <>
                            <h1 style={{width: "100%", textAlign:"center", fontSize: "18px", fontWeight: "bold"}}>{event.stadium_name}</h1>
                            <div style={{width: "100%", textAlign:"center", fontSize: "14px", margin: "0 0 20px 0"}}>{event.title || t('events.default_event_name')}</div>
                            <div style={{display:"flex", justifyContent: "space-between", borderBottom: "1px solid black"}}>
                                <div>Date: {moment().format('YYYY-MM-DD')}</div>
                                <div>Time: {moment().format("HH:mm")}</div>
                            </div>
                            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", fontWeight: "bold"}}>{title}</h2>
                        </>}
                        <div style={cut ? {pageBreakAfter: "always"} : {}}>
                            <div style={{display:"flex", justifyContent: "space-between", background: "black", color:"white", padding: "7px 0", fontWeight: "bold", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "80mm", fontSize: "18px"}}>{t('baloteo.fight')} #{match.number || 1}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm", fontWeight: "bold"}}>{match.participant?.team?.name}</div>
                                <div style={{textAlign: "center", width: "30mm"}}></div>
                                <div style={{textAlign: "center", width: "25mm", fontWeight: "bold"}}>{match.opponent?.team?.name}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.cage}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.cage')}</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.cage}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{t('judge.blue')}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('judge.side_color')}</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{t('judge.white')}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.type}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.type')}</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.type}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{formatOzToLbsOz(match.participant?.weight)}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.weight')}</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{formatOzToLbsOz(match.opponent?.weight)}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.participated_before ? t('events.participated_yes') : t('events.participated_no')}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.participated')}?</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.participated_before ? t('events.participated_yes') : t('events.participated_no')}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.color}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.color')}</div>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.color}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.alas}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.alas')}</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.alas}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.cresta}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.cresta')}</div>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.cresta}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.pata}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.patas')}</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.pata}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.participant?.physical_advantage?.replace('_', ' ')}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.advantage')}</div>
                                <div style={{textAlign: "center", width: "25mm", textTransform: "capitalize"}}>{match.opponent?.physical_advantage.replace('_', ' ')}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between", marginBottom:"5px"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.participant?.breeder_name}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.breeder')}</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{match.opponent?.breeder_name}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "center", width: "25mm"}}>{getBettingPreference(event, match.participant, match.opponent)}</div>
                                <div style={{textAlign: "center", width: "30mm", fontWeight: "bold"}}>{t('events.bet')}</div>
                                <div style={{textAlign: "center", width: "25mm"}}>{getBettingPreference(event, match.participant, match.opponent)}</div>
                            </div>
                            {(((index + 1) === printMatches.length) || cut) && <p style={{ fontSize: "16px", textAlign: "center", fontWeight: "bold", borderTop: "1px dashed black", padding: "10px"}}>gallosclub.com</p>}
                        </div>
                        </>)
                    ) }
            </div> : (mode === 8) ? <div style={{width: "100%"}}>
                {printMatches?.map((participant:any, index:number) => (<>
                        {(index === 0 || cut) && <>
                            <h1 style={{width: "100%", textAlign:"center", fontSize: "16px", fontWeight: "bold"}}>{event.stadium_name}</h1>
                            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", margin: "0 0 20px 0"}}>{event.title || t('events.default_event_name')}</h2>
                            <div style={{display:"flex", justifyContent: "space-between", borderBottom: "1px solid black"}}>
                                <div>Date: {moment().format('YYYY-MM-DD')}</div>
                                <div>Time: {moment().format("HH:mm")}</div>
                            </div>
                            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", fontWeight: "bold"}}>{title}</h2>
                        </>}
                        <div style={cut ? {pageBreakAfter: "always"} : {}}>
                            <div style={{width: "100%", textAlign:"center", fontSize: "16px", fontWeight: "bold", background: "black", color:"white", padding: "5px 0"}}>
                                #{participant.cage} {participant.team?.name}
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.type')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{participant.type}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.stadium_id')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{participant.stadium_id} {getStadiumInitials(participant.stadium_name)}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.color')}</div>
                                <div style={{textAlign: "center", width: "40mm", textTransform: "capitalize"}}>{participant.color}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.cresta')}</div>
                                <div style={{textAlign: "center", width: "40mm", textTransform: "capitalize"}}>{participant.cresta}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.alas')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{participant.alas}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.patas')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{participant.pata}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.breeder_id')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{participant.breeder_id}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.breeder_name')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{participant.breeder_name}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.weight')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{formatOzToLbsOz(participant.weight)}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.participated_before')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{participant.participated_before ? "Peliado" : "Sin Pelear"}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.advantage')}</div>
                                <div style={{textAlign: "center", width: "40mm", textTransform: "capitalize"}}>{participant.physical_advantage}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.betting_amount')}</div>
                                <div style={{textAlign: "center", width: "40mm"}}>{getParticipantBettingAmount(participant, event)}</div>
                            </div>
                            <div style={{display:"flex", justifyContent: "space-between"}}>
                                <div style={{textAlign: "left", width: "40mm", fontWeight: "bold"}}>{t('events.betting_preference')}</div>
                                <div style={{textAlign: "center", width: "40mm", textTransform: "capitalize"}}>{participant.betting_pref}</div>
                            </div>
                            <div style={{textTransform:"uppercase", width: "100%", textAlign:"center", fontSize: "20px", fontWeight: "bold", borderTop: "5px solid black", borderBottom: "5px solid black", margin: "10px 0", padding: "5px 0"}}>
                                {t('events.'+participant.status)}
                                {(participant.status === "rejected" && participant.reason) && <div style={{textTransform: "none"}}>
                                    <span style={{fontSize: "12px", fontWeight: "bold"}}>{t('events.rejection_note')}: </span>
                                    <span style={{fontSize: "10px", fontWeight: "normal"}}>{participant.reason}</span>
                                </div>}
                                {((participant.status !== "rejected" || !participant.reason) && participant.observation) && <div style={{textTransform: "none"}}>
                                    <span style={{fontSize: "12px", fontWeight: "bold"}}>{t('events.observation')}: </span>
                                    <span style={{fontSize: "10px", fontWeight: "normal"}}>{participant.observation}</span>
                                </div>}
                            </div>
                            {(index === printMatches.length || cut) && <p style={{ fontSize: "16px", textAlign: "center", fontWeight: "bold", borderTop: "1px dashed black", padding: "10px"}}>gallosclub.com</p>}
                        </div>
                    </>)
                ) }
            </div> : (mode === 0) ? <>
                <h1 style={{fontSize: "20px", width: "1000px", textAlign: "center"}}>{event.stadium_name}</h1>
                <div style={{fontSize: "16px", fontWeight: "bold", color: "#EB0404", width: "1000px", textAlign: "center"}}>{title}</div>
                <div style={{fontSize: "16px", fontWeight: "bold", width: "1000px", textAlign: "center"}}>{moment(event.event_date).format("dddd, D MMMM YYYY")}</div>
                <div style={{fontSize: "20px", fontWeight: "bold", width: "1000px", textAlign: "center"}}>{(event.is_special && event.title) ? event.title : t('events.default_event_name')}</div>
                <table style={{width: "1000px"}}>
                    <thead  style={{border: 0}}>
                        <tr style={{background: "black", color: "white", fontWeight:"bold"}}>
                            <th>#</th>
                            <th>{t('events.cage')}</th>
                            <th>{t('teams.team_name')}</th>
                            <th>{t('events.type')}</th>
                            <th>{t('events.weight')}</th>
                            <th>{t('events.color')}</th>
                            <th></th>
                            <th>{t('events.cage')}</th>
                            <th>{t('teams.team_name')}</th>
                            <th>{t('events.type')}</th>
                            <th>{t('events.weight')}</th>
                            <th>{t('events.color')}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {printMatches?.map((match:any) => <tr>
                            <td style={{textAlign: "center"}}>{match.number}</td>
                            <td style={{textAlign: "center"}}>{match.participant.cage}</td>
                            <td style={{textAlign: "center", textTransform: "uppercase", fontWeight: "bold", color: "#002D72"}}>{match.participant.team.name}</td>
                            <td style={{textAlign: "center"}}>{match.participant.type}</td>
                            <td style={{textAlign: "center", fontWeight: "bold"}}>{formatOzToLbsOz(match.participant.weight)}</td>
                            <td style={{textAlign: "center", textTransform: "capitalize"}}>{match.participant.color}</td>
                            <td style={{textAlign: "center", fontWeight: "bold", color: "#EB0404"}}>-VS-</td>
                            <td style={{textAlign: "center"}}>{match.opponent.cage}</td>
                            <td style={{textAlign: "center", textTransform: "uppercase", fontWeight: "bold"}}>{match.opponent.team.name}</td>
                            <td style={{textAlign: "center"}}>{match.opponent.type}</td>
                            <td style={{textAlign: "center", fontWeight: "bold"}}>{formatOzToLbsOz(match.opponent.weight)}</td>
                            <td style={{textAlign: "center", textTransform: "capitalize"}}>{match.opponent.color}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <p style={{ width: "1000px", fontSize: "16px", textAlign: "center", fontWeight: "bold", borderTop: "1px dashed black", padding: "10px"}}>gallosclub.com</p>
            </> : <>
                <table style={{width: "80mm", fontSize: "14px"}}>
                    <thead>
                    <tr style={{background: "black", color: "white", fontWeight:"bold"}}>
                        <th>#</th>
                        <th style={{textAlign:"left"}}>{t('events.team')}</th>
                        <th>{t('events.weight')}</th>
                        <th>M</th>
                    </tr>
                    </thead>
                    <tbody>
                    {printMatches?.map((participant:any, index:number) => {
                        const betting_amount = getParticipantBettingAmount(participant, event);

                        return (<tr style={{borderBottom: "1px solid black", lineHeight: "14px"}}>
                            <td style={{textAlign:"center", fontWeight: "bold", verticalAlign: "top"}}><p style={{margin: "5px 0"}}>#{participant.cage}</p></td>
                            <td style={{textAlign:"left", verticalAlign: "top"}}>
                                <p style={{fontWeight: "bold", margin: "5px 0", verticalAlign: "top", display: "inline-block"}}>{participant.team?.name}</p>
                                <p style={{margin: "5px 0", textTransform: "capitalize"}}>{participant.color} {participant.cresta}</p>
                                {participant.physical_advantage !== "none" && <p  style={{margin: "5px 0", textTransform: "capitalize"}}>Ven: {participant.physical_advantage}</p>}
                                {participant.status === "rejected" && <div style={{maxWidth: "40mm"}}>
                                    <p style={{ background: "black", color: "white", fontWeight:"bold", padding:"2px 5px"}}>{t('events.rejected')}</p>
                                    <p>{t('events.rejected_hint')}</p>
                                </div>}
                            </td>
                            <td style={{textAlign:"center", verticalAlign: "top"}}>
                                <p style={{margin: "5px 0", verticalAlign: "top", fontWeight: "bold"}}>{formatOzToLbsOz(participant.weight)}</p>
                                <p style={{margin: "5px 0"}}>{betting_amount}</p>
                                <p style={{margin: "5px 0"}}>{participant.participated_before ? "Peliado" : "Sin Pelear"}</p>
                            </td>
                            <td style={{textAlign:"center", verticalAlign: "top", fontWeight: "bold"}}><p style={{margin: "5px 0"}}>{participant.type}</p></td>
                        </tr>);}
                    ) }
                    </tbody>
                </table>
                <p style={{ fontSize: "16px", textAlign: "center", fontWeight: "bold", borderTop: "1px dashed black", padding: "10px"}}>gallosclub.com</p>
            </>}
        </div>
    </>);
});

export default PrintMatches;
