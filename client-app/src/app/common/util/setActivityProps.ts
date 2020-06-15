import { Activity } from "app/models/activity";
import { User } from "app/models/user";

const setActivityProps = (activity: Activity, user: User | null) => {
  activity.isGoing = activity.attendees.some(
    (attendee) => attendee.username === user?.username
  );
  activity.isHost = activity.attendees.some(
    (attendee) => attendee.username === user?.username && attendee.isHost
  );
  return activity;
};

export default setActivityProps;
