import React from "react";
export function capitalize(str) {
  if (str){
  return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
