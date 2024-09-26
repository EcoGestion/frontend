import React from "react";
export function capitalize(str) {
  if (str){
  return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
