import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import {Button, Form, Grid, Message, Segment} from 'semantic-ui-react'
import AuthContext from '../../context/AuthContext'
import {authApi} from '../../services/AuthApi'
import {handleLogError} from '../helpers/Helpers'
import userSignupValidator from "../../validators/user-signup-validator";
import Reaptcha from 'reaptcha';

class Signup extends Component {
    static contextType = AuthContext

    constructor(props) {
        super(props);
        this.captchaRef = React.createRef();
    }

    state = {
        password: '',
        name: '',
        email: '',
        isLoggedIn: false,
        isError: false,
        errorMessage: '',
        modalIsOpen: false,
        verifyEmail: false,
        age: "",
        captchaToken: ""
    }

    componentDidMount() {
        const Auth = this.context
        const isLoggedIn = Auth.userIsAuthenticated()
        this.setState({isLoggedIn})
    }

    handleInputChange = (e, {name, value}) => {
        this.setState({[name]: value})
    }

    verify = () => {
        this.captchaRef.current.getResponse().then(res => {
            this.setState({...this.state, captchaToken: res})
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const {password, name, email, age, captchaToken} = this.state
        if (!(password && name && email && age && captchaToken)) {
            this.setState({
                isError: true,
                errorMessage: 'Please, inform all fields!'
            })
            return
        }


        const usr = {password, name, email, age}

        const {error} = await userSignupValidator.validate(usr);

        if (error) {
            this.setState({
                isError: true,
                errorMessage: error.details[0].message
            })
            return
        }

        const user = {password, name, email, age}

        authApi.verifyToken(captchaToken)
            .then(response => {
                if (response.data.includes("Robot")) {
                    throw new Error("Token not valid");
                }
            })

        authApi.signup(user)
            .then(response => {
                this.setState({
                    name: '',
                    password: '',
                    isLoggedIn: true,
                    isError: false,
                    errorMessage: '',
                    verifyEmail: true,
                    age: 0,
                    captchaToken: ""
                })
            })
            .catch(error => {
                console.log(error)
                handleLogError(error)
                if (error.response && error.response.data) {
                    this.setState({
                        isError: true,
                        errorMessage: error.response.data.message
                    })
                }
            })
    }

    render() {
        const {isLoggedIn, isError, errorMessage} = this.state

        if (isLoggedIn) {
            return (
                <>
                    <Message success>Please verify your email and then login</Message>
                    <Button type="submit" color='purple' fluid size='large'
                    > <a href='/' as={NavLink} to="/">Home</a></Button>
                </>
            )
        } else {
            return (
                <Grid textAlign='center'>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Form size='large' onSubmit={this.handleSubmit}>
                            <Segment>
                                <Form.Input
                                    fluid
                                    name='email'
                                    icon='at'
                                    iconPosition='left'
                                    placeholder='Email'
                                    onChange={this.handleInputChange}
                                />

                                <Form.Input
                                    fluid
                                    name='password'
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    onChange={this.handleInputChange}
                                />
                                <Form.Input
                                    fluid
                                    name='name'
                                    icon='address card'
                                    iconPosition='left'
                                    placeholder='Name'
                                    onChange={this.handleInputChange}
                                />
                                <Form.Input
                                    fluid
                                    name='age'
                                    icon='address card'
                                    iconPosition='left'
                                    placeholder='Age'
                                    onChange={this.handleInputChange}
                                />
                                <Form.Input>
                                    <Reaptcha ref={this.captchaRef} sitekey={process.env.REACT_APP_SITEKEY}
                                              onVerify={this.verify}/>
                                </Form.Input>
                                <Button type="submit" color='purple' fluid size='large'
                                        onClick={this.handleSubmit}>Signup</Button>
                            </Segment>
                        </Form>
                        <Message>{`Already have an account? `}
                            <a href='/login' color='purple' as={NavLink} to="/login">Login</a>
                        </Message>
                        {isError && <Message negative>{errorMessage}</Message>}
                    </Grid.Column>
                </Grid>
            )
        }
    }
}

export default Signup