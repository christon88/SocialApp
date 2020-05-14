import React, { useState, useEffect, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

const App = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(
      activities.find((activity) => activity.id === id) || null
    );
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: Activity) => {
    setSubmitting("formSubmit");
    agent.Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => setSubmitting(null));
  };

  const handleDeleteActivity = (
    event: SyntheticEvent<HTMLButtonElement, Event>,
    id: string
  ) => {
    setSubmitting(event.currentTarget.name);
    console.log(event.currentTarget);
    console.log(submitting);

    agent.Activities.delete(id)
      .then(() =>
        setActivities(activities.filter((activity) => activity.id !== id))
      )
      .then(() => setSubmitting(null));
  };

  const handleEditActivity = (updatedActivity: Activity) => {
    setSubmitting("formSubmit");
    agent.Activities.update(updatedActivity)
      .then(() => {
        setActivities([
          ...activities.filter(
            (activity) => activity.id !== updatedActivity.id
          ),
          updatedActivity,
        ]);
        setSelectedActivity(updatedActivity);
        setEditMode(false);
      })
      .then(() => setSubmitting(null));
  };

  useEffect(() => {
    agent.Activities.list()
      .then((response) => {
        const activities = response.map((activity) => {
          const dateTime = activity.date.split(".")[0];
          const date = dateTime.split("T")[0];
          const time = dateTime.split("T")[1];
          return { ...activity, date: date, time: time };
        });
        setActivities(activities);
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingComponent content="Loading activities..." />;
  } else {
    return (
      <>
        <NavBar openCreateForm={handleOpenCreateForm} />
        <Container>
          <ActivityDashboard
            activities={activities}
            selectActivity={handleSelectActivity}
            selectedActivity={selectedActivity}
            editMode={editMode}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
            createActivity={handleCreateActivity}
            editActivity={handleEditActivity}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
          />
        </Container>
      </>
    );
  }
};

export default App;
