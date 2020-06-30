export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  comments: Comment[];
  date: Date;
  city: string;
  venue: string;
  isGoing: boolean;
  isHost: boolean;
  attendees: Attendee[];
}

export interface Comment {
  id: string;
  createdAt: Date;
  body: string;
  username: string;
  displayName: string;
  image: string;
}

export interface Attendee {
  username: string;
  displayName: string;
  image?: string;
  isHost: boolean;
}
