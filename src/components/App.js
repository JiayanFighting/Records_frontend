import React, { Component } from 'react';
import '../styles/App/App.css';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import NewMain from "./Main/NewMain";
import Login from "./Login/Login";
import {logout} from "../services/loginService";
import {TOKEN_KEY} from "../../src/constants";
import {showError} from "../services/notificationService";
import VisitorMain from './Visit/VisitorMain';
import { browserHistory } from 'react-router';


class App extends Component {

    state = {
        isLoggedIn: localStorage.getItem(TOKEN_KEY),
        userInfo: (localStorage.getItem(TOKEN_KEY) === undefined && localStorage.getItem(TOKEN_KEY).access_token) ? {} : JSON.parse(localStorage.getItem(TOKEN_KEY))
    };



    /**
     * decides what to render when the endpoint is ./home
     * @method getHome
     * @for App
     * @param none
     * @return Login Page or Main Page per user login status
     */
    getHome = () => {
        return this.state.isLoggedIn ?
            // <Main userInfo={this.state.userInfo} handleLogout={this.handleLogout} handleLogin={this.handleLogin} handleUpdateAvatar={this.handleUpdateAvatar}/> :
            <NewMain userInfo={this.state.userInfo} handleLogout={this.handleLogout} handleLogin={this.handleLogin} handleUpdateAvatar={this.handleUpdateAvatar}/> :
            <Redirect to={'/signin'}/>
    };

    getVisit = () => {
        console.log("visitor")
        console.log(window.location.href)
        let href = window.location.href;
        let host = href.split("/")[4];
        return <VisitorMain host={host} />
    };

    /**
     * decides what to render when the endpoint is ./login
     * @method getLogin
     * @for App
     * @param none
     * @return Login Page or Main Page per user login status
     */
    getLogin = () => {
        return this.state.isLoggedIn ? <Redirect to={'/home'}/> : <Login handleLogin={this.handleLogin}/>
    };

    /**
     * handle login scenario set user's login status and info
     * @method handleLogin
     * @for App
     * @param userinfo
     * @return null
     */
    handleLogin = (userInfo) => {
        this.setState({ isLoggedIn: true, userInfo: userInfo })
    };

    /**
     * handle logout scenario set user's login status
     * @method handleLogout
     * @for App
     * @param none
     * @return null
     */
    handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.clear();
        this.setState({isLoggedIn: false})
        // logout().then((res) => {
        //     this.setState({isLoggedIn: false})
        // }).catch((err) => {
        //     showError("Failed to logout, haha");
        // });
    };

    handleUpdateAvatar = (url) => {
        let NewUserInfo = this.state.userInfo;
        NewUserInfo.avatar = url;
        this.setState({userInfo:NewUserInfo})
    }


    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" render={this.getHome}/>
                        <Route path="/signin" render={this.getLogin}/>
                        <Route path="/home" render={this.getHome}/>
                        <Route path="/visitor" render={this.getVisit}/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }

}

export default App;
