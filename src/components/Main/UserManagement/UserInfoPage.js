import React from 'react';
import {Avatar, Upload,Tag, Card} from "antd";
import 'antd/dist/antd.css';
import ImgCrop from 'antd-img-crop';
import {saveAvatar} from '../../../services/photoService';
import { IMAGE_ROOT } from '../../../constants';

const { Meta } = Card;
class UserInfoPage extends React.Component {

    state={
        
    };

    // 预览
    onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    saveAPhoto= (file) => {
        const data = new FormData();
        data.append('photo',file);
        data.append('userId',this.props.userInfo.userId);
        saveAvatar(data).then((res) => {
            this.props.handleUpdateAvatar(res.url);
        }).catch((err) => console.log(err));
    }
   
    render() {
        return (
            <div style={{backgroundColor:"white",paddingTop:10}}>
                <ImgCrop rotate>
                <Upload
                    listType="text"
                    onChange={(info)=>{
                    const{status}  = info.file;
                    if (status !== 'uploading') {
                        this.saveAPhoto(info.file.originFileObj);
                    }
                }}
                    onPreview={this.onPreview}
                    name={this.props.userInfo.userEmail+".jpg"}
                    showUploadList={false}
                >
                    {/* {fileList.length < 5 && '+ Upload'} */}
                    {/* <a>Update avatar </a> */}
                    <Avatar size={100} src={IMAGE_ROOT+this.props.userInfo.avatar} />
                    {/* <Button>
                    <UploadOutlined /> Upload
                    </Button> */}
                </Upload>
                </ImgCrop>

                {/* <Avatar size={100} src={this.props.userInfo.avatar} /> */}
                <Card bordered={false}>
                <Meta title={this.props.userInfo.username}
                description={this.props.userInfo.email+"\n"}
                />
                </Card>
                <Card bordered={false}>
                    <Tag color="magenta">Java</Tag>
                    <Tag color="volcano">Spring</Tag>
                    <Tag color="orange">MySQL</Tag>
                    <Tag color="gold">Redis</Tag>
                    <Tag color="red">计网</Tag>
                    <Tag color="lime">操作系统</Tag>
                    <Tag color="green">Mybatis</Tag>
                    <Tag color="cyan">PHP</Tag>
                    <Tag color="blue">Git</Tag>
                    <Tag color="geekblue">Matlab</Tag>
                    <Tag color="purple">purple</Tag>
                </Card>
            </div>
            
        );
    }
}

export default UserInfoPage;