import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

interface Props {
  initialActivity: Activity | null;
  setEditMode: (editMode: boolean) => void;
  createActivity: (activity: Activity) => void;
  editActivity: (activity: Activity) => void;
}

const ActivityForm: React.FC<Props> = ({
  initialActivity,
  setEditMode,
  createActivity,
  editActivity,
}) => {
  const initializeActivity = () =>
    initialActivity
      ? initialActivity
      : {
          id: "",
          title: "",
          description: "",
          category: "",
          date: "",
          time: "",
          city: "",
          venue: "",
        };

  const [activity, setActivity] = useState(initializeActivity);

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      const newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
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
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          floated="right"
          type="cancel"
          content="Cancel"
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
