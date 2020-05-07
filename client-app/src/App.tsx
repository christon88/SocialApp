import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Header, Icon, List } from "semantic-ui-react";

function App() {
  interface Value {
    id: number;
    name: string;
  }

  const [values, setValues] = useState([] as Value[]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/values").then((response) => {
      setValues(response.data);
    });
  }, []);

  return (
    <div className="App">
      <Header as="h2">
        <Icon name="users" />
        <Header.Content>Social App</Header.Content>
      </Header>
      <List floated="left" items={values.map((value) => value.name)} />
    </div>
  );
}

export default App;
