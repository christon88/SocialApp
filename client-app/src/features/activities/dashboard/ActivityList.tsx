import React, { useContext } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "app/stores/activityStore";
import ActivityListItem from "./ActivityListItem";

const ActivityList = () => {
  const activityStore = useContext(ActivityStore);
  const { sortedActivities: activities } = activityStore;
  return (
    <>
      {activities.map(([group, activities]) => (
        <React.Fragment key={group}>
          <Label sixze="large" color="blue">
            {group}
          </Label>
          <Item.Group divided>
            {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </React.Fragment>
      ))}
    </>
  );
};

export default observer(ActivityList);
