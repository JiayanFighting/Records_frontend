import React, {Component} from 'react';
import 'antd/dist/antd.css';
import '../../../styles/Main/ReportManagement/ReportManagement.css';
import {Card} from "antd";
import marked from "marked";
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    return `<a target="_blank" href="${href}">${text}` + "</a>";
};
class PrintPage extends Component {

    render() {
        return (
            <div style={{textAlign:"center"}}>
                <Card title={this.props.report.theme}>
                            <div
                            className="preview"
                            style={{"text-align": "left"}}
                            dangerouslySetInnerHTML={{
                                __html: marked(this.props.report.content, {
                                    renderer: renderer,
                                    breaks: true,
                                    gfm: true,
                                }),
                            }}
                        />
                </Card>
            </div>
        );
    }
}

export default PrintPage;