import React, {Component} from 'react';
import {Button, Card} from 'antd';
import '../../../styles/HelperComponents/Modal/Modal.css';
import {CloseOutlined} from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import FileSaver from "file-saver";
import marked from "marked";
class PDFDownload extends Component {

    render() {
        const renderer = new marked.Renderer();
        renderer.link = function(href, title, text) {
            return `<a target="_blank" rel="noopener noreferrer" href="${href}" title="${title}">${text}</a>`;
        };
        return (
            <div>
            <ReactToPrint
                trigger={() => <a>PDF</a>}
                content={() => this.componentRef}
            />
            <div style={{ display: "none" }}>
                <div
                    style={{ textAlign: "center" }}
                    ref={(el) => (this.componentRef = el)}
                >
                <Card title={this.props.title}>
                    <div
                        className="preview"
                        style={{ "text-align": "left" }}
                        dangerouslySetInnerHTML={{
                        __html: marked(this.props.content, {
                            renderer: renderer,
                            breaks: true,
                            gfm: true,
                        }),
                        }}
                    />
                </Card>
                </div>
            </div>
            </div>
        );
    }
}

export default PDFDownload;