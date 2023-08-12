import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";

const Room = ({ leaveRoomCallback }) => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [backData, setBackData] = useState({
    guestCanPause: true,
    votesToSkip: 2,
    isHost: false,
  });
  useEffect(() => {
    const getRoomDetails = () => {
      fetch("/api/get-room" + "?code=" + roomCode)
        .then((response) => {
          if(!response.ok){
            leaveRoomCallback();
            navigate("/");
          }
          return response.json();
        })
        .then((data) => {
          setBackData({
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
          });
        });
    };
    getRoomDetails();
  }, []);

  function leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      leaveRoomCallback();
      navigate("/");
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {backData.votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {backData.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {backData.isHost.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => leaveButtonPressed()}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
