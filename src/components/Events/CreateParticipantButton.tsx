import {IonFab, IonFabButton, IonIcon} from '@ionic/react';
import {addOutline as addIcon} from 'ionicons/icons';

type EventButtonProps = {
    showParticipantEditor: () => void;
};

const CreateParticipantButton: React.FC<EventButtonProps> = ({showParticipantEditor}) => {
    const showCreateParticipant = () => {
        showParticipantEditor();
    }

    return (<>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton type="button" onClick={() => showCreateParticipant()}>
                <IonIcon icon={addIcon} />
            </IonFabButton>
        </IonFab>
    </>);
};

export default CreateParticipantButton;
