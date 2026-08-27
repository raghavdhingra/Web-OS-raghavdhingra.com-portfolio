"use client";

import { useEffect, useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import type { RootState } from "@/store/store";

const weekList = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
const monthList = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatter = (val: number) => (val < 10 ? `0${val}` : val);

const TaskDate = ({ date }: TaskDateProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="centralise" aria-hidden />;
  }

  const dateObj = new Date(date);

  return (
    <div className="centralise taskbar-date">
      <span className="date-full">
        {weekList[dateObj.getDay()]}, {monthList[dateObj.getMonth()]}{" "}
        {formatter(dateObj.getDate())}&nbsp;&nbsp;
        {formatter(dateObj.getHours())}:{formatter(dateObj.getMinutes())}
      </span>
      <span className="date-compact">
        {monthList[dateObj.getMonth()]} {formatter(dateObj.getDate())}{" "}
        {formatter(dateObj.getHours())}:{formatter(dateObj.getMinutes())}
      </span>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  date: state.desktopReducers.date,
});

const connector = connect(mapStateToProps);
type TaskDateProps = ConnectedProps<typeof connector>;

export default connector(TaskDate);
