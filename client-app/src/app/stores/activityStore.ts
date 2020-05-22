import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { Activity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class activityStore {
  @observable activities: Activity[] = [];
  @observable selectedActivity: Activity | null = null;
  @observable loading: boolean = false;
  @observable submitting: string | null = null;

  @computed get sortedActivities() {
    return this.activities
      .slice()
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadActivities = async () => {
    this.loading = true;
    try {
      const response = await agent.Activities.list();
      runInAction("Loading activities", () => {
        this.activities = response.map((activity) => {
          const dateTime = activity.date.split(".")[0];
          const date = dateTime.split("T")[0];
          const time = dateTime.split("T")[1];
          return { ...activity, date: date, time: time };
        });
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction("Logging error", () => {
        this.loading = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    const activity = this.getActivity(id);

    if (activity) {
      this.selectedActivity = activity;
    } else {
      this.loading = true;

      try {
        const activity = await agent.Activities.details(id);
        runInAction("Loading activity", () => {
          const dateTime = activity.date.split(".")[0];
          const date = dateTime.split("T")[0];
          const time = dateTime.split("T")[1];
          this.loading = false;
          this.selectedActivity = { ...activity, date: date, time: time };
        });
      } catch (error) {
        console.log(error);
        runInAction("Logging error", () => {
          this.loading = false;
        });
      }
    }
  };

  @action clearActivity = () => {
    this.selectedActivity = null;
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
    } catch (error) {
      console.log(error);
      runInAction("Creating activity error", () => {
        this.submitting = null;
      });
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
      });
    } catch (error) {
      console.log(error);
      runInAction("Editing activity error", () => {
        this.submitting = null;
      });
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
      });
    } catch (error) {
      console.log(error);
      runInAction("Deleting activity error", () => {
        this.submitting = null;
      });
    }
  };
}

const ActivityStore = createContext(new activityStore());

export default ActivityStore;
