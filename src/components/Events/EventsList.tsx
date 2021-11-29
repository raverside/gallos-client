import {
    IonCard,
    IonImg,
    IonList,
    IonItem,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonAvatar,
    IonRouterLink,
    IonText,
    IonIcon, useIonActionSheet
} from '@ionic/react';
import {getImageUrl} from '../utils';
import moment from 'moment';
import editIcon from '../../img/edit.png';
import arrowIcon from '../../img/arrow_forward.png';
import React, {useState} from 'react';

import './EventsList.css';
import {ellipsisHorizontal as menuIcon} from "ionicons/icons";

type EventsListProps = {
    events: Array<{}>;
    openEditor: (event:{}) => void
};

const EventsList: React.FC<EventsListProps> = ({events, openEditor}) => {
    const [fullDescription, setFullDescription] = useState<string|false>(false);
    const numberFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0});
    const [present, dismiss] = useIonActionSheet();

    return ((events.length > 0) ? <IonList className="eventsList">
        {events.map((event:any) => {
            const allBets = [event.bronze, event.silver_one, event.silver_two, event.gold_one, event.gold_two].filter(x => x !== null);
            const minBet = allBets.length > 0 ? Math.min(...allBets) : false;

            return <div key={event.id} className="event"><IonCard>
                <IonButton fill="clear" className="event-stadium" routerLink={"/stadium/"+event.stadium_id}>
                    <IonAvatar><IonImg src={getImageUrl(event.stadium_image)}/></IonAvatar>
                    <span>{event.stadium_name}</span>
                </IonButton>
                <IonButton fill="clear" color="dark" className="eventMenu" onClick={() => present({
                    buttons: [
                        { text: 'Edit', handler: () => {openEditor(event)} },
                    ],
                    header: 'Settings'
                })}><IonIcon size="small" icon={menuIcon} /></IonButton>
                <IonButton fill="clear" className="event-image" routerLink={"/event/"+event.id} ><IonImg src={event.is_special && event.image ? getImageUrl(event.image) : getImageUrl(event.stadium_image)} /></IonButton>
                <IonCardHeader>
                    <IonCardTitle>{(event.is_special && event.title) ? event.title : "Traditional Events"}</IonCardTitle>
                    <IonCardSubtitle>{moment(event.event_date).format("dddd, D MMMM YYYY")}</IonCardSubtitle>
                    <div className="event-info">
                        <div className="event-info_labels">
                            <div className="event-info_label">Receiving</div>
                            <div className="event-info_label">First Race</div>
                            {(event.type?.length > 0) && <div className="event-info_label">Marcaje</div>}
                            {(minBet > 0) && <div className="event-info_label">Bet</div>}
                        </div>
                        <div className="event-info_values">
                            <div className="event-info_value">{moment(event.receiving_time_start, "HH:mm").format("LT")} - {moment(event.receiving_time_end, "HH:mm").format("LT")}</div>
                            <div className="event-info_value">{moment(event.first_race_time, "HH:mm").format("LT")}</div>
                            {(event.type?.length > 0) && <div className="event-info_value">{event.type.join(', ')}</div>}
                            {(minBet > 0) && <div className="event-info_value red">
                                {event.bronze > 0 && ((event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.bronze))}
                                {(event.silver_one > 0 && (" | " + (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.silver_one)))}
                                {(event.silver_two > 0 && (" & " + numberFormatter.formatToParts(event.silver_two).find(x => x.type === "integer")?.value))}
                                {(event.gold_one > 0 && (" | " + (event.currency === "DOP" ? "RD" : "") + numberFormatter.format(event.gold_one)))}
                                {(event.gold_two > 0 && (" & " + numberFormatter.formatToParts(event.gold_two).find(x => x.type === "integer")?.value))}
                            </div>}
                        </div>
                    </div>
                </IonCardHeader>
                {event.description && <IonCardContent>
                    {(event.description.length < 90 || fullDescription === event.id) ?
                        <>{event.description} {fullDescription === event.id && <IonButton className="read-more-button" fill="clear" color="primary" type="button" onClick={() => setFullDescription(false)}>Read less</IonButton>}</> :
                        <>{event.description.substring(0, 90)}... <IonButton className="read-more-button" fill="clear" color="primary" type="button" onClick={() => setFullDescription(event.id)}>Read more</IonButton></>
                    }</IonCardContent>}
                <IonButton fill="clear" className="baloteoButton" routerLink={event.phase === "on going" ? "/baloteo_stats/"+event.id : event.phase === "arrangement" ? "/baloteo/"+event.id : "/event_receiving/"+event.id}>
                    <div className="ionButtonFix">
                        <IonText>{event.phase}</IonText>
                        <div>
                            <IonText>See Baloteo</IonText>
                            <IonImg src={arrowIcon} />
                        </div>
                    </div>
                </IonButton>
            </IonCard></div>
        })}
    </IonList> : <IonText className="empty-list">No Events Available</IonText>);
};

export default EventsList;
