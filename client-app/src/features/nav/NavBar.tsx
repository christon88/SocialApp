import React, { useState } from "react";
import { Menu, Container, Button } from "semantic-ui-react";

const NavBar = () => {
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => setActiveItem(event.currentTarget.name);

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>Social App</Menu.Item>
        <Menu.Item
          name="Activities"
          active={activeItem === "home"}
          onClick={handleItemClick}
        />
        <Menu.Item>
          <Button positive content="Create Activity" />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
