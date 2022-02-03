import {
    IonButton,
    IonContent, IonIcon, IonModal,
    IonPage, IonRefresher, IonRefresherContent, IonSearchbar,
} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useContext, useEffect, useState} from "react";
import {getStadiums} from "../api/Stadiums";

import './Stadiums.css';
import StadiumsFilter from "../components/Stadiums/StadiumsFilter";
import {filter as filterIcon} from "ionicons/icons";
import StadiumsList from "../components/Stadiums/StadiumsList";
import {useTranslation} from "react-multi-lang";
import {AppContext} from "../State";
import StadiumEditor from "../components/Stadiums/StadiumEditor";

const Stadiums: React.FC = () => {
    const t = useTranslation();
    const { state } = useContext(AppContext);
    const [stadiums, setStadiums] = useState<Array<{id:string}>>([]);
    const [stadiumsSearch, setStadiumsSearch] = useState<string>("");
    const [stadiumsFilter, setStadiumsFilter] = useState<any>({});
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [showStadiumEditor, setShowStadiumEditor] = useState<any>(false);

    useEffect(() => {
        fetchStadiums();
    }, []);

    const fetchStadiums = async (filter = filterQuery, callback = () => {}) => {
        const response = await getStadiums(filter, 0);
        if (response.stadiums) {
            setStadiums(response.stadiums);
        };
        callback();
    }

    const updateFilter = (search = stadiumsSearch, filter = stadiumsFilter) => {
        let filterQuery = "";
        if (search) {
            filterQuery += "&search="+search;
        }
        if (filter.country) {
            filterQuery += "&country="+filter.country;
        }
        if (filter.state) {
            filterQuery += "&state="+filter.state;
        }
        if (filter.city) {
            filterQuery += "&city="+filter.city;
        }
        if (filter.membership) {
            filterQuery += "&membership="+filter.membership;
        }
        if (filter.sort) {
            filterQuery += "&sort="+filter.sort;
        }
        setFilterQuery(filterQuery);
        fetchStadiums(filterQuery);
    }

    return (
        <IonPage>
            <Header title={t('stadiums.header')} isRed={false} notifications={false} addButton={state.user?.role === "admin" ? () => setShowStadiumEditor(true) : undefined}/>

            <IonContent fullscreen>
                <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
                    <StadiumsFilter filter={stadiumsFilter} setFilter={(filter) => {setStadiumsFilter(filter); updateFilter(stadiumsSearch, filter)}} close={() => setShowFilterModal(false)}/>
                </IonModal>
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchStadiums(filterQuery, e.detail.complete)}><IonRefresherContent /></IonRefresher>
                <div className="search-filter-block">
                    <IonSearchbar className="searchbar" placeholder={t('stadiums.search')} value={stadiumsSearch} onIonChange={e => {setStadiumsSearch(e.detail.value!); updateFilter(e.detail.value!);}} />
                    <IonButton fill="clear" onClick={() => setShowFilterModal(!showFilterModal)}>
                        <IonIcon icon={filterIcon} color="dark" />
                    </IonButton>
                </div>
                <StadiumsList stadiums={stadiums} />
                <IonModal isOpen={!!showStadiumEditor} onDidDismiss={() => setShowStadiumEditor(false)}>
                    <StadiumEditor
                        fetchStadiums={fetchStadiums}
                        stadium={(showStadiumEditor && showStadiumEditor !== true) ? showStadiumEditor : false}
                        close={() => setShowStadiumEditor(false)}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Stadiums;
