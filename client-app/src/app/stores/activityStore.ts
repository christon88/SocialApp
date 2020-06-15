import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import setActivityProps from "app/common/util/setActivityProps";
import createAttendee from "app/common/util/createAttendee";

class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activities: Activity[] = [];
  @observable selectedActivity: Activity | null = null;
  @observable initialLoading: boolean = false;
  @observable submitting: string | null = null;
  @observable loading = false;

  @computed get sortedActivities() {
    return this.groupActivitiesByDate(this.activities);
  }

  groupActivitiesByDate(activities: Activity[]) {
    const sortedActivities = activities
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  @action loadActivities = async () => {
    this.initialLoading = true;
    try {
      const response = await agent.Activities.list();
      runInAction("Loading activities", () => {
        this.activities = response.map((activity) => {
          const date = new Date(activity.date);
          setActivityProps(activity, this.rootStore.userStore.user);
          return { ...activity, date: date };
        });
        this.initialLoading = false;
      });
    } catch (error) {
      runInAction("Logging error", () => {
        this.initialLoading = false;
      });
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    const activity = this.getActivity(id);

    if (activity) {
      this.selectedActivity = activity;
      return this.selectedActivity;
    } else {
      this.initialLoading = true;

      try {
        const currentActivity = await agent.Activities.details(id);
        runInAction("Loading activity", () => {
          const date = new Date(currentActivity.date);
          setActivityProps(currentActivity, this.rootStore.userStore.user);
          this.initialLoading = false;
          this.selectedActivity = { ...currentActivity, date: date };
        });
        return this.selectedActivity;
      } catch (error) {
        runInAction("Logging error", () => {
          this.initialLoading = false;
        });
        console.log(error);
      }
    }
  };

  @action clearActivity = () => {
    this.selectedActivity = {
      id: "",
      title: "",
      description: "",
      category: "",
      date: new Date(),
      city: "",
      venue: "",
      isGoing: false,
      isHost: false,
      attendees: [],
    };
  };

  getActivity = (id: string): Activity => {
    return this.activities.filter((activity) => activity.id === id)[0];
  };

  @action createActivity = async (activity: Activity) => {
    this.submitting = "formData";
    try {
      await agent.Activities.create(activity);
      runInAction("Creating activity", () => {
        this.activities = [...this.activities, activity];
        this.submitting = null;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("Creating activity error", () => {
        this.submitting = null;
      });
      toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action editActivity = async (updatedActivity: Activity) => {
    this.submitting = "formSubmit";
    try {
      await agent.Activities.update(updatedActivity);
      runInAction("Editing activity", () => {
        this.activities = [
          ...this.activities.filter(
            (activity) => activity.id !== updatedActivity.id
          ),
          updatedActivity,
        ];
        this.selectedActivity = updatedActivity;
        this.submitting = null;
      });
      history.push(`/activities/${updatedActivity.id}`);
    } catch (error) {
      runInAction("Editing activity error", () => {
        this.submitting = null;
      });
      toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement, Event>,
    id: string
  ) => {
    this.submitting = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("Deleting activity", () => {
        this.activities = this.activities.filter(
          (activity) => activity.id !== id
        );
        this.submitting = null;
      });
    } catch (error) {
      runInAction("Deleting activity error", () => {
        this.submitting = null;
      });
      console.log(error);
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!, false);
    try {
      this.loading = true;
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity) {
          this.selectedActivity.attendees.push(attendee);
          this.selectedActivity.isGoing = true;
          this.activities = [
            ...this.activities.filter(
              (activity) => activity.id !== this.selectedActivity!.id
            ),
            this.selectedActivity,
          ];
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        toast.error("Problem signing up to activity");
        this.loading = false;
      });
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unAttend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity) {
          this.selectedActivity.attendees = this.selectedActivity.attendees.filter(
            (attendee) =>
              attendee.username !== this.rootStore.userStore.user?.username
          );
          this.selectedActivity.isGoing = false;

          this.activities = [
            ...this.activities.filter(
              (activity) => activity.id !== this.selectedActivity!.id
            ),
            this.selectedActivity,
          ];
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        toast.error("Problem cancelling attendance");
        this.loading = false;
      });
    }
  };
}

export default ActivityStore;
