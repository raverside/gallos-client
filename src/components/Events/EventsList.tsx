import {IonCard, IonImg, IonList, IonItem, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton} from '@ionic/react';
import {getImageUrl} from '../utils';
import moment from 'moment';
import editIcon from '../../img/edit.png';
import {useState} from 'react';

import './EventList.css';

type EventsListProps = {
    events: Array<{}>;
    openEditor: (event:{}) => void
};

const EventsList: React.FC<EventsListProps> = ({events, openEditor}) => {
    const [fullDescription, setFullDescription] = useState<string|false>(false);
    const USDFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0});
    const DOPFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'DOP', maximumFractionDigits: 0});

    return (<IonList className="eventsList">
        {events.map((event:any) => {
            const allBets = [event.bronze, event.silver_one, event.silver_two, event.gold_one, event.gold_two].filter(x => x !== null);
            const minBet = allBets.length > 0 ? Math.min(...allBets) : false;
            const maxBet = (allBets.length > 0 && Math.max(...allBets) > minBet) ? Math.max(...allBets) : false;

            return <IonItem key={event.id} lines="none" className="event"><IonCard>
                <IonImg src={event.is_special && event.image ? getImageUrl(event.image) : getImageUrl(event.stadium_image)}/>
                <IonCardHeader>
                    <IonCardTitle>{(event.is_special && event.title) ? event.title : event.stadium_name}</IonCardTitle>
                    <IonCardSubtitle>{moment(event.event_date).format("dddd, D MMMM YYYY")}</IonCardSubtitle>
                    <div className="event-info">
                        <div className="event-info_labels">
                            <div className="event-info_label">Receiving</div>
                            <div className="event-info_label">First Race</div>
                            {(minBet !== false && minBet >= 0) && <div className="event-info_label">Bet</div>}
                        </div>
                        <div className="event-info_values">
                            <div className="event-info_value">{moment(event.receiving_time_start, "HH:mm").format("LT")} - {moment(event.receiving_time_end, "HH:mm").format("LT")}</div>
                            <div className="event-info_value">{moment(event.first_race_time, "HH:mm").format("LT")}</div>
                            {(minBet !== false && minBet >= 0) && <div className="event-info_value red">
                                {(event.currency === 'DOP') ? DOPFormatter.format(minBet) : USDFormatter.format(minBet)} {(maxBet) && "• " + ((event.currency === 'DOP') ? DOPFormatter.format(maxBet) : USDFormatter.format(maxBet))}
                            </div>}
                        </div>
                    </div>
                </IonCardHeader>
                {event.description && <IonCardContent>
                    {(event.description.length < 90 || fullDescription === event.id) ?
                        <>{event.description} {fullDescription === event.id && <IonButton className="read-more-button" fill="clear" color="primary" type="button" onClick={() => setFullDescription(false)}>Read less</IonButton>}</> :
                        <>{event.description.substring(0, 90)}... <IonButton className="read-more-button" fill="clear" color="primary" type="button" onClick={() => setFullDescription(event.id)}>Read more</IonButton></>
                    }</IonCardContent>}
                <IonButton className="event-edit" fill="clear" onClick={() => {openEditor(event)}}>
                    <IonImg src={editIcon} />
                </IonButton>
            </IonCard></IonItem>
        })}
    </IonList>);
};

export default EventsList;
