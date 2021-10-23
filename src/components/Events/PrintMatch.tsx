import React from "react";

const PrintMatch = React.forwardRef<any, any>(({event, match}, ref) => {

    return ((!event || !match) ? null : <>
        <div ref={ref} style={{textAlign:"center"}}>
            <h1>{event.title || event.stadium_name}</h1>
            <div style={{width: "350px", margin: "auto"}}>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.type}</div>
                    <div style={{textAlign: "center", width: "150px"}}>Marcaje</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.type}</div>
                </div>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.weight} lbs</div>
                    <div style={{textAlign: "center", width: "150px"}}>Weight</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.weight} lbs</div>
                </div>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.color}</div>
                    <div style={{textAlign: "center", width: "150px"}}>Color</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.color}</div>
                </div>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.alas}</div>
                    <div style={{textAlign: "center", width: "150px"}}>Alas</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.alas}</div>
                </div>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.cresta}</div>
                    <div style={{textAlign: "center", width: "150px"}}>Cresta</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.cresta}</div>
                </div>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.pata}</div>
                    <div style={{textAlign: "center", width: "150px"}}>Patas</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.pata}</div>
                </div>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.physical_advantage?.replace('_', ' ')}</div>
                    <div style={{textAlign: "center", width: "150px"}}>Advantage</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.physical_advantage.replace('_', ' ')}</div>
                </div>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.participated_before ? "Yes" : "No"}</div>
                    <div style={{textAlign: "center", width: "150px"}}>Participated?</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.participated_before ? "Yes" : "No"}</div>
                </div>
                <div style={{display:"flex", justifyContent: "center"}}>
                    <div style={{textAlign: "right"}}>{match.participant?.breeder_name}</div>
                    <div style={{textAlign: "center", width: "150px"}}>Breeder</div>
                    <div style={{textAlign: "left"}}>{match.opponent?.breeder_name}</div>
                </div>
            </div>
        </div>
    </>);
});

export default PrintMatch;
