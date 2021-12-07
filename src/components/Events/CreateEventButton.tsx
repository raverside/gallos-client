import {IonFab, IonFabButton, IonFabList, IonIcon, IonBackdrop, IonModal} from '@ionic/react';
import {addOutline as addIcon} from 'ionicons/icons';
import React, {useState, useRef} from "react";

import './EventEditor.css';
import {useTranslation} from "react-multi-lang";

type EventButtonProps = {
    showEventEditor: (mode:number|boolean) => void;
};

const CreateEventButton: React.FC<EventButtonProps> = ({showEventEditor}) => {
    const t = useTranslation();
    const [showBackdrop, setShowBackdrop] = useState(false);
    const fabRef = useRef<HTMLIonFabElement>(null);

    const showCreateEvent = (isSpecial:boolean = false) => {
        setShowBackdrop(false);
        showEventEditor(isSpecial ? 1 : 2); // 1 - special, 2 - regular
    }

    return (<>
        {showBackdrop && <IonBackdrop style={{position:'fixed'}} tappable onIonBackdropTap={() => {setShowBackdrop(false); fabRef.current?.close()}} />}
        <IonFab ref={fabRef} vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton type="button" onClick={() => setShowBackdrop(!showBackdrop)}>
                <IonIcon icon={addIcon} />
            </IonFabButton>
            <IonFabList side="top">
                <IonFabButton type="button" className="create-event-button" onClick={() => showCreateEvent(true)}>{t('events.special_event')}</IonFabButton>
                <IonFabButton type="button" className="create-event-button" onClick={() => showCreateEvent()}>{t('events.regular_event')}</IonFabButton>
            </IonFabList>
        </IonFab>
    </>);
};

export default CreateEventButton;
