import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";

class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activities: Activity[] = [];
  @observable selectedActivity: Activity | null = null;
  @observable loading: boolean = false;
  @observable submitting: string | null = null;

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
    this.loading = true;
    try {
      const response = await agent.Activities.list();
      runInAction("Loading activities", () => {
        this.activities = response.map((activity) => {
          const date = new Date(activity.date);
          return { ...activity, date: date };
        });
        this.loading = false;
      });
    } catch (error) {
      runInAction("Logging error", () => {
        this.loading = false;
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
      this.loading = true;

      try {
        const currentActivity = await agent.Activities.details(id);
        runInAction("Loading activity", () => {
          const date = new Date(currentActivity.date);
          this.loading = false;
          this.selectedActivity = { ...currentActivity, date: date };
        });
        return this.selectedActivity;
      } catch (error) {
        runInAction("Logging error", () => {
          this.loading = false;
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
}

export default ActivityStore;
