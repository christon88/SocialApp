import React, { useState, useEffect } from "react";
import axios from "axios";
import { List } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";

const App = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);

  return (
    <div className="App">
      <NavBar />
      <List
        floated="left"
        items={activities.map((activity) => activity.title)}
      />
    </div>
  );
};

export default App;
