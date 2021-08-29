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

import './Menu.css';

interface AppPage {
    title: string;
    url: string;
    props?: {
        className?: string;
        onClick?: () => void;
    }
}

const Menu: React.FC = () => {
    const {state, dispatch} = useContext(AppContext);
    const [disabled, setDisabled] = useState(true);

    const appPages: AppPage[] = [
        {
            title: 'Events',
            url: '/',
        },
        {
            title: 'Contact Us',
            url: '/contact'
        },
        {
            title: 'Log Out',
            url: '/auth_admin', // or /auth if user is not admin, implement later when implementing user role
            props: {
                className: "logout-button",
                onClick: () => {
                    dispatch({
                        type: 'resetUser',
                    });
                }
            }
        },
    ];

    // We can't disable the menu as soon as the user is unset because that crashes the menu, we must wait for onIonDidClose and then disable it
    // Then, once the user is set, we enable the menu
    useEffect(() => {
        if (state.user?.id) setDisabled(false);
    }, [state.user?.id]);

    return (
        <IonMenu disabled={disabled} contentId="main" menuId="sidebar" type="overlay" onIonDidClose={() => {if (!state.user?.id) setDisabled(true)}}>
            <IonContent>
                <IonList id="main-menu">
                    {state.user?.id && <IonMenuToggle key="menu_profile" autoHide={false}>
                         <ProfileWidget/>
                    </IonMenuToggle>}
                    {appPages.map((appPage, index) => {
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
