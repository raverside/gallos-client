import {
    IonButton,
    IonContent, IonIcon, IonModal,
    IonPage, IonRefresher, IonRefresherContent, IonSearchbar,

} from '@ionic/react';
import Header from '../components/Header/Header';
import React, {useEffect, useState} from "react";
import {getStadiums} from "../api/Stadiums";

import './Stadiums.css';
import StadiumsFilter from "../components/Stadiums/StadiumsFilter";
import {filter as filterIcon} from "ionicons/icons";
import StadiumsList from "../components/Stadiums/StadiumsList";

const Stadiums: React.FC = () => {
    const [stadiums, setStadiums] = useState<Array<{id:string}>>([]);
    const [stadiumsSearch, setStadiumsSearch] = useState<string>("");
    const [stadiumsFilter, setStadiumsFilter] = useState<any>({});
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

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
            <Header title="Stadiums" isRed={false} notifications={false}/>

            <IonContent fullscreen>
                <IonModal id="overlay-modal" isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
                    <StadiumsFilter filter={stadiumsFilter} setFilter={(filter) => {setStadiumsFilter(filter); updateFilter(stadiumsSearch, filter)}} close={() => setShowFilterModal(false)}/>
                </IonModal>
                <IonRefresher slot="fixed" onIonRefresh={(e) => fetchStadiums(filterQuery, e.detail.complete)}><IonRefresherContent /></IonRefresher>
                <div className="search-filter-block">
                    <IonSearchbar className="searchbar" placeholder="Search stadium name" value={stadiumsSearch} onIonChange={e => {setStadiumsSearch(e.detail.value!); updateFilter(e.detail.value!);}} />
                    <IonButton fill="clear" onClick={() => setShowFilterModal(!showFilterModal)}>
                        <IonIcon icon={filterIcon} color="dark" />
                    </IonButton>
                </div>
                <StadiumsList stadiums={stadiums} />
            </IonContent>
        </IonPage>
    );
};

export default Stadiums;
