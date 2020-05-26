import React, { useEffect, useContext } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import ActivityStore from "app/stores/activityStore";
import LoadingComponent from "app/layout/LoadingComponent";

const ActivityDashboard = () => {
  const activityStore = useContext(ActivityStore);
  const { loadActivities, loading, activities } = activityStore;

  useEffect(() => {
    if (activities.length === 0) {
      loadActivities();
    }
  }, [loadActivities, activities.length]);

  if (loading) return <LoadingComponent content="Loading activities..." />;

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
