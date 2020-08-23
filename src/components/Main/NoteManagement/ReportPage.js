import React, {Component} from "react";
import 'antd/dist/antd.css';
import {Tabs} from 'antd';
import ReportManagement from "./ReportManagement";
import ReportHistory from "./ReportHistory";
import '../../../styles/Main/ReportManagement/ReportPage.css';
const { TabPane } = Tabs;

class ReportPage extends Component{
    render() {
        return (
            <div style={{"padding" : "10px"}}>
            <div className="card-container">
                <Tabs type={"card"} defaultActiveKey="Report Management" data-tut="tour_reports_reportManagement">
                    <TabPane tab="Reports You Received" key="Report Management">
                        <ReportManagement handleIntegrate={this.props.handleIntegrate}
                                          userInfo={this.props.userInfo}
                                          onSessionExpired={this.props.onSessionExpired}
                                          handleUpdate={this.props.handleUpdate}
                                          setSprintObj={this.props.setSprintObj}
                                          setTeamInfo={this.props.setTeamInfo}
                        />
                    </TabPane>
                    <TabPane tab="Reports You Sent" key="Report History" data-tut="tour_reportHistory">
                        <ReportHistory userInfo={this.props.userInfo}
                                       onSessionExpired={this.props.onSessionExpired}
                                       handleUpdate={this.props.handleUpdate}
                        />
                    </TabPane>
                </Tabs>
            </div>
            </div>
        );
    }
}

export default ReportPage;