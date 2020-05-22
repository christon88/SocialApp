import ActivityDashboard from "features/activities/dashboard/ActivityDashboard";
import ActivityForm from "features/activities/form/ActivityForm";
import Home from "features/home/Home";
import NavBar from "features/nav/NavBar";
import React, { useContext } from "react";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import { Container } from "semantic-ui-react";
import ActivityStore from "../stores/activityStore";
import LoadingComponent from "./LoadingComponent";
import ActivityDetails from "features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const activityStore = useContext(ActivityStore);
  const { loading } = activityStore;

  if (loading) {
    return <LoadingComponent content="Loading activities..." />;
  } else {
    return (
      <>
        <Route path="/" exact component={Home} />
        <Route
          path="/(.+)"
          render={() => (
            <>
              <NavBar />
              <Container style={{ marginTop: "7em" }}>
                <Route path="/activities" exact component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                  key={location.key}
                />
              </Container>{" "}
            </>
          )}
        />
      </>
    );
  }
};

export default withRouter(App);
