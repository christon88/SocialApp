import React, { useEffect, useContext } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";
import { RootStoreContext } from "app/stores/rootStore";

const ActivityDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    initialLoading,
    activities,
  } = rootStore.activityStore;

  useEffect(() => {
    if (activities.length === 0) {
      loadActivities();
    }
  }, [loadActivities, activities.length]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {initialLoading ? <ActivityListItemPlaceholder /> : <ActivityList />}
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Placeholder Filters</h2>
      </Grid.Column>
    </Grid>
  );
};
export default observer(ActivityDashboard);
