import React, { useState } from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface Props {
  openCreateForm: () => void;
}

const NavBar: React.FC<Props> = ({ openCreateForm }) => {
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

export default NavBar;
