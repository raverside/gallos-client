import React from "react";
import './ShareTeamOwner.css';

const ShareTeamOwner = React.forwardRef<any, any>(({teamOwner}, ref) => {

    return (
            <div ref={ref} className="team_owner_card">
                <div>
                    <div className="team_owner_card-name">{teamOwner?.name}</div>
                    {teamOwner?.country && <div className="team_owner_card-location"><span className="location_marker"/>{teamOwner?.country}, {teamOwner?.city || teamOwner?.state}</div>}
                </div>
                <div>
                    {teamOwner?.digital_id && <div className="team_owner_card-id"><span className="cherryred">ID:</span> {(""+teamOwner.digital_id).substr(0, 3)+"-"+(""+teamOwner.digital_id).substr(3, 3)+"-"+(""+teamOwner.digital_id).substr(6, 9)}</div>}
                    <div className="team_owner_card-website"><span className="globe"/>gallosclub.com</div>
                </div>
            </div>
        );
});

export default ShareTeamOwner;
