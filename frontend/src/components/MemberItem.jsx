import React from "react";
import styled from "styled-components";

const MemberItemAdmin = styled.div`
  background-color: aliceblue;
  color: #7fa4c5;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
`;

const MemberItemMember = styled.div`
  color: aliceblue;
  border: 2px solid aliceblue;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
`;

function MemberItem({ member, onClick }) {
  return (
    <>
      {member.isAdmin ? (
        <MemberItemAdmin
          onClick={onClick}
          style={{ cursor: onClick ? "pointer" : "initial" }}
        >
          <h3 className="linkTitle">{member.displayName}</h3>
        </MemberItemAdmin>
      ) : (
        <MemberItemMember
          onClick={onClick}
          style={{ cursor: onClick ? "pointer" : "initial" }}
        >
          {member.displayName}
        </MemberItemMember>
      )}
    </>
  );
}

export default MemberItem;
