import React, { useContext } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "app/stores/activityStore";

const ActivityDetails = () => {
  const activityStore = useContext(ActivityStore);
  const {
    selectedActivity: activity,
    openEditForm,
    cancelSelectedActivity,
  } = activityStore;

  return (
    activity && (
      <Card fluid>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          wrapped
          ui={false}
        />
        <Card.Content>
          <Card.Header>{activity.title}</Card.Header>
          <Card.Meta>
            <span className="date">
              {activity.date} {activity.time}
            </span>
          </Card.Meta>
          <Card.Description>{activity.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button.Group widths={2}>
            <Button
              basic
              color="grey"
              content="Cancel"
              onClick={() => cancelSelectedActivity()}
            />
            <Button
              basic
              color="blue"
              content="Edit"
              onClick={() => openEditForm(activity.id)}
            />
          </Button.Group>
        </Card.Content>
      </Card>
    )
  );
};

export default observer(ActivityDetails);
