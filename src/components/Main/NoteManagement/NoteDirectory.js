import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Tree, Input, message} from "antd";
import { CarryOutOutlined} from '@ant-design/icons';
import {getDirectoryListService} from "../../../services/noteService";
import "../../../styles/Main/NoteManagement/NoteItem.css";

const { DirectoryTree } = Tree;
class NoteDirectory extends Component {
    state={
        autoExpandParent: true,
        directoryData: [],
    }
    componentDidMount(){
        getDirectoryListService().then((res) => {
            console.log(res);
            this.setState({directoryData:res.all.children});
            // message.success("success");
        }).catch((err) => {
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                message.error("获取目录失败");
            }
        });
    }

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
        if(event.node.noteId > 0){
            console.log("选中博客");
            this.props.showDetail(event.node.noteId);
        }
    };
    
    onExpand = () => {
        console.log('Trigger Expand');
    };
    
    render(){
        return (
            <DirectoryTree
            // multiple
            // defaultExpandAll
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            // treeData={loop(this.state.directoryData)}
            treeData={this.state.directoryData}
            style={{textAlign:"left"}}
            />
            
        );
    }
}

export default NoteDirectory;