import React, {useContext, useEffect, useState} from 'react'
import {Container, Form, Segment, Button, Divider, Grid} from 'semantic-ui-react'
import {useNavigate} from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {authApi} from '../../services/AuthApi'

const UserSetting = () => {
    const navigation = useNavigate();
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState();
    const [inputs, setInputs] = useState();


    useEffect(() => {
        const user = authContext.getUser();
        setUser(user);
    }, [inputs]);

    const handleCancel = () => {
        navigation("/");
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        authApi.updateUser({isEnable2FA: inputs === "Yes"}, user?.person._id, user?.accessToken)
        authContext.userLogout();
        navigation("/login");
    }

    const onChange = (e) => {
        e.preventDefault();
        setInputs(e.target.value)
    }

    return (
        <Container>
            <Grid centered>
                <Grid.Row>
                    <Segment style={{width: '330px'}}>
                        <Form>
                            <strong>Settings</strong>
                            <Divider/>
                            <Form.Group inline align="center">
                                <label>Enable 2FA</label>
                                <Form.Field name="isEnable2FA" value="Yes"
                                            label={"Yes"} control="input"
                                            type="radio" checked={inputs ?
                                    inputs === "Yes" : user?.person?.isEnable2FA}
                                            onChange={onChange}/>
                                <Form.Field name="isEnable2FA" value="No"
                                            label={"No"} control="input"
                                            type="radio" onChange={onChange}
                                            checked={inputs ?
                                                inputs === "No" : !user?.person?.isEnable2FA}
                                />
                            </Form.Group>
                            <Button.Group fluid>
                                <Button type="button" onClick={handleCancel}>Cancel</Button>
                                <Button.Or/>
                                <Button positive onClick={handleSubmit}>Save</Button>
                            </Button.Group>
                        </Form>
                    </Segment>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

export default UserSetting;