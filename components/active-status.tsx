"use client";

import useActiveChannel from "@/hooks/user-active-channel";

const ActiveStatus = () => {
  useActiveChannel();
  return null;
};

export default ActiveStatus;
