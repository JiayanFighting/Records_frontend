import React, { Component } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  Input,
  Layout,
  message,
  PageHeader
} from "antd";
import "antd/dist/antd.css";
import '../../styles/Main/ReportManagement/ReportPage.css';
import {sendMessage} from "../../services/messageService";
import {FEEDBACK_OPERATION,DEVELOPER_EMAIL} from "../../constants";
import {showError, showSuccess} from "../../services/notificationService";

const { TextArea } = Input;

class Feedback extends Component {
    state={
        infoPage: false
    }

    onFinish = values => {
        let body = {
            from_name: this.props.userInfo.username,
            operation: FEEDBACK_OPERATION,
            from_email: this.props.userInfo.email,
            to_email:"yixuan.zhang@dchdc.net",
            content: "User Feedback: " + values.content,
            data: JSON.stringify({})
        };
        sendMessage(body).then((res) => {
            const successTitle = "Thank you for your feedback";
            const successDesc = "Contact t-yixzha@microsoft.com if you need any further help!";
            const callbackPage = "Write Report";
            this.props.successTab(successTitle,successDesc,callbackPage);
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to send feedback");
            }
        });

    }

    render(){
        const { infoPage } = this.state;

    //form css
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };
        return (
            <div className="card-container">
              <PageHeader
    className="site-page-header"
    title="Feedback"
    subTitle="Send us any feedback or bugs, thanks!"
  />
            <Layout>
        <div style={infoPage ? {} : { display: "none" }}>
        </div>
        <Row>
            <Col span={4}></Col>
            <Col span={16}>
            <Form
              style={{ width: 600 }}
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={() => alert("failed")}
            >
              <Form.Item
                label="Content"
                name="content"
                rules={[{ required: false, message: "Please input your suggestion and feedback!" }]}
              >
              <TextArea
                rows={18}
              />
              </Form.Item>
              <Form.Item {...tailLayout}></Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
            </Col>
            <Col span={4}></Col>
            </Row>
            </Layout>
            </div>
        );
    }
}

export default Feedback;