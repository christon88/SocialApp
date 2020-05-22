import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import ActivityStore from "app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Activity } from "app/models/activity";

interface RouteParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<RouteParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    selectedActivity,
    createActivity,
    submitting,
    editActivity,
    clearActivity,
    loadActivity,
  } = activityStore;

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    console.log("mount");

    if (match.params.id && activity.id.length === 0) {
      console.log("loading activity");
      loadActivity(match.params.id).then(
        () => selectedActivity && setActivity(selectedActivity)
      );
    }
    return () => {
      console.log("unmount");
      clearActivity();
    };
  }, [
    loadActivity,
    match.params.id,
    selectedActivity,
    clearActivity,
    activity.id.length,
  ]);

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      const newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          placeholder="Title"
          onChange={handleInputChange}
          value={activity.title}
          name="title"
        />
        <Form.TextArea
          placeholder="Description"
          onChange={handleInputChange}
          value={activity.description}
          name="description"
          rows={2}
        />
        <Form.Input
          placeholder="Category"
          onChange={handleInputChange}
          value={activity.category}
          name="category"
        />
        <Form.Input
          type="date"
          placeholder="Date"
          onChange={handleInputChange}
          value={activity.date}
          name="date"
        />
        <Form.Input
          type="time"
          placeholder="Time"
          onChange={handleInputChange}
          value={activity.time}
          name="time"
        />
        <Form.Input
          placeholder="City"
          onChange={handleInputChange}
          value={activity.city}
          name="city"
        />
        <Form.Input
          placeholder="Venue"
          onChange={handleInputChange}
          value={activity.venue}
          name="venue"
        />
        <Button
          name="formSubmit"
          floated="right"
          positive
          type="submit"
          content="Submit"
          loading={submitting === "formSubmit"}
        />
        <Button
          floated="right"
          type="cancel"
          content="Cancel"
          onClick={() => history.push(`/activities/${activity.id}`)}
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
