import ActivityDashboard from "features/activities/dashboard/ActivityDashboard";
import ActivityForm from "features/activities/form/ActivityForm";
import Home from "features/home/Home";
import NavBar from "features/nav/NavBar";
import React from "react";
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

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Route path="/" exact component={Home} />
      <Route
        path="/(.+)"
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route path="/activities" exact component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                  key={location.key}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>{" "}
          </>
        )}
      />
    </>
  );
};
export default withRouter(App);
