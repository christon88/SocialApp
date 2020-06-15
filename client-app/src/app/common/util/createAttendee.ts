import { User } from "app/models/user";
import { Attendee } from "app/models/activity";

const createAttendee = (user: User, host: boolean): Attendee => {
  return {
    username: user.username,
    displayName: user.displayName,
    image: user.image,
    isHost: host,
  };
};

export default createAttendee;
