import React, { useState, useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "app/stores/activityStore";

const NavBar = () => {
  const activityStore = useContext(ActivityStore);
  const { openCreateForm } = activityStore;
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => setActiveItem(event.currentTarget.name);

  return (
    <Menu inverted>
      <Container>
        <Menu.Item header>Social App</Menu.Item>
        <Menu.Item
          name="Activities"
          active={activeItem === "Activities"}
          onClick={handleItemClick}
        />
        <Menu.Item>
          <Button positive content="Create Activity" onClick={openCreateForm} />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
