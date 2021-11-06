import React from "react";
import moment from "moment";
import {formatOzToLbsOz} from "../utils";

const PrintMatch = React.forwardRef<any, any>(({event, match}, ref) => {

    return ((!event || !match) ? null : <>
        <div ref={ref} style={{textAlign:"center", width: "80mm", fontSize: "14px"}}>
            <h1 style={{width: "100%", textAlign:"center", fontSize: "16px", fontWeight: "bold"}}>{event.stadium_name}</h1>
            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", margin: "0 0 20px 0"}}>{event.title || "Traditional Event"}</h2>
            <div style={{display:"flex", justifyContent: "space-between", borderBottom: "1px solid black"}}>
                <div>Date: {moment().format('YYYY-MM-DD')}</div>
                <div>Time: {moment().format("HH:mm")}</div>
            </div>
            <h2 style={{width: "100%", textAlign:"center", fontSize: "14px", fontWeight: "bold"}}>Individual Match</h2>
            <div style={{width: "100%"}}>
                <div>
                    <div style={{display:"flex", justifyContent: "space-between", background: "black", color:"white"}}>
                        <div style={{textAlign: "center", width: "25mm"}}>Pelea #1</div>
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
                </div>
            </div>
            <p style={{ fontSize: "16px", textAlign: "center", fontWeight: "bold", borderTop: "1px dashed black", padding: "10px"}}>gallosclub.com</p>
        </div>
    </>);
});

export default PrintMatch;
