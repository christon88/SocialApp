import React from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
//import ActivityStore from "app/stores/activityStore";
import { observer } from "mobx-react-lite";

const ActivityDashboard = () => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Placeholder Filters</h2>
      </Grid.Column>
    </Grid>
  );
};
export default observer(ActivityDashboard);
