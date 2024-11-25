import React, { useContext, useEffect, useState } from "react";
import "./notification.scss";
import Socketcontext from "../../../Context/SocketContext";
import Usercontext from "../../../Context/Usercontext";
import axios from "axios";

const Notifications = ({ setIsFloatingVisible , SetDetails}) => {
  const [notifications, setNotifications] = useState([]); // Change state to an array
  const { socket } = useContext(Socketcontext);
  const { Userinfo } = useContext(Usercontext);

  const handleViewClick = (notif) => {
    setIsFloatingVisible(true);
    console.log(notif);
    console.log("details", notif.Details);
    SetDetails(notif.Details)
  };

  const FetchNotificaion = async () => {
    try {
      console.log("useremail", Userinfo.email);
      const reponse = await axios.get(
        `http://localhost:3000/home/userdata/${Userinfo.email}`
      );
      console.log(reponse.data.userNotification);
      setNotifications(reponse.data.userNotification);
    } catch (error) {
      console.log("fetching of notification is failed", error);
    }
  };
  useEffect(() => {
    console.log("fetching notification");
    FetchNotificaion();
  }, []);

  useEffect(() => {
    // Listen for notifications from the server
    socket?.on("getNotification", () => {
      FetchNotificaion();
    });
  }, [socket]);

  return (
    <div className="Notification-container">
      <h3>Notifications</h3>
      <hr className="light-line" />

      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div key={index} className="single-Notification-container">
            <div className="profile-part"></div>
            <div className="message-and-button">
              <div className="message-part">
                <p>
                  <strong>{notif.message}</strong>{" "}
                </p>
                <p>{notif.createdAt}</p>
              </div>
              <button onClick={()=>{
                handleViewClick(notif)}} className="button">
                View
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-notifications">No notifications available</p>
      )}
    </div>
  );
};

export default Notifications;
