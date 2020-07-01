import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { Attendee } from "app/models/activity";

interface Props {
  attendees: Attendee[];
}

const styles = {
  borderColor: "orange",
  borderSize: 2,
};

const ActivityListItemAttendees: React.FC<Props> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.username}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image
                size="mini"
                circular
                src={attendee.image || "/assets/user.png"}
                bordered
                style={attendee.following ? styles : null}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ActivityListItemAttendees;
