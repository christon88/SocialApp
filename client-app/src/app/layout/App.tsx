import ActivityDashboard from "features/activities/dashboard/ActivityDashboard";
import ActivityForm from "features/activities/form/ActivityForm";
import Home from "features/home/Home";
import NavBar from "features/nav/NavBar";
import ProfilePage from "features/profiles/ProfilePage";
import React, { useContext, useEffect } from "react";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import { Container } from "semantic-ui-react";
import ActivityDetails from "features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import { RootStoreContext } from "app/stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import PrivateRoute from "./PrivateRoute";
import ModalContainer from "../common/modals/ModalContainer";
import { observer } from "mobx-react-lite";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { getUser } = rootStore.userStore;
  const { appLoaded, setAppLoaded, token } = rootStore.commonStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded(true));
    } else {
      setAppLoaded(true);
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) return <LoadingComponent content="Loading..." />;

  return (
    <>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route path="/" exact component={Home} />
      <Route
        path="/(.+)"
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <PrivateRoute
                  path="/activities"
                  exact
                  component={ActivityDashboard}
                />
                <PrivateRoute
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <PrivateRoute
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                  key={location.key}
                />
                <PrivateRoute
                  path="/profile/:username"
                  component={ProfilePage}
                />
                <PrivateRoute component={NotFound} />
              </Switch>
            </Container>{" "}
          </>
        )}
      />
    </>
  );
};
export default withRouter(observer(App));
