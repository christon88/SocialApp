import React, { useContext, useEffect } from "react";
import { Tab, Grid, Header, Card } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileCard from "./ProfileCard";
import { observer } from "mobx-react-lite";

interface Props {
  predicate: "following" | "followers";
}

const ProfileFollowings: React.FC<Props> = ({ predicate }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    followings,
    loadFollowings,
    loadingFollow,
  } = rootStore.profileStore;

  useEffect(() => {
    loadFollowings(predicate);
  }, [loadFollowings, predicate]);

  return (
    <Tab.Pane loading={loadingFollow}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              predicate === "followers"
                ? `People following ${profile!.displayName}`
                : `People ${profile!.displayName} is following`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {followings.map((target) => (
              <ProfileCard key={target.username} profile={target} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);
