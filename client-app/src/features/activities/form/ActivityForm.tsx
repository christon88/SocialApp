import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Activity } from "app/models/activity";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "app/common/form/TextInput";
import TextAreaInput from "app/common/form/TextAreaInput";
import SelectInput from "app/common/form/SelectInput";
import DateInput from "app/common/form/DateInput";
import { category } from "app/common/options/categoryOptions";
import { combineValidators, isRequired } from "revalidate";
import { RootStoreContext } from "app/stores/rootStore";
import createAttendee from "app/common/util/createAttendee";

const validate = combineValidators({
  title: isRequired({ message: "Please enter a title" }),
  category: isRequired({ message: "Please select a category" }),
  description: isRequired({ message: "Please enter a description" }),
  city: isRequired({ message: "Please enter a city" }),
  venue: isRequired({ message: "Please enter a venue" }),
  date: isRequired({ message: "Please enter a date" }),
});

interface RouteParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<RouteParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    submitting,
    editActivity,
    loadActivity,
  } = rootStore.activityStore;
  const { user } = rootStore.userStore;

  const emptyActivity: Activity = {
    id: "",
    title: "",
    description: "",
    category: "",
    date: new Date(),
    city: "",
    venue: "",
    isGoing: true,
    isHost: true,
    attendees: [createAttendee(user!, true)],
  };

  const [activity, setActivity] = useState<Activity>(emptyActivity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => activity && setActivity(activity))
        .finally(() => setLoading(false));
    }
  }, [match.params.id, loadActivity]);

  const handleFinalFormSubmit = (values: any) => {
    console.log(values);
    const activity = values;
    if (!activity.id) {
      const newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  component={TextInput}
                  placeholder="Title"
                  value={activity.title}
                  name="title"
                />
                <Field
                  placeholder="Description"
                  component={TextAreaInput}
                  value={activity.description}
                  rows={3}
                  name="description"
                />
                <Form.Group>
                  <Field
                    component={SelectInput}
                    options={category}
                    placeholder="Category"
                    value={activity.category}
                    name="category"
                  />
                  <Field
                    component={DateInput}
                    placeholder="Date"
                    value={activity.date}
                    name="date"
                  />
                </Form.Group>
                <Field
                  component={TextInput}
                  placeholder="City"
                  value={activity.city}
                  name="city"
                />
                <Field
                  component={TextInput}
                  placeholder="Venue"
                  value={activity.venue}
                  name="venue"
                />
                <Button
                  name="formSubmit"
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                  loading={submitting === "formSubmit"}
                />
                <Button
                  floated="right"
                  disabled={loading}
                  type="cancel"
                  content="Cancel"
                  onClick={() => history.push(`/activities/${activity.id}`)}
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
