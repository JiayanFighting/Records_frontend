import React, {Component} from 'react';
import {Button, Card} from 'antd';
import '../../../styles/HelperComponents/Modal/Modal.css';
import {CloseOutlined} from "@ant-design/icons";

class Modal extends Component {

    render() {
        if (!this.props.show) {
            return null;
        }
        let {okBtnType, showOk, title, okMessage, cancelBtnType, showCancel, cancelMessage, children,showMidButton,midMessage,okDanger,cancelDanger,midDanger} = this.props;
        okBtnType = okBtnType === undefined ? "primary" : okBtnType;
        showOk = showOk === undefined ? true : showOk;
        okMessage = okMessage === undefined ? "OK" : okMessage;
        cancelBtnType = cancelBtnType === undefined ? "" : cancelBtnType;
        showCancel = showCancel === undefined ? "true" : showCancel;
        cancelMessage = cancelMessage === undefined ? "Cancel" : cancelMessage;
        title = title === undefined ? "" : title;
        midMessage = midMessage ? midMessage : '';
        return (

            <div className={"modal"}>
                <section className={"modal-main"}>
                    <Card title={title} extra={<a href={"#"} onClick={this.props.handleCancel}><CloseOutlined /></a>}>
                        <div>{children}</div>
                    </Card>
                    <Button className={"okBtn"}
                            type={okBtnType}
                            onClick={this.props.handleOk}
                            style={showOk ? {} : {"display": "none"}}
                            danger={okDanger}
                    >
                        {okMessage}
                    </Button>
                    {showMidButton?<Button onClick={this.props.handleClickMid} type={okBtnType} danger={midDanger} className={"okBtn"}>{midMessage}</Button>:''}
                    <Button
                        className={"cancelBtn"}
                        type={cancelBtnType}
                        onClick={this.props.handleCancel}
                        style={showCancel ? {} : {"display": "none"}}
                        danger={cancelDanger}
                    >
                        {cancelMessage}
                    </Button>
                    
                </section>

            </div>
        );
    }
}

export default Modal;