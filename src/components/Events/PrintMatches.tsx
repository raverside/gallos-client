import React from "react";

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

    return (!event ? null : <>
        <div ref={ref} style={{textAlign:"center"}}>
            <h1>{event.title || event.stadium_name}</h1>
            <h2>{title}</h2>
            {(mode == 1 || mode === 2) ? <table style={{width: "100%", fontSize: "20px"}}>
                <thead>
                    <tr>
                        <th style={{border:"1px solid black"}}>#</th>
                        <th style={{border:"1px solid black"}}>Team</th>
                        <th style={{border:"1px solid black"}}>Marcaje</th>
                        <th style={{border:"1px solid black"}}>Weight</th>
                        <th style={{border:"1px solid black"}}>Color</th>
                        <th style={{border:"1px solid black", color:"white"}}> -VS- </th>
                        <th style={{border:"1px solid black"}}>Team</th>
                        <th style={{border:"1px solid black"}}>Marcaje</th>
                        <th style={{border:"1px solid black"}}>Weight</th>
                        <th style={{border:"1px solid black"}}>Color</th>
                    </tr>
                </thead>
                <tbody>
                    {printMatches?.map((match:any, index:number) =>
                        <tr>
                            <td style={{textAlign:"center"}}>{index + 1}</td>
                            <td style={{textAlign:"center"}}>{match?.participant?.team?.name}</td>
                            <td style={{textAlign:"center"}}>{match?.participant?.type}</td>
                            <td style={{textAlign:"center"}}>{match?.participant?.weight}</td>
                            <td style={{textAlign:"center"}}>{match?.participant?.color}</td>
                            <td style={{textAlign:"center"}}> -VS- </td>
                            <td style={{textAlign:"center"}}>{match?.opponent?.team?.name}</td>
                            <td style={{textAlign:"center"}}>{match?.opponent?.type}</td>
                            <td style={{textAlign:"center"}}>{match?.opponent?.weight}</td>
                            <td style={{textAlign:"center"}}>{match?.opponent?.color}</td>
                        </tr>
                    ) }
                </tbody>
            </table> : <table style={{width: "100%", fontSize: "20px"}}>
                <thead>
                <tr>
                    <th style={{border:"1px solid black"}}>#</th>
                    <th style={{border:"1px solid black"}}>Team</th>
                    <th style={{border:"1px solid black"}}>Marcaje</th>
                    <th style={{border:"1px solid black"}}>Weight</th>
                    <th style={{border:"1px solid black"}}>Color</th>
                    <th style={{border:"1px solid black"}}>Alas</th>
                    <th style={{border:"1px solid black"}}>Cresta</th>
                    <th style={{border:"1px solid black"}}>Patas</th>
                    <th style={{border:"1px solid black"}}>Advantage</th>
                    <th style={{border:"1px solid black"}}>Participated?</th>
                    <th style={{border:"1px solid black"}}>Breeder</th>
                </tr>
                </thead>
                <tbody>
                {printMatches?.map((participant:any, index:number) =>
                    <tr>
                        <td style={{textAlign:"center"}}>{index + 1}</td>
                        <td style={{textAlign:"center"}}>{participant.team?.name}</td>
                        <td style={{textAlign:"center"}}>{participant.type}</td>
                        <td style={{textAlign:"center"}}>{participant.weight}</td>
                        <td style={{textAlign:"center"}}>{participant.color}</td>
                        <td style={{textAlign:"center"}}>{participant.alas}</td>
                        <td style={{textAlign:"center"}}>{participant.cresta}</td>
                        <td style={{textAlign:"center"}}>{participant.pata}</td>
                        <td style={{textAlign:"center"}}>{participant.physical_advantage}</td>
                        <td style={{textAlign:"center"}}>{participant.participated_before ? "Yes" : "No"}</td>
                        <td style={{textAlign:"center"}}>{participant.breeder_name}</td>
                    </tr>
                ) }
                </tbody>
            </table>}
        </div>
    </>);
});

export default PrintMatches;
