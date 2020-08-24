import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../../../styles/Main/ReportManagement/ReportManagement.css';
import { List, Avatar, Space, Row, Col} from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import ViewBoard from '../WriteManagement/ViewBoard'
const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

class NoteItem extends Component {
    state={
        note:this.props.note,
        
    }
    componentDidMount(){
        
    }
    render() {
        return (
           <div style={{backgroundColor:"white",paddingLeft:10,textAlign:"left"}}>
               <a onClick={()=>this.props.closeDetail()}>返回</a>
               <Row>
                    <Col><h2><strong>{this.props.note.title}</strong></h2></Col>
               </Row>
               <Row>
                <ViewBoard content={this.props.note.content} theme={this.props.note.title} height={"80vh"} width={"80vw"}/>
               </Row>
           </div>
        );
    }
}

export default NoteItem;