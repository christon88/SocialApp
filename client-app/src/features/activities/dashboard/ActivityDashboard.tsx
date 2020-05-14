import React, { SyntheticEvent } from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
  activities: Activity[];
  selectActivity: (id: string) => void;
  setSelectedActivity: (activity: Activity | null) => void;
  selectedActivity: Activity | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  createActivity: (activity: Activity) => void;
  editActivity: (activity: Activity) => void;
  deleteActivity: (
    event: SyntheticEvent<HTMLButtonElement, Event>,
    id: string
  ) => void;
  submitting: string | null;
}

const ActivityDashboard: React.FC<Props> = ({
  activities,
  selectActivity,
  setSelectedActivity,
  selectedActivity,
  editMode,
  setEditMode,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
          submitting={submitting}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            setEditMode={setEditMode}
          />
        )}
        {editMode && (
          <ActivityForm
            key={selectedActivity?.id || 0}
            initialActivity={selectedActivity}
            setEditMode={setEditMode}
            createActivity={createActivity}
            editActivity={editActivity}
            submitting={submitting}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};
export default ActivityDashboard;
