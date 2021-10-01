import {useContext} from "react";
import {AppContext} from "../../State";

interface AppPage {
    title: string;
    url: string;
    props?: {
        className?: string;
        onClick?: () => void;
    }
}

const MenuPermissions = () => {
    const {dispatch} = useContext(AppContext);
    const appPages: { [key: string]: AppPage[] } = {};

    appPages["user"] = [
        {title: 'Home', url: '/'},
        {title: 'Membership', url: '/membership'},
        {title: 'Contact Us', url: '/contact'},
        {
            title: 'Log Out', url: '/auth_admin',
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

    appPages["creator"] = [
        {title: 'Events', url: '/'},
        {title: 'Contact Us', url: '/contact'},
        {
            title: 'Log Out', url: '/auth_admin',
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

    appPages["worker"] = [
        {title: 'Events', url: '/events'},
        {title: 'Teams', url: '/team_owners'},
        {title: 'Contact Us', url: '/contact'},
        {
            title: 'Log Out', url: '/auth_admin',
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

    appPages["admin_worker"] = [
        {title: 'Users', url: '/users'},
        {title: 'Events', url: '/events'},
        {title: 'Stadiums', url: '/stadiums'},
        {title: 'Team Owners', url: '/team_owners'},
        {title: 'Memberships', url: '/memberships'},
        {
            title: 'Log Out', url: '/auth_admin',
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

    return appPages;
};

export default MenuPermissions;
