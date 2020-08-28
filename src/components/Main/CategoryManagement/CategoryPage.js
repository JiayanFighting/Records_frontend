import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../../../styles/Main/ReportManagement/ReportManagement.css';
import { message} from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import {getNotesListService} from "../../../services/noteService";
import { IMAGE_ROOT } from '../../../constants';

class CategoryPage extends Component {
    state={
        notes:[],
        note:[],
        showNoteDetailPage:false,
    }
    componentDidMount(){
        // getNotesListService(this.props.userInfo.id).then((res) => {
        //     console.log(res)
        //     if(res.code === 0){
                
        //         this.setState({notes:res.list});
        //     }else{
        //         console.log(res)
        //     }
        // }).catch((err) => {
        //     if (err === 302) {
        //         this.props.onSessionExpired();
        //     } else {
        //         message.error("Failed to get notes");
        //     }
        // });
    }
    render() {
        return (
           <div>
               这是分类页面<br/>
               待更新...
           </div>
        );
    }
}

export default CategoryPage;