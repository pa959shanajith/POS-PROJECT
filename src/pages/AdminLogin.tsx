import React from "react";
import {Form, Input} from "antd";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import "../assets/scss/pages/login.scss";
import {withRouter} from "react-router-dom";
import {toast} from "react-toastify";
import POS_LOGO from "../assets/images/pos-logo.jpeg";
import BrowserHelperService from "../services/browser-helper.service";
import AuthService from "../services/auth.service";
import {connect} from "react-redux";
import {posActions} from "../reducers/pos-reducer";
import POSBackendApiService from "../services/pos-backend-api.service";

interface IState {
    [key: string]: any; // or the type of your input
    email: string,
    password: string
}

class AdminLogin extends React.Component<any,IState> {

    state: IState = {
        email: '',
        password: '',
    }

    changeHandler = (e: any): void => {
      this.setState({
        [e.target.name]: e.target.value
      });
    }

    continue = async () => {
        if (this.state.email && this.state.password) {
            const res = await AuthService.adminLogin({
                email: this.state.email,
                password: this.state.password,
            });
            if (res.success) {
                const sessionRes = await AuthService.getCurrentSession();
                const sessionId = sessionRes.success ? sessionRes.data.id : undefined;
                this.props.initAdminData({ shop: res.data.data, sessionId });

                // Fetching the basic POS Setup data
                const basicPOSSetupRes = await POSBackendApiService.getBasicSetup();
                if (basicPOSSetupRes.success) {
                    this.props.initBasicPosData(basicPOSSetupRes.data);
                } else {
                    console.log(basicPOSSetupRes.message);
                }
                // Navigate to the employee login screen
                this.props.history.push("/employee-login");
                // Check if we have any
                BrowserHelperService.goFullScreen();
                toast.success('Logged in as Admin!');
            } else {
                toast.error('Something went wrong');
            }
        } else {
            toast.error('Please enter both email and password to login!');
        }
    }

    render() {
      return(
          <div className="signin">
              <div className="signin-pos-logo-container">
                  <img src={POS_LOGO} alt="logo"/>
              </div>
              <div className='signin-main-container'>
                  <div className='signin-content-container'>
                      <div className='signin-header'>
                          <span>POS ADMIN LOGIN</span>
                      </div>
                      <Form>
                          <div className='signin-email-container input-container'>
                              <div className='signin-email-header'><span>Email-ID</span></div>
                              <Input onChange={this.changeHandler}
                                     type='email'
                                     name='email'
                                     placeholder='johndoe@gmail.com'
                                     prefix={<UserOutlined />}
                                     style={{ width: "100%" }}/>
                          </div>
                          <div className='signin-password-container input-container'>
                              <div className='signin-password-header'>
                                  <span className='signin-password-header-primary'>Password</span>
                              </div>
                              <Input onChange={this.changeHandler}
                                     prefix={<LockOutlined />}
                                     name='password'
                                     type='password'
                                     placeholder='**********'
                                     style={{ width: "100%" }}/>
                          </div>
                      </Form>
                      <button onClick={this.continue} className='signin-button' disabled={!(this.state.email && this.state.password)}>
                          <span>Sign In</span>
                      </button>
                  </div>
              </div>
          </div>
      );
    }
}

const mapDispatchToProps = (dispatch: any)=>{
    return{
        initAdminData: (payload: any) => {
            dispatch({
                type: posActions.INIT_ADMIN_DATA,
                payload,
            })
        },
        initBasicPosData: (payload: any) => {
            dispatch({
                type: posActions.INIT_BASIC_POS_DATA,
                payload,
            });
        }
    }
}

export default withRouter(connect(null, mapDispatchToProps)(AdminLogin));
