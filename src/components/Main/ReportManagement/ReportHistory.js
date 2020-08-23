import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../../../styles/Main/ReportManagement/ReportHistory.css';
import {getReportData} from '../../../services/reportService';
import {getCreatedTeamsService, getJoinedTeamsService} from '../../../services/teamService';
import ReportData from "./ReportData";
import moment from "moment";
import {showError} from "../../../services/notificationService";


class ReportHistory extends Component {
    state = {
        data: [],
        joinedTeams: [],
        joinedTeamsMap: {},
        createdTeams: [],
        createdTeamsMap: {},
        teams:[],
        teamsMap:{},
        from: this.props.userInfo.email,
    };

    componentWillMount() {
        let startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        let endDate = moment().format('YYYY-MM-DD');
        endDate = endDate + ' 23:59:59';
        var params = {
            type: undefined, // opt
            fromEmail: this.props.userInfo.email, // opt
            toEmail: undefined, // opt , if no userEmail ,required
            beginTime: startDate, // opt
            endTime: endDate, // opt
            offset : 0, // opt ,default 0
            limit : 10 //  opt ,default 10
        };
        this.getReportDataWithKeys(params);
        getJoinedTeamsService(false).then((res) => {
            let teamNames = [];
            let joinedTeamMap = {};
            for (let i = 0; i < res.joinedList.length; i++) {
                teamNames.push({value: res.joinedList[i].teamName});
                joinedTeamMap[res.joinedList[i].teamName] = res.joinedList[i].id;
            }
            this.setState({joinedTeams: teamNames, joinedTeamsMap: joinedTeamMap})
            getCreatedTeamsService(false).then((res) => {
                let teamNames = [];
                let createdTeamMap = {};
                for (let i = 0; i < res.createdList.length; i++) {
                    teamNames.push({value: res.createdList[i].teamName});
                    createdTeamMap[res.createdList[i].teamName] = res.createdList[i].id;
                }
                this.setState({createdTeams: teamNames, createdTeamsMap: createdTeamMap});
                this.getAllTeamMap(this.state.joinedTeamsMap,this.state.createdTeamsMap,
                    this.state.joinedTeams,this.state.createdTeams);
                this.getAllTeams(this.state.joinedTeams,this.state.createdTeams);
            }).catch((err) => {
                console.log(err);
                if (err === 302) {
                    this.props.onSessionExpired();
                } else {
                    showError("Failed to show teams you created");
                }
            });
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to show teams you have joined ");
            }
        });
    }

    getAllTeams = (joinedTeams,createdTeams) =>{
        let teamNames=[];
        for (let i = 0; i < createdTeams.length; i++) {
            teamNames.push({value:createdTeams[i].value});
        }
        for (let j = 0; j < joinedTeams.length; j++) {
            teamNames.push({value:joinedTeams[j]}.value);
        }
        this.setState({teams:teamNames});
    };

    getAllTeamMap = (joinedTeamMap,createdTeamMap,joinedTeams,createdTeams) =>{
        let teamsMap = {};
        for (let i = 0; i < createdTeams.length; i++) {
            teamsMap[createdTeams[i].value]=createdTeamMap[createdTeams[i].value];
        }
        for (let i = 0; i < joinedTeams.length; i++) {
            teamsMap[joinedTeams[i].value]=joinedTeamMap[joinedTeams[i].value];
        }
        this.setState({teamsMap:teamsMap});
    };

    onSearchReports = values => {
        let startDate = values.date === undefined ? moment().subtract(7, 'days').format('YYYY-MM-DD') : values.date === null ? undefined : values.date[0].format('YYYY-MM-DD');
        let endDate = values.date === undefined ? moment().format('YYYY-MM-DD') : values.date === null ? undefined : values.date[1].format('YYYY-MM-DD');
        endDate = endDate === undefined ? undefined : endDate + ' 23:59:59';
        let teamId = this.state.teamsMap[values.teamname]
        var params = {
            teamId: teamId === undefined ? values.teamname : teamId,
            type: values.type, // opt
            fromEmail: this.props.userInfo.email, // opt
            toEmail: values.toEmail, // opt , if no userEmail ,required
            beginTime: startDate, // opt
            endTime: endDate, // opt
            offset : 0, // opt ,default 0
            limit : 10, //  opt ,default 10
            sprint: values.sprint
        };
        this.getReportDataWithKeys(params);
    };

    getReportDataWithKeys = (params) => {
        getReportData(false, params).then((res) => {
            let data = [];
            for (let i = 0; i < res.list.length; i++) {
                let cur = res.list[i];
                cur.key = i;
                data.push(cur)
            }
            this.setState({data: data})
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to show reports your teammates submitted");
            }
        });
    };

    render() {
        const { teams,data,teamsMap } = this.state;
        return (
            <ReportData onSearchReports={this.onSearchReports}
                        teamData={teams}
                        teamMapData={teamsMap}
                        role={"Reviewer"}
                        roleName={"toEmail"}
                        data={data}
                        userEmail={this.props.userInfo.email}
                        handleUpdate={this.props.handleUpdate}
                        isSender={true}
            />
        );
    }
}

export default ReportHistory;