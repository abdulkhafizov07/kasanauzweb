import React, { useEffect } from "react";
import MessangerComponent from "@/components/web/profile/messager";

const ProfileMessagesPage: React.FC = () => {
  useEffect(() => {
    document.title = "Xabarlar - Kasana.UZ";
  }, []);

  return (
    <>
      <MessangerComponent />
    </>
  );
};

export default ProfileMessagesPage;
