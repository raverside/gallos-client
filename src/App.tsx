import React, {Suspense} from 'react';
import {IonApp, IonRouterOutlet, setupConfig} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {Route, Redirect} from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Events from './pages/Events';
import EventView from './pages/EventView';
import EventReceiving from './pages/EventReceiving';
import Baloteo from './pages/Baloteo';
import BaloteoStats from './pages/BaloteoStats';
import Stadiums from './pages/Stadiums';
import StadiumView from './pages/StadiumView';
import TeamOwners from './pages/TeamOwners';
import TeamOwner from './pages/TeamOwner';
import Memberships from './pages/Memberships';
import Transactions from './pages/Transactions';
import Contact from './pages/Contact';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import Auth from './pages/Auth/Auth';
import AuthAdmin from './pages/Auth/AuthAdmin';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPasscode from './pages/Auth/ForgotPasscode';
import {AppContext, AppContextProvider} from './State';
import {useContext} from "react";
import AutoRelogin from './AutoRelogin';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global-styles.css';

/* Lazy load modules */
const Judge = React.lazy( () => import('./pages/Judge'));
const JudgeMatch = React.lazy( () => import('./pages/JudgeMatch'));
const JudgeMatchTimer = React.lazy( () => import('./pages/JudgeMatchTimer'));

setupConfig({mode: 'md'});

const App: React.FC = () => {

    return (
        <IonApp>
            <AppContextProvider>
                <IonReactRouter>
                    <AutoRelogin>
                        <Menu/>
                        <IonRouterOutlet id="main">

                            <Route path="/auth" exact>
                                <Auth/>
                            </Route>
                            <Route path="/login" exact>
                                <Login/>
                            </Route>
                            <Route path="/register" exact>
                                <Register/>
                            </Route>
                            <Route path="/forgot_passcode" exact>
                                <ForgotPasscode/>
                            </Route>
                            <Route path="/auth_admin" exact>
                                <AuthAdmin/>
                            </Route>

                            <PrivateRoute path="/" exact admin>
                                <Events/>
                            </PrivateRoute>
                            <PrivateRoute path="/events" exact admin>
                                <Events/>
                            </PrivateRoute>
                            <PrivateRoute path="/event/:id" admin>
                                <EventView/>
                            </PrivateRoute>
                            <PrivateRoute path="/event_receiving/:id" admin>
                                <EventReceiving/>
                            </PrivateRoute>
                            <PrivateRoute path="/baloteo/:id" admin>
                                <Baloteo/>
                            </PrivateRoute>
                            <PrivateRoute path="/baloteo_stats/:id" admin>
                                <BaloteoStats/>
                            </PrivateRoute>
                            <PrivateRoute path="/stadiums" exact admin>
                                <Stadiums/>
                            </PrivateRoute>
                            <PrivateRoute path="/stadium/:id" admin>
                                <StadiumView />
                            </PrivateRoute>
                            <PrivateRoute path="/team_owners" exact admin>
                                <TeamOwners />
                            </PrivateRoute>
                            <PrivateRoute path="/team_owner/:id" exact admin>
                                <TeamOwner />
                            </PrivateRoute>
                            <PrivateRoute path="/memberships" exact admin>
                                <Memberships/>
                            </PrivateRoute>
                            <PrivateRoute path="/users" exact admin>
                                <Users/>
                            </PrivateRoute>
                            <PrivateRoute path="/user/:id" admin>
                                <UserProfile />
                            </PrivateRoute>
                            <PrivateRoute path="/contact" exact admin>
                                <Contact/>
                            </PrivateRoute>
                            <PrivateRoute path="/judge" exact admin>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Judge />
                                </Suspense>
                            </PrivateRoute>
                            <PrivateRoute path="/judge/:event_id/:match_id/" admin>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <JudgeMatch />
                                </Suspense>
                            </PrivateRoute>
                            <PrivateRoute path="/match/:event_id/:match_id/" admin>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <JudgeMatchTimer />
                                </Suspense>
                            </PrivateRoute>
                            <PrivateRoute path="/transactions" admin>
                                <Transactions />
                            </PrivateRoute>
                        </IonRouterOutlet>
                    </AutoRelogin>
                </IonReactRouter>
            </AppContextProvider>
        </IonApp>
    );
};

type RouteComponent = {
    path: string;
    exact?: boolean;
    admin?: boolean;
};
const PrivateRoute: React.FC<RouteComponent> = ({ admin = false, children, ...rest }) => {
    const {state} = useContext(AppContext);

    return <Route {...rest}>{state.user?.id ? children : <>{children}<Redirect to={admin ? "/auth_admin" : "/auth"} /></>}</Route>
}

export default App;
