import React, { Component } from "react";
import {Button} from "antd";
import "antd/dist/antd.css";
import '../../../styles/WriteAndViewBoard/Helper.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
/**
 * mark down help
 */
class Helper extends Component {
  state = {
    item:"shortcuts",
    tagChecked:false,
    copied:false,
  };
  
  changeTag=(tag)=>{
    this.setState({item:tag,copied:false});
  }

  getDetailContent=()=>{
    if(this.state.item === "shortcuts") {
      return (
        <div>
          <h2><strong>💗Shortcuts💗</strong></h2>
          <p><strong>Search:</strong> Ctrl-F (PC), Cmd-F (Mac)</p>
          <p><strong>Replace:</strong> Shift-Ctrl-F (PC), Cmd-Opt-F (Mac)</p>
          <p><strong>ReplaceAll:</strong> Shift-Ctrl-R (PC), Shift-Cmd-Opt-F (Mac)</p>
          <p>
          <strong>Locate cursor:</strong> Alt-G (PC), Opt-G (Mac)，for example
            9:26，move to row 9 col 26
          </p>
      </div>
      );
    }else if(this.state.item ===  "catalogue"){
      return (
        <div>
          <h2><strong>目录</strong></h2>
          <h2># 一级目录</h2>
          <h3>## 二级目录</h3>
          <h4>## 三级目录</h4>
        </div>
      );
    }else if(this.state.item === "title"){
      const text="# This is header one\n## This is header two\n### This is header three\n#### This is header four\n##### This is header five\n";
      return (
        <div>
          <h2><strong>🧡Headers🧡</strong></h2>
          <p>
            <CopyToClipboard text={text} onCopy={() => this.setState({copied: true})}>
              {this.state.copied ? <span>Copied.</span> : <a>Copy to clipboard</a>}
            </CopyToClipboard>
          </p>
          <h2># This is header one</h2>
          <h3>## This is header two</h3>
          <h4>### This is header three</h4>
          <h5>#### This is header four</h5>
          <h6>##### This is header five</h6>
        </div>
      );
    }else if(this.state.item === 'text'){
      const text="*Italic* _Italic_\n**Bold** __Bold__\n~~Delete the text~~\n>Blockquotes\n";
      return (
        <div>
          <h2><strong>💛Text Style💛</strong></h2>
          <p>
            <CopyToClipboard text={text} onCopy={() => this.setState({copied: true})}>
              {this.state.copied ? <span>Copied.</span> : <a>Copy to clipboard</a>}
            </CopyToClipboard>
          </p>
          <p><em>*Italic*</em> <em>_Italic_</em></p>
          <p><strong>**Bold**</strong> <strong>__Bold__</strong></p>
          <p>~~Delete the text~~</p>
          <blockquote><p> &gt;Blockquotes</p></blockquote>
        </div>
      );
    }else if(this.state.item === 'list'){
      const text=`
- Project
  * Project
    + Project
  
1. Project1
2. Project2
3. Project3
  
- [ ] Plan task
- [x] Completed task`;
      return (
        <div>
          <h2><strong>💙Lists💙</strong></h2>
          <p>
            <CopyToClipboard text={text} onCopy={() => this.setState({copied: true})}>
              {this.state.copied ? <span>Copied.</span> : <a>Copy to clipboard</a>}
            </CopyToClipboard>
          </p>
          <p>
            - Project<br/>
            &nbsp; &nbsp;* Project<br/>
            &nbsp; &nbsp; &nbsp; &nbsp;+ Project<br/>
          </p>
          <p>
            1. Project1<br/>
            2. Project2<br/>
            3. Project3<br/>
          </p>
          <p>
            - [ ] Plan task<br/>
            - [x] Completed task
          </p>
        </div>
      );
    }else if(this.state.item === 'link'){
      const text=`
Link:
[link](https://weekly.omsz.io/).

Image:
![Alt](https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg)
<img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" />

Image with dimensions:
<img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" width="300" height="250"/>
<img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" width="50%"/>

The image is in the center:
<div align="center" > <img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" /> </div >

The image is on the right:
<img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" align="right"/>`;
      return (
        <div>
          <h2><strong>💜Links💜</strong></h2>
          <p>
            <CopyToClipboard text={text} onCopy={() => this.setState({copied: true})}>
              {this.state.copied ? <span>Copied.</span> : <a>Copy to clipboard</a>}
            </CopyToClipboard>
          </p>
          <p>
            <strong>Link: </strong><br/>
            [link](https://weekly.omsz.io/).
          </p>
          <p>
            <strong>Image: </strong><br/>
            ![Alt](https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg) <br/>
            &lt;img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" /&gt;
          </p>
          <p>
            <strong>Image with dimensions: </strong><br/>
            &lt;img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" width="300" height="250"/&gt; <br/>
            &lt;img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" width="50%"/&gt; 
          </p>
          <p>
            <strong>The image is in the center: </strong><br/>
            &lt;div align="center" &gt;
            &lt;img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" /&gt;
            &lt;/div &gt; 
          </p>
          <p>
            <strong>The image is on the right: </strong><br/>
            &lt;img src="https://weekly.omsz.io:3000/34/yixuan.zhang@dchdc.net/5567453515CC440AA41FF0D68890E36C.jpeg" align="right"/&gt; 
          </p>
        </div>
      );
    }else if(this.state.item === 'code'){
      const text="The following shows some `code slices`\n```\n// A code block\nvar foo = 'bar';\n```\n";
      return (
        <div>
          <h2><strong>💖Codes💖</strong></h2>
          <p>
            <CopyToClipboard text={text} onCopy={() => this.setState({copied: true})}>
              {this.state.copied ? <span>Copied.</span> : <a>Copy to clipboard</a>}
            </CopyToClipboard>
          </p>
          <p>The following shows some `code slices`</p>
          <p><code>
            ```<br/>
            // A code block<br/>
            var foo = &#39;bar&#39;;<br/>
            ```
          </code></p>
        </div>
      );
    }else if(this.state.item === 'table'){
      const text=`
Project | Value
-------- | -----
Computer | $1600
Phone | $12
others | $1

| Column 1 | Column 2 |
|:--------:| -------------:|
| text centered | text right-aligned |
| data| data |`;
      return (
        <div>
          <h2><strong>💚Tables💚</strong></h2>
          <p>
            <CopyToClipboard text={text} onCopy={() => this.setState({copied: true})}>
              {this.state.copied ? <span>Copied.</span> : <a>Copy to clipboard</a>}
            </CopyToClipboard>
          </p>
          <p>
          Project     | Value<br/>
          -------- | -----<br/>
          Computer  | $1600<br/>
          Phone  | $12<br/>
          others  | $1<br/>
          </p>
          <p>
          | Column 1 | Column 2      |<br/>
          |:--------:| -------------:|<br/>
          | text centered | text right-aligned |<br/>
          | data| data |<br/>
          </p>
        </div>
      );
    }
  }
  render() {
    
    return (
      <div>
        <div class="helper">
          <Button onClick={()=>this.changeTag("shortcuts")}>💗Shortcuts</Button>
          {/* <Button onClick={()=>this.changeTag("catalogue")}>目录</Button> */}
          <Button onClick={()=>this.changeTag("title")}>🧡Headers</Button>
          <Button onClick={()=>this.changeTag("list")}>💙Lists</Button>
          <Button onClick={()=>this.changeTag("text")}>💛Text Style</Button>
          
          <Button onClick={()=>this.changeTag("table")}>💚Tables</Button>
          <Button onClick={()=>this.changeTag("link")}>💜Links</Button>
          <Button onClick={()=>this.changeTag("code")}>💖Codes</Button>
          
        </div>
        <div>
          {this.getDetailContent()}
        </div>

      </div>
    );
  }
}
export default Helper;