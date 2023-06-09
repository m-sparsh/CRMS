import React, { useEffect, useState } from "react";
import MapComponent from "../MapContainer/MapComponent";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Navbar from "../superAdmin/Navbar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "./firdetail.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const Firdetail = () => {
  const [firData, setFirData] = useState(null);
  const [optionSelected, setOptionSelected] = useState(null);
  const [policeOfficerData, setPoliceOfficerData] = useState(null);
  const [updateFirStatus, setUpdateFirStatus] = useState(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isSubmitButtonActive, setIsSubmitButtonActive] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`http://localhost:9002/getFirById/${id}`)
        .then((res) => {
          setFirData(res.data);
        })
        .catch((err) => {
          alert("some error occured, please repeat the request!");
          console.log(err);
        });
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchpoliceDetails = async () => {
      await axios
        .get(`http://localhost:9002/getPoliceMenList`)
        .then((res) => {
          console.log(res);
          setPoliceOfficerData(res.data);
        })
        .catch((err) => {
          alert("some error occured, please repeat the request!");
        });
    };
    fetchpoliceDetails();
  }, []);

  const handleOption = (officer) => {
    console.log(officer);
    // setUpdateFirStatus(() => {
    //   return {
    //     firId: firData._id,
    //     policeMenId: officerId,
    //   };
    // });
    // setOptionSelected(`${fName} ${lName}`);
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setOptionSelected(e.target.value);
    const selectedData = policeOfficerData.find(
      (option) => option._id === e.target.value
    );
    performAction(selectedData);
  };
  const performAction = (selectedvalue) => {
    console.log(selectedvalue);
    setUpdateFirStatus(() => {
      return {
        firId: firData._id,
        policeMenId: selectedvalue._id,
      };
    });
  };
  useEffect(() => {
    console.log(updateFirStatus);
  }, [updateFirStatus]);
  const submitStatusHandler = async () => {
    console.log(updateFirStatus);
    await axios
      .post("http://localhost:9002/assignFirToPoliceMen", updateFirStatus)
      .then((res) => {
        console.log(res);
        toast.success(`Assigned Successfully`,{
          position:"top-center",
          autoClose:3000,
          hideProgressBar:false,
          closeOnClick:true,
          pauseOnHover:true,
          draggable:true,
          progress: undefined,
          theme:"light",
          containerStyle: { width: '500px' }
        });
      })
      .catch((err) => {
        toast.error(`Assign the policeman first`,{
          position:"top-center",
          autoClose:3000,
          hideProgressBar:false,
          closeOnClick:true,
          pauseOnHover:true,
          draggable:true,
          progress: undefined,
          theme:"light",
          containerStyle: { width: '500px' }
        });
        console.log(err);
      });
  };
  const optionElements = policeOfficerData?.map((officer, index) => (
    <option
      onClick={() => handleOption(officer)}
      key={index}
      label={`${officer?.firstName} ${officer?.lastName}`}
      value={officer?._id}
    >
      {`${officer.firstName} ${officer.lastName}`}
    </option>
  ));
  const handleAcceptFir = ()=>{
    setIsButtonActive(true);
  }


  
  return (
    <div>
      <Navbar />
      {firData && policeOfficerData && (
        <div className="fir-container">
          <Grid container spacing={2}>
            <Grid item>
              <Item>
                <Card>
                  <CardContent>
                    <Typography variant="h3" component="div">
                      {firData.crimeDetails.crime.toUpperCase()}
                    </Typography>
                    <Typography variant="body2">
                      {firData.crimeDetails.address},
                      {firData.crimeDetails.colony},
                      {firData.crimeDetails.district},
                      {firData.crimeDetails.state},
                      {firData.crimeDetails.pinCode}
                      <br />
                    </Typography>
                    <br />
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Status:{firData.status}
                      <br />
                    </Typography>
                    <Typography variant="body2">
                      Time& Date: {firData.createdAt}
                      <br />
                      Updated At: {firData.updatedAt}
                      <br />
                    </Typography>
                    <br />
                    <br />
                    <Typography variant="body3">
                      Complaint User Info:
                      <br />
                      Name: {firData.complaintUser.name},<br />
                      Address: {firData.complaintUser.address},<br />
                      Aadhar No. :{firData.complaintUser.aadharNo},<br />
                      Date of Birth : {firData.complaintUser.dob},<br />
                      Nationality: {firData.complaintUser.nationality}
                      <br />
                      <br />
                    </Typography>
                    <Button
                      className="buttons"
                      sx={{ m: 2 }}
                      variant="outlined"
                      onClick={handleAcceptFir}
                    >
                      Accept
                    </Button>
                    <br />
                    <Button
                    disabled={isButtonActive}
                      className="buttons"
                      variant="outlined"
                      color="error"
                    >
                      Reject
                    </Button>

                    <Typography variant="h6" component="div">
                      Assign Police Officer:
                      <FormControl
                        sx={{ m: 1, minWidth: 80 }}
                       
                      >
                        <select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={optionSelected}
                          onChange={handleChange}
                        >
                          <option value={"none"} disabled selected>
                            None
                          </option>
                          {optionElements}
                        </select>
                      </FormControl>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      disabled={!setIsButtonActive}
                      size="small"
                      sx={{ mx: "auto", width: 400 }}
                      variant="contained"
                      onClick={submitStatusHandler}
                    >
                      Assign Officer
                    </Button>
                  </CardActions>
                </Card>
              </Item>
            </Grid>
          </Grid>
        </div>
      )}

      {/* <MapComponent latitude={37.7749} longitude={-122.4194} /> */}
    </div>
  );
};

export default Firdetail;
