import React from "react";

import { withFirebase } from "../../Firebase/firebase";

const SignOutButton = ({ firebase, uid, revert }) => (
  <a
    style={{ color: "blue", textDecoration: "underline" }}
    onClick={() => {
      firebase.doSignOut(uid);
      window.location.reload();
    }}
  >
    Sign Out
  </a>
);

export default withFirebase(SignOutButton);
