import "./url.css";
import React from "react";
import { db } from "../../firebase";

export default function UrlListItem({ id, originalUrl, shortUrl }) {
  const deleteUrl = () => {
    db.collection("urls").doc(id).delete();
  };
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", width: "50%" }}>
        <a href={originalUrl} target="_blank">
          {originalUrl}
        </a>
      </div>
      <div style={{ display: "flex", width: "50%" }}>
        <a href={originalUrl} target="_blank">
          {shortUrl}
        </a>
      </div>
      <button
        onClick={deleteUrl}
        // style={{
        //   backgroundColor: "grey",
        //   border: "none",
        //   cursor: "pointer",
        //   padding: "5px 8px",
        //   borderRadius: "3px",
        //   backgroundColor: "",
        // }}
      >
        Delete
      </button>
    </div>
  );
}
