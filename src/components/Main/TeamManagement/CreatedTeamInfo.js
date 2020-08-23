import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Tabs} from "antd";
import {DoubleLeftOutlined,AlignLeftOutlined,BulbOutlined,TeamOutlined,OrderedListOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import TemplatePage from './TemplatePage';
import SprintPage from './SprintPage';
import TeamBasicInfoPage from './TeamBasicInfoPage';
import TeamMembersPage from './TeamMembersPage';
import {getMembersService} from '../../../services/teamService';
import { getTemplatesInTeamService } from '../../../services/templateService';
import { getSprintListService} from '../../../services/sprintService'
import {showError} from "../../../services/notificationService";

const { TabPane } = Tabs;

class CreatedTeamInfo extends Component {

    state={
        sprints:[],
        members:[],
        templates:[],
    };

    /**
     * Initialization data, including sprints, members and templates
     */
    componentDidMount(){
        let id = this.props.teamInfo.id;
        getMembersService(id).then((res) => {
            if(res.code === 0){
                this.setState({members:res.members});
            }else{
                console.log(res)
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get team members");
            }
        });
        getSprintListService(id).then((res) => {
            this.setState({
                sprints:res.list
            })
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get team sprints");
            }
        });
        getTemplatesInTeamService(id).then((res) => {
            this.setState({
                templates:res.templates
            })
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get team templates");
            }
        });
    }


    /**
     * exit the info page, back to team management page
     * @method exitInfoPage
     * @for CreatedTeamInfo
     * @return none
     */
    exitInfoPage=()=>{
        this.props.exitInfoPage();
    };

    render() {
        return (
            <div className="card-container" style={{"padding" : "10px"}}>
                <div style={{textAlign:"left"}}>
                    <a onClick={()=>this.exitInfoPage()}> <DoubleLeftOutlined/> Back </a>
                </div>         
                <Tabs defaultActiveKey="1" animated="false" tabPosition="top">
                    <TabPane key="1" tab={<span><AlignLeftOutlined />Information</span>}>
                        <TeamBasicInfoPage 
                        teamInfo={this.props.teamInfo} 
                        updateDeletedTeam={this.props.updateDeletedTeam}
                        exitInfoPage={this.exitInfoPage}
                        updateTeamInfo={this.props.updateTeamInfo}
                        onSessionExpired={this.props.onSessionExpired}
                        />
                    </TabPane>
                    <TabPane tab={<span><OrderedListOutlined />Sprints</span>} key="2">
                        <SprintPage 
                        teamId={this.props.teamInfo.id} 
                        sprints={this.state.sprints}
                        />
                    </TabPane>
                    <TabPane tab={<span><TeamOutlined />Members</span>} key="3">
                        <TeamMembersPage 
                        teamInfo={this.props.teamInfo} 
                        members={this.state.members}
                        onSessionExpired={this.props.onSessionExpired}
                        />
                    </TabPane>
                    <TabPane tab={<span><BulbOutlined />Templates</span>} key="4">
                        <TemplatePage 
                        teamId={this.props.teamInfo.id} 
                        templates={this.state.templates}
                        teamInfo={this.props.teamInfo}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default CreatedTeamInfo;