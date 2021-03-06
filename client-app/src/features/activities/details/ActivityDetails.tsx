import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "app/layout/LoadingComponent";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import { RootStoreContext } from "app/stores/rootStore";

interface RouteParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<RouteParams>> = ({
  match,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    selectedActivity: activity,
    loadActivity,
    initialLoading,
  } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (initialLoading) {
    return <LoadingComponent>Loading...</LoadingComponent>;
  }

  if (!activity) {
    return <h2>Activity not found</h2>;
  }

  return (
    activity && (
      <Grid>
        <Grid.Column width={10}>
          <ActivityDetailedHeader activity={activity} />
          <ActivityDetailedInfo activity={activity} />
          <ActivityDetailedChat />
        </Grid.Column>
        <Grid.Column width={6}>
          <ActivityDetailedSidebar attendees={activity.attendees} />
        </Grid.Column>
      </Grid>
    )
  );
};

export default observer(ActivityDetails);
