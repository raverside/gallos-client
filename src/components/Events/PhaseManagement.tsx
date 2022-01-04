import {
    IonSegment, IonSegmentButton, IonLabel
} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import {changeEventPhase} from '../../api/Events';
import './DateFilter.css';
import {useTranslation} from "react-multi-lang";
import ConfirmPrompt from "../ConfirmPrompt";

type FilterProps = {
    event: any;
    setEvent: (event: any) => void;
};

const PhaseManagement: React.FC<FilterProps> = ({event, setEvent}) => {
    const t = useTranslation();
    const [showConfirmPhase, setShowConfirmPhase] = useState<string|false>(false);
    const [changePhaseState, setChangePhaseState] = useState<boolean>(false);

    useEffect(() => {
        if (changePhaseState && showConfirmPhase) {
            changePhase(showConfirmPhase);
            setChangePhaseState(false);
        }
    }, [changePhaseState]);

    const changePhase = async (phase:string) => {
        if (!event?.id || !phase) return false;
        const response = await changeEventPhase(event.id, phase);
        if (response.success) {
            setEvent((currentEvent:any) => ({...currentEvent, phase}));
        }
        setShowConfirmPhase(false);
    }

    return (<>
        <IonSegment className="events-tabs" value={event.phase} onIonChange={(e) => (event.phase && event.phase !== e.detail.value) && setShowConfirmPhase(e.detail.value!)}>
            <IonSegmentButton value="receiving">
                <IonLabel>{t('events.phase_receiving')}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="arrangement">
                <IonLabel>{t('events.phase_arrangement')}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="on going">
                <IonLabel>{t('events.phase_ongoing')}</IonLabel>
            </IonSegmentButton>
        </IonSegment>
        <ConfirmPrompt
            data={showConfirmPhase}
            show={!!showConfirmPhase}
            title={t('events.confirm_phase_change_title')}
            subtitle={t('events.confirm_phase_change_subtitle')}
            onResult={(data, isConfirmed) => {isConfirmed ? setChangePhaseState(true) : setShowConfirmPhase(false)}}
        />
    </>);
};

export default PhaseManagement;
