import React from "react";
import { Component } from "react";
import {Result, Button} from 'antd';

class SubmitSuccess extends Component {
    state={

    }

    render() {
        return (
            <Result
            status="success"
            title={this.props.successTitle}
            subTitle={this.props.successDesc}
            extra={[
                <Button type="primary" key="console" onClick={() => {
                    this.props.changeTab(this.props.callbackPage);
                }}>
                    Close
                </Button>,
    ]}
  />
        );
    }
}

export default SubmitSuccess;