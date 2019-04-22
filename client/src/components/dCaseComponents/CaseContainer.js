import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Stepper from 'react-stepper-horizontal'
import axios from "axios";
import "../../App.css";
import InfoCard from "./InfoCard";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { Button } from "@material-ui/core";
import { Fab } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add'
import PayMyFees from "../PayMyFees/PayMyFeesItem"
import moment from 'moment'
import TextField from "@material-ui/core/TextField"
import ListItem from "@material-ui/core/ListItem"

const styles = {
    card: {
        borderRadius: 12,
        fontFamily: "Helvetica Neue",
        boxShadow: "0px 3px 20px rgba(0, 0, 0, 0.16)",
        marginLeft: "5%",
        marginRight: "5%",
        marginButtom: "1%",
        marginTop: "1%",
        textAlign: "left"
    },
    media: {
        height: 140
    },
    root: {
        width: 345
    },
    button: {
        background: "none",
        border: "none",
        fontSize: "16px",
        outline: "none",
        cursor: "pointer",
        color: "#FFFFFF",
        fontWeight: "bold",
        marginTop: "2%",
        marginRight: "2%",
        borderRadius: "1000px",
        backgroundColor: "#E53167",
        fontStyle: "Helvatica Neue"
    }

}


class CaseContainer extends Component {
    state = {
        expandedCase: {},
        investor: {},
        reviewerName: "",
        creatorLawyerName: "",
        assignedLawyerName: "",
        currentUserId: "5ca76f5f00b48e09001936e7",
    };


    componentDidMount() {
        axios
            .get(`api/investors/${this.props.expandedCase.creatorInvestorId}`)
            .then(res => {
                this.setState({ investor: res.data });

            })
            .catch(err => {
                this.setState({ investor: "NA" });
            })

        if (this.props.creatorLawyerId)
            axios
                .get(`api/lawyers/${this.props.expandedCase.creatorLawyerId}`)
                .then(res => {
                    this.setState({ creatorLawyerName: res.data.fullName });
                })
                .catch(err => {
                    this.setState({ creatorLawyerName: "NA" });
                })

        if (this.props.assignedReviewerId)
            axios
                .get(`api/lawyers/${this.props.expandedCase.assignedReviewerId}`)
                .then(res => {
                    this.setState({ reviewerName: res.data.fullName });
                })
                .catch(err => {
                    this.setState({ reviewerName: "NA" });
                })

        if (this.props.assignedLawyerId)
            axios
                .get(`api/lawyers/${this.props.expandedCase.assignedLawyerId}`)
                .then(res => {
                    this.setState({ assignedLawyerName: res.data.fullName });
                })
                .catch(err => {
                    this.setState({ assignedLawyerName: "NA" });
                })

        axios
            .get(`api/lawyers/${this.props.expandedCase.assignedLawyerId}`)
            .then(res => {
                this.setState({ assignedLawyerName: res.data.fullName });
            })
            .catch(err => {
                this.setState({ assignedLawyerName: "NA" });
            })



    }

    formatTime(t) {
        return moment.utc(t.substring(0, 23)).format('DD, MMM, YYYY').toUpperCase();
    }

    handleTextBox = (event) => {
        this.setState({ text: event.target.value });
    }

    render() {
        const classes = { ...styles };
        const expandedCase = this.props.expandedCase;

        var formFields = []
        var caseComments = []
        console.log(this.props.expandedCase.form)
        const canComment = (this.props.expandedCase.assignedLawyerId && (this.props.expandedCase.assignedLawyerId === this.state.currentUserId)) === true ? true : false
        console.log('canComment', canComment)
        for (let atr in expandedCase.form) {
            let field = {
                fieldName: camelCaseToText(atr),
                fieldValue: expandedCase.form[atr]
            }
            formFields.push(field)
        }

        for (let i = 0; i < expandedCase.comments.length; i++) {
            let field = {
                fieldName: expandedCase.comments[i].author,
                fieldValue: expandedCase.comments[i].body
            }
            caseComments.push(field)
        }


        var stepperCounter = 0;
        var finalstate = 'Accepted';
        if (expandedCase.caseStatus === 'OnUpdate')
            stepperCounter = 0
        if (expandedCase.caseStatus === 'WaitingForLawyer')
            stepperCounter = 1
        if (expandedCase.caseStatus === 'AssignedToLawyer')
            stepperCounter = 2
        if (expandedCase.caseStatus === 'WaitingForReviewer')
            stepperCounter = 3
        if (expandedCase.caseStatus === 'AssignedToReviewer')
            stepperCounter = 4
        if (expandedCase.caseStatus === 'Accepted')
            stepperCounter = 5
        if (expandedCase.caseStatus === 'Rejected') {
            stepperCounter = 5
            finalstate = 'Rejected'
        }
        if (expandedCase.caseStatus === 'Established') {
            stepperCounter = 6
        }

        let buttonAccept
        let buttonReject
        let buttonPaying
        if (this.state.currentUserId === this.props.expandedCase.assignedLawyerId || this.state.currentUserId === this.props.expandedCase.creatorLawyerId) {

            buttonAccept = <Fab variant="extended" size="large" color="secondary" style={{ color: '#FFFFFF', height: '31px', width: '107px', fontSize: '13px', boxShadow: 'none', marginRight: '240px', marginTop: '6px', display: 'block', margin: '0 auto' }} aria-label="Delete" onClick={axios.get(`api/lawyers/updateCaseStatus/${this.props.expandedCase._id}/Accepted`)}>
                {"Accept"}
            </Fab>

            buttonReject = <Fab variant="extended" size="large" color="secondary" style={{ color: '#FFFFFF', height: '31px', width: '107px', fontSize: '13px', boxShadow: 'none', marginRight: '240px', marginTop: '6px', display: 'block', margin: '0 auto' }} aria-label="Delete" onClick={axios.get(`api/lawyers/updateCaseStatus/${this.props.expandedCase._id}/Rejected`)}>
                {"Reject"}
            </Fab>
        }

        if (this.state.currentUserId === this.props.expandedCase.assignedReviewerId) {
            buttonAccept = <Fab variant="extended" size="large" color="secondary" style={{ color: '#FFFFFF', height: '31px', width: '107px', fontSize: '13px', boxShadow: 'none', marginRight: '240px', marginTop: '6px', display: 'block', margin: '0 auto' }} aria-label="Delete" onClick={axios.get(`api/lawyers/updateCaseStatus/${this.props.expandedCase._id}/Accepted`)}>
                {"Accept"}
            </Fab>

            buttonReject = <Fab variant="extended" size="large" color="secondary" style={{ color: '#FFFFFF', height: '31px', width: '107px', fontSize: '13px', boxShadow: 'none', marginRight: '240px', marginTop: '6px', display: 'block', margin: '0 auto' }} aria-label="Delete" onClick={axios.get(`api/lawyers/updateCaseStatus/${this.props.expandedCase._id}/Rejected`)}>
                {"Reject"}
            </Fab>

        }

        if (this.state.currentUserId === this.props.expandedCase.creatorInvestorId) {
            buttonPaying = <PayMyFees investorId={this.state.investor._id} caseId={this.props.expandedCase._id} />

        }


        return <div>
            <InfoCard
                infoTitle={"Case Info"}
                fields={[
                    {
                        fieldName: "Company type    ",
                        fieldValue: expandedCase.companyType
                    },
                    {
                        fieldName: "Date of creation",
                        fieldValue: this.formatTime(expandedCase.caseCreationDate)
                    },

                ]}

            />

            <InfoCard
                infoTitle={"Form Info"}

                fields={formFields}

            />

            <InfoCard
                infoTitle={"Investor Info"}
                fields={[
                    {
                        fieldName: "Investor name    ",
                        fieldValue: this.state.investor.fullName
                    },
                    {
                        fieldName: "Investor Nationality  ",
                        fieldValue: this.state.investor.nationality

                    },
                    {
                        fieldName: "Investor email    ",
                        fieldValue: this.state.investor.email

                    },
                    {
                        fieldName: "Investor telephone number   ",
                        fieldValue: this.state.investor.telephoneNumber

                    },
                    {
                        fieldName: "Investor fax    ",
                        fieldValue: this.state.investor.fax

                    }
                ]}
            />


            <Card style={classes.card}>
                <CardActionArea>
                    <CardContent>
                        <Typography component="p">
                            <h3> {"Case Progress"} </h3>
                            <Stepper steps={[{ title: 'On Update' }, { title: 'Waiting For Lawyer' }, { title: 'Assigned To Lawyer' }, { title: 'Waiting For Reviewer' }, { title: 'Assigned To Reviewer' }, { title: finalstate }, { title: 'Established' }]} activeStep={stepperCounter} />
                        </Typography>

                    </CardContent>
                </CardActionArea>
            </Card>

            <Card style={classes.card}>
                <CardActionArea>
                    <CardContent>

                        <div gutterBottom variant="h5" component="h2">
                            <h3> {"Case Fees"} </h3>

                            <div style={classes.root}>
                                <Typography component="h4">
                                    {calcFees(this.props.expandedCase)}
                                </Typography>
                            </div>

                        </div>

                        {buttonPaying}

                    </CardContent>
                </CardActionArea>
            </Card>
            <Card style={classes.card}>
                <CardActionArea>
                    <CardContent>
                        <div gutterBottom variant="h5" component="h2">
                            <ul>
                                <h3> Comments </h3>
                                {caseComments.map(field => {

                                    return <div style={classes.root} divider>
                                        <ListItem button divider>
                                            <Typography component="h4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }} >

                                                {field.fieldName.toUpperCase() + ": "}

                                                {field.fieldValue}

                                            </Typography >
                                        </ListItem>
                                    </div>

                                })}
                            </ul>
                            <TextField
                                id="standard-full-width"
                                label="Comment"
                                style={{ margin: 8 }}
                                placeholder="Type Comment Here..."
                                helperText="Make it descriptive!"
                                fullWidth
                                multiline
                                margin="normal"
                                onChange={this.handleTextBox}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            {
                                canComment ?
                                    <Fab color="primary" aria-label="Add" style={{ float: 'right' }} onClick={(ev) => {   
                                        const body = {
                                            body : this.state.text
                                        }
                                        axios.put(`api/lawyers/addCommentAsLawyer/${this.props.expandedCase.assignedLawyerId}/${this.props.expandedCase._id}`, body)
                                        .then(res => this.componentDidMount())
                                        .catch(err => console.log(err.message))
                                    }
                                    }>
                                        <AddIcon />
                                    </Fab> : <label />
                            }
                            <br />
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
            <br />
            <br />
            <br />
            <br />
            <div style={{ align: 'center' }}>
                {buttonAccept}
                {buttonReject}
            </div>
        </div>


    }
}

function textToCamelCase(str) {
    let tokens = str.toLowerCase().split(" ").filter(s => s.length > 0);
    let res = "";
    for (let i = 0; i < tokens.length; i++)
        res += i > 0 ? tokens[i].charAt(0).toUpperCase() + tokens[i].slice(1) : tokens[i];
    return res;
}

function camelCaseToText(str) {
    let res = str.length > 0 ? str[0].toUpperCase() : "";
    for (let i = 1; i < str.length; i++)
        res += (str[i] === str[i].toUpperCase() ? " " : "") + str[i];
    return res;
}

function calcFees(case1) {
    if (case1.form.regulatedLaw && case1.form.regulatedLaw.includes("72")) {
        return 610;
    }
    const capital = case1.form.capital;
    let ans = 56;
    ans += Math.min(1000, Math.max(100, capital / 1000.0));
    ans += Math.min(1000, Math.max(10, capital / 400.0));
    return ans;
}


export default (CaseContainer);