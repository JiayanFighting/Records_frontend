import React from 'react';
import {Input,Switch ,Card, Row, Col, Button,message,Form} from "antd";
import 'antd/dist/antd.css';
import ViewBoard from "../WriteManagement/ViewBoard";
import {removeLineService} from '../../../services/toolService'
import {CopyToClipboard} from 'react-copy-to-clipboard';

const { TextArea } = Input;
class ToolPage extends React.Component {

    state={
        newContent:"",
        translatedContent:"",
        content:"",
        copied:false,
        showRemoveLine:false,
    };

    removeLine=(e)=>{
        console.log(e);
        console.log(e.content);
        removeLineService(e.content).then((res) => {
            if(res.code === 0){
                this.setState({newContent:res.data,translatedContent:res.translatedData})
            }else{
                console.log(res)
            }
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("Failed to get notes");
            }
        });
    }

    changeRemoveLine=()=>{
        this.setState({
            showRemoveLine:!this.state.showRemoveLine,
        })
    }

   
    render() {
        return (
            <div style={{backgroundColor:"white"}}>
                <Row>
                    <Col span ={8}>
                    <h2 style={{fontSize:"1em",fontWeight: 600,margin: 5,textAlign:"left"}}>输入文本:</h2>
                    <Form
                    name="basic"
                    onFinish={this.removeLine}
                    >
                        <Form.Item name="content">
                            <TextArea style={{height:"70vh"}} />
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" htmlType="submit">转换</Button>
                            {/* <Button type="primary" htmlType="submit">转换并翻译</Button>
                            <Button type="primary" htmlType="submit">直接翻译</Button> */}
                        </Form.Item>
                    </Form>
                    </Col>
                    
                    <Col span={this.state.showRemoveLine?8:16}>
                        
                        <h2 style={{fontSize:"1em",fontWeight: 600,margin: 5,textAlign:"left"}}>
                            <Switch
                                defaultUnChecked
                                onClick={() => this.changeRemoveLine()}
                            />&nbsp;&nbsp;
                            翻译结果:&nbsp;&nbsp;&nbsp;
                            <CopyToClipboard text={this.state.translatedContent} onCopy={() => this.setState({copied: true})}>
                            <a>复制</a>
                            </CopyToClipboard>
                        </h2>
                        <div style={{paddingLeft:5}}>
                        <ViewBoard content={this.state.translatedContent}
                        withoutTitle={true}
                        height={"70vh"}/>
                        </div>
                    </Col>

                    {this.state.showRemoveLine?
                        <Col span={8} style={{paddingLeft:5}}>
                            <h2 style={{fontSize:"1em",fontWeight: 600,margin: 5,textAlign:"left"}}>去除换行:</h2>
                            <div style={{padding:5}}>
                            <TextArea style={{height:"70vh"}} value={this.state.newContent}/>
                                {/* <ViewBoard 
                                content={this.state.newContent}
                                height={"70vh"}
                                withoutTitle={true}
                                /> */}
                            </div>
                        </Col>
                        :
                        ""
                    }
                    
                </Row>
               
            </div>
        );
    }
}

export default ToolPage;