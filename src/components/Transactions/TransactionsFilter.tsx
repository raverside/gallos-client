import {
    IonText,
    IonList,
    IonItem,
    IonButton,
    IonLabel,
    IonSelect, IonSelectOption, IonModal, IonSearchbar, IonIcon
} from '@ionic/react';
import React, {useState} from 'react';

import './TransactionsFilter.css';
import {filter as filterIcon} from "ionicons/icons";

type FilterProps = {
    filter: any;
    setFilter: (filter:any) => void;
    search: string;
    setSearch: (search:string) => void;
    updateFilter: (search:any, filter:any) => void;
};

const TransactionsFilter: React.FC<FilterProps> = ({filter, setFilter, search, setSearch, updateFilter}) => {
    const [type, setType] = useState<string>(filter.type || "");
    const [sort, setSort] = useState<string>(filter.sort || "az");
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);


    const clear = () => {
        setType("");
        setSort("az");
    }

    const Submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData);

        setFilter(formEntries);
        setShowFilterModal(false);
        updateFilter(search, filter);
    }

    return (<>
        <div className="search-filter-block">
            <IonSearchbar className="searchbar" placeholder="Search" value={search} onIonChange={e => {setSearch(e.detail.value!); updateFilter(e.detail.value!, filter);}} />
            <IonButton fill="clear" onClick={() => setShowFilterModal(!showFilterModal)}>
                <IonIcon icon={filterIcon} color="dark" />
            </IonButton>
        </div>
        <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
            <form className="users-filter-form" onSubmit={Submit}>
                <div className="users-filter-wrapper">
                    <div className="users-filter-header">
                        <IonButton fill="clear" onClick={clear}>Clear</IonButton>
                        <IonText>Filter and Sort</IonText>
                        <IonButton fill="clear" onClick={() => setShowFilterModal(false)}>Cancel</IonButton>
                    </div>
                    <IonList>
                        <IonLabel>Payment Method</IonLabel>
                        <IonItem lines="none">
                            <IonSelect interface="action-sheet" name="type" value={type} onIonChange={(e) => setType(e.detail.value)} placeholder="Select payment method">
                                <IonSelectOption value="cash">Cash</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonLabel>Sort By</IonLabel>
                        <IonItem lines="none">
                            <IonSelect interface="action-sheet" name="sort" value={sort} onIonChange={(e) => setSort(e.detail.value)}>
                                <IonSelectOption value="az">Newest to Oldest</IonSelectOption>
                                <IonSelectOption value="za">Oldest to Newest</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonList>
                </div>
                <IonButton expand="block" type="submit">Apply</IonButton>
            </form>
        </IonModal>
    </>);
};

export default TransactionsFilter;
