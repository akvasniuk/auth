import React, {Component} from 'react'
import {Navigate, NavLink} from 'react-router-dom'
import {Button, Container, Form, Grid, Message, Modal, Segment} from 'semantic-ui-react'
import AuthContext from '../../context/AuthContext'
import {authApi} from '../../services/AuthApi'
import {handleLogError, parseJwt} from '../helpers/Helpers'
import userLoginValidator from "../../validators/user-login-validator";

class Login extends Component {
    static contextType = AuthContext

    state = {
        email: '',
        password: '',
        isLoggedIn: false,
        isError: false,
        isAuth: false,
        userId: "",
        modalIsOpen: true,
        token: "",
        errorMessage: ""
    }

    componentDidMount() {
        const Auth = this.context
        const isLoggedIn = Auth.userIsAuthenticated()
        this.setState({isLoggedIn})
    }

    handleInputChange = (e, {name, value}) => {
        this.setState({[name]: value})
    }

    handleSubmit = async (e) => {
        e.preventDefault()

        const {email, password} = this.state
        if (!(email && password)) {
            this.setState({isError: true})
            return
        }

        const {error} = await userLoginValidator.validate({email, password});

        if (error) {
            this.setState({
                isError: true,
                errorMessage: error.details[0].message
            })
            return
        }

        authApi.authenticate(email, password)
            .then(response => {
                if(response.data && response.data.accessToken){
                    const {accessToken } = response.data
                    const data = parseJwt(accessToken)
                    const person = response.data.user;
                    const user = {data, accessToken, person}

                    const Auth = this.context
                    Auth.userLogin(user);

                    this.setState({
                        email: '',
                        password: '',
                        isLoggedIn: true,
                        isError: false,
                        isAuth: false,
                        token: ""
                    })

                    return;
                }

                this.setState({isAuth: true, userId: response.data});

                this.setState({
                    email: '',
                    password: '',
                    isLoggedIn: false,
                    isError: false,
                    isAuth: true,
                    token: ""
                })
            })
            .catch(error => {
                handleLogError(error)
                this.setState({...this.state, isError: true, errorMessage: error.response.data.message})
            })
    }

    toggleModalDisplay = () => {
        this.setState({modalIsOpen: !this.state.modalIsOpen});
    };

    handleSave = (e) => {
        e.preventDefault();
        this.setState({token: e.target.value})
    }

    toggleSave = async () => {
        this.toggleModalDisplay();

        authApi.authenticateStepTwo(this.state.userId, this.state.token)
            .then(response => {
                const {accessToken } = response.data
                const data = parseJwt(accessToken)
                const person = response.data.user;
                const user = {data, accessToken, person}

                const Auth = this.context
                Auth.userLogin(user)
            })
            .catch(error => {
                handleLogError(error)
                this.setState({...this.state, isError: true, errorMessage: error.response.data.message})
            })

        this.setState({
            email: '',
            password: '',
            isLoggedIn: true,
            isError: false,
            isAuth: false,
            token: ""
        })
    }

    cancelTokenForm = () => {
        this.setState({
            email: '',
            password: '',
            isLoggedIn: false,
            isError: false,
            isAuth: false
        })
    }

    render() {
        const {isLoggedIn, isError, isAuth, modalIsOpen
            , errorMessage} = this.state;

        if (isLoggedIn) {
            return <Navigate to={'/'}/>
        } else {
            return (
                <Grid textAlign='center'>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Form size='large' onSubmit={this.handleSubmit}>
                            <Segment>
                                <Form.Input
                                    fluid
                                    autoFocus
                                    name='email'
                                    icon='at'
                                    iconPosition='left'
                                    placeholder='Email'
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                />
                                <Form.Input
                                    fluid
                                    name='password'
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                />
                                <Button color='violet' fluid size='large'>Login</Button>
                            </Segment>
                        </Form>
                        <Message>{`Don't have already an account? `}
                            <a href='/signup' color='violet' as={NavLink} to="/signup">Sign Up</a>
                        </Message>
                        {isError && <Message negative>{errorMessage}</Message>}
                    </Grid.Column>
                    {isAuth && <Modal
                        open={modalIsOpen}
                        onClose={() => this.toggleModalDisplay}
                    >
                        <Modal.Header>
                            Token Form
                            <Button type="button" onClick={() => this.setState({modalIsOpen: false})}
                            >Close</Button>
                        </Modal.Header>
                        <Modal.Content>
                            <Container>
                                <Grid centered>
                                    <Grid.Row>
                                        <Segment style={{width: '330px'}}>
                                            <Form>
                                                <strong>Token</strong>
                                                <Button.Group fluid>
                                                    <Button type="button"
                                                            onClick={this.cancelTokenForm}>Cancel</Button>
                                                    <Button.Or/>
                                                    <Button type="button" onClick={this.toggleSave} positive>Send</Button>
                                                </Button.Group>
                                                <Form.Input
                                                    fluid
                                                    autoFocus
                                                    name='token'
                                                    icon='lock'
                                                    iconPosition='left'
                                                    placeholder='Token'
                                                    onChange={this.handleSave}
                                                />
                                            </Form>
                                        </Segment>
                                    </Grid.Row>
                                </Grid>
                            </Container>
                        </Modal.Content>
                    </Modal>}
                </Grid>
            )
        }
    }
}

export default Login