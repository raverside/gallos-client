import {
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
} from '@ionic/react';

import ProfileWidget from './ProfileWidget';
import {AppContext} from '../../State';
import {useState, useContext, useEffect} from "react";
import MenuPermissions from './MenuPermissions';

import './Menu.css';

const Menu: React.FC = () => {
    const {state} = useContext(AppContext);
    const [disabled, setDisabled] = useState(true);

    // We can't disable the menu as soon as the user is unset because that crashes the menu, we must wait for onIonDidClose and then disable it
    // Then, once the user is set, we enable the menu
    useEffect(() => {
        if (state.user?.id) setDisabled(false);
    }, [state.user?.id]);
    const role:string = state.user?.role || "user";

    return (
        <IonMenu disabled={disabled} contentId="main" menuId="sidebar" type="overlay" onIonDidClose={() => {if (!state.user?.id) setDisabled(true)}}>
            <IonContent>
                <IonList id="main-menu">
                    {state.user?.id && <IonMenuToggle key="menu_profile" autoHide={false}>
                         <ProfileWidget/>
                    </IonMenuToggle>}
                    {MenuPermissions()[role]?.map((appPage, index) => {
                        return (
                            <IonMenuToggle key={index} {...appPage.props}>
                                <IonItem routerLink={appPage.url} routerDirection="none" lines="none">
                                    <IonLabel>{appPage.title}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        );
                    })}
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
