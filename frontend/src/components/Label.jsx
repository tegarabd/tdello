import React from "react";
import styled from "styled-components";
import { brightnessByColor } from "../utility/helper";

const Capsule = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 100vmax;
`;

const Title = styled.h5`
  margin: 0;
`;

function Label({ label }) {
  return (
    <Capsule style={{ backgroundColor: label.color }}>
      <Title
        style={{ color: brightnessByColor(label.color) === "light" ? "#444" : "#ddd" }}
      >
        {label.title}
      </Title>
    </Capsule>
  );
}

export default Label;
