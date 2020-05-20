import React, { useContext, useEffect } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "app/stores/activityStore";
import { RouteComponentProps, Link } from "react-router-dom";
import LoadingComponent from "app/layout/LoadingComponent";

interface RouteParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<RouteParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const { selectedActivity: activity, loadActivity, loading } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loading) {
    return <LoadingComponent>Loading...</LoadingComponent>;
  }

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
              onClick={() => history.push("/activities")}
            />
            <Button
              basic
              color="blue"
              content="Edit"
              as={Link}
              to={`/manage/${activity.id}`}
            />
          </Button.Group>
        </Card.Content>
      </Card>
    )
  );
};

export default observer(ActivityDetails);
