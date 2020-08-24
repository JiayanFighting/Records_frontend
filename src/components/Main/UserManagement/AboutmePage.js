import React from 'react';
import {Avatar, Button,message,Table,Select, Popconfirm, Form,DatePicker, InputNumber,Row,Col,Space,Tag, Card} from "antd";
import 'antd/dist/antd.css';
import ViewBoard from "../WriteManagement/ViewBoard";
const { Meta } = Card;

const { RangePicker } = DatePicker;
const aboutme = 
`## 个人简介

### 基本信息

姓名：黄家晏

年龄：23岁   

Email： JiayanFighting@qq.com

<img src="../../../image/aboutme.jpg" alt="50" style="zoom:15%;" />

### 教育背景

**2019.9-2021.6**                **哈尔滨工业大学**                **计算机科学与技术**            **硕士**

实验室：海量数据计算研究中心                         

研究方向：边缘计算，移动边缘计算系统中的任务调度算法和边缘云的定价博弈

**2015.9-2019.6**              **哈尔滨工业大学**               **软件工程**             **学士**

专业排名：4/101          CET-6 

主修课程：数据结构，算法分析与设计，操作系统，计算机网络，数据库系统，Java，Java EE 等。

### 专业技能

* 熟悉**Java**语法，具有Java编程相关经验
* 对JVM，垃圾回收机制，内存模型等有一定了解   
* 对**数据结构**、算法有一定了解 
* 了解常用Java开源框架， **SpringMVC、Spring Boot、MyBatis**等 
* 熟悉**MySQL**，**Redis**等主流数据库，熟悉事务、索引等数据库相关技术 
* 熟悉**HTTP，TCP，IP**等网络协议 
* 了解PHP语言，有一定的PHP编程相关经验 
* 了解HTML、CSS、AJAX等前端技术和**React**技术框架
* 掌握Git，SVN，Charles，Matlab等常用工具

### 实习经历

**2018.8-2019.5**                                       **北京小唱科技有限公司**                                       **后端开发实习生**

**责任描述：** 

1. 唱吧App的功能开发，包括版本功能开发，活动开发等。 
2. 礼物系统重构。从后端系统中解耦出礼物相关功能，兼容原接口，重新构建礼物系统，并引入定制化礼物箱功 能，实现礼物后台接口。 
3. 活动数据的统计，线上bug的修复等。 

涉及技术：PHP，Nginx，数据库相关技术，包括MySQL，Redis，Memcached等。

**2017.7-2017.8**                                                      **东软**                                                       **开发实习生**

功能描述：管理公司的人员出勤情况；员工职位变化，部门更改等信息管理；员工请假，逐级审批，假期计算等 功能。 

责任描述： 数据库的设计；系统功能模块的划分；部门信息管理和请假管理的代码的书写；组员工作的分配；代 码的整合。 

涉及技术：Spring，SpringMVC，Mybatis，MySQL等。

### 项目经验

**2018.11-2019.3**                                    **评论过滤系统**

功能描述：用户进行评论操作时，进行评论的分类，筛选中言语不当的评论，阻止该评论的发表。 

系统设计：分为四个模块，首先对文本和用户属性数据的提取，然后将提取的数据进行预处理，再用朴素贝叶斯 算法训练分类模型，最后利用互信息和左右信息熵在负面评论中挖掘新的骂人词汇，辅助分类模型进行强分类， 优化分类效果。 

涉及技术：机器学习，MySQL，Redis，Python等。

**2017.12-2018.3**                                   **渠道交易平台**

功能描述：渠道商，销售人员，渠道商管理人员，商户，系统管理人员的信息管理；订单管理，提成计算等；权 限管理。 

责任描述：不同级别的渠道商服务商和代理商的信息处理；销售人员的信息管理；各级渠道商和销售人员的交易 统计，提成计算；文件的导入与导出。 

涉及技术：SpringBoot，Mybatis，MySQL，Thymeleaf，Shiro等。

**2017.11-2017.12**                                    **编译器**

功能描述： 

• 词法分析。根据输入的代码，自动识别出单词关键字数字等，列出token 序列。能识别各种单词拼写错误。 

• 语法分析。能识别声明语句，赋值语句，分支语句，循环语句等，构造语法分析树，并具备语法错误处理能力。 

• 语义分析。识别常用语句类型，并生成中间代码，列出符号表，三地址指令和四元式序列等，并具备语义错误处 理能力，能准确给出错误所在位置，并采用可行的错误恢复策略。

### 研究方向

Paper：《Approximated Assignment Algorithms for Unordered and Ordered Tasks in Data Shared MEC Systems 》            

 Journal: Transactions on Mobile Computing             

Status：Under Review 

本文详细研究了数据共享移动边缘计算系统中的任务分配算法。针对MEC系统中常见的有序任务，给出了一种启 发式算法。从理论上分析了该问题的难易程度、算法的正确性、复杂度。最后，进行了大量的实验研究。理论分 析和实验结果均表明，所提出的算法在时延、满足率和能量消耗方面都具有较高的性能。

### 荣誉奖项

* 一等优秀推免奖学金，长园奖学金 
* 多次获得一等人民奖学金，励志奖学金 
* 蓝桥杯Java软件开发大学A组二等奖 
* 基于Unity3D冒险类游戏开发二等奖 

### 个人评价

* 乐观开朗，适应能力强，能接受加班和出差  
* 热爱写代码，有良好的编程习惯  
* 具有良好的沟通能力，能快速融入团队  
* 有责任心，学习能力强



<font color=#EEA9B8 >**谢谢观看！ 如果有合适的工作岗位，欢迎联系！**</font>


`
class AboutmePage extends React.Component {

    state={
        
    };


   
    render() {
        return (
            <div style={{backgroundColor:"white"}}>
                <div  style={{paddingLeft:20}}>
                <ViewBoard content = {aboutme} theme={"个人简历"} height={"90vh"} width={"90vw"}/>
                </div>
            </div>
        );
    }
}

export default AboutmePage;