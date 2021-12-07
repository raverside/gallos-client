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
import {useTranslation} from "react-multi-lang";

type FilterProps = {
    filter: any;
    setFilter: (filter:any) => void;
    search: string;
    setSearch: (search:string) => void;
    updateFilter: (search:any, filter:any) => void;
};

const TransactionsFilter: React.FC<FilterProps> = ({filter, setFilter, search, setSearch, updateFilter}) => {
    const t = useTranslation();
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
            <IonSearchbar className="searchbar" placeholder={t('transactions.search')} value={search} onIonChange={e => {setSearch(e.detail.value!); updateFilter(e.detail.value!, filter);}} />
            <IonButton fill="clear" onClick={() => setShowFilterModal(!showFilterModal)}>
                <IonIcon icon={filterIcon} color="dark" />
            </IonButton>
        </div>
        <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
            <form className="users-filter-form" onSubmit={Submit}>
                <div className="users-filter-wrapper">
                    <div className="users-filter-header">
                        <IonButton fill="clear" onClick={clear}>{t('transactions.filter_clear')}</IonButton>
                        <IonText>{t('transactions.filter_header')}</IonText>
                        <IonButton fill="clear" onClick={() => setShowFilterModal(false)}>{t('transactions.filter_cancel')}</IonButton>
                    </div>
                    <IonList>
                        <IonLabel>{t('transactions.payment_method')}</IonLabel>
                        <IonItem lines="none">
                            <IonSelect interface="alert" name="type" value={type} onIonChange={(e) => setType(e.detail.value)} placeholder={t('transactions.payment_method')}>
                                <IonSelectOption value="cash">{t('transactions.cash')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonLabel>{t('general.filter_sort')}</IonLabel>
                        <IonItem lines="none">
                            <IonSelect interface="alert" name="sort" value={sort} onIonChange={(e) => setSort(e.detail.value)}>
                                <IonSelectOption value="az">{t('general.filter_sort_newest')}</IonSelectOption>
                                <IonSelectOption value="za">{t('general.filter_sort_oldest')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonList>
                </div>
                <IonButton expand="block" type="submit">{t('general.filter_apply')}</IonButton>
            </form>
        </IonModal>
    </>);
};

export default TransactionsFilter;
