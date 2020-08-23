import React from "react";
import { Component } from "react";
import {
    Button,
    Menu,
    Divider,
    Empty,
    Modal
  } from "antd";
  import {
    TeamOutlined,
    FileTextOutlined,
    FileImageOutlined,
    FieldBinaryOutlined,
    UploadOutlined,
    MailOutlined,
    FileDoneOutlined,
  } from "@ant-design/icons";
  import ReportsInThePast from "../ReportsInThePast";
  import "antd/dist/antd.css";


class ReportInThePastSelectModal extends Component {
    state={
    }

    render(){
        return (<Modal
        show={this.props.show}
        handleCancel={() =>
          this.props.exitModal("showReportInThePastSelectModal")
        }
        handleOk={() => this.props.exitModal("showReportInThePastSelectModal")}
        showOk={false}
        showCancel={false}
        okMessage={"Confirm Submit"}
        cancelMessage={"Cancel"}
        cancelBtnType={""}
        okBtnType={"primary"}
        title={"Select a report to replace the current content"}
      >
        <ReportsInThePast data={this.props.data} handleReplace={this.props.handleReplace} />
      </Modal>)
    }
}

export default ReportInThePastSelectModal;