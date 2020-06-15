export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  city: string;
  venue: string;
  isGoing: boolean;
  isHost: boolean;
  attendees: Attendee[];
}

export interface Attendee {
  username: string;
  displayName: string;
  image?: string;
  isHost: boolean;
}
