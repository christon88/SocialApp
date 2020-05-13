import React from "react";
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
  deleteActivity: (id: string) => void;
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
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
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
          />
        )}
      </Grid.Column>
    </Grid>
  );
};
export default ActivityDashboard;
