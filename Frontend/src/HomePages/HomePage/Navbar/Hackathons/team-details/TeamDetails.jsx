import React, { useState, useEffect } from "react";
import styles from "./TeamDetails.module.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { useLocation, useNavigate } from "react-router-dom";

const TeamDetails = () => {
  const location = useLocation();
  const hackathonName = location.state?.hackathonName;
  const [teamInfo, setTeamInfo] = useState({
    teamName: "",
    Yourname: "",
    yourEmail: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const payload = token ? jwtDecode(token) : null;
    setTeamInfo({Yourname:payload.user.name ,yourEmail:payload.user.email })
    console.log(payload.user.name);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/team/enroll-team", {
        hackathonName,
        ...teamInfo,
      });

      navigate(`/home/hackathons/${hackathonName}/team-details/add-member`, {
        state: { hackathonName },
      });
    } catch (error) {
      console.error("Error enrolling team:", error);
    }
  };

  return (
    <div className={styles.bigcontainer}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Enroll Your Team for {hackathonName}</h2>
        <p className={styles.description}>
          Join us for an exciting hackathon where innovation meets creativity.
          Fill in the details below to enroll your team.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="teamName">Team Name</label>
            <input
              type="text"
              name="teamName"
              placeholder="Enter your team name"
              onChange={handleChange}
              value={teamInfo.teamName}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="Yourname">Your Name</label>
            <input
              type="text"
              name="Yourname"
              readOnly
              value={teamInfo.Yourname}
              
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="yourEmail">Your Email</label>
            <input
              type="email"
              name="yourEmail"
              readOnly
              value={teamInfo.yourEmail}
              
            />
          </div>
          <button type="submit" className={styles.button}>
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamDetails;
