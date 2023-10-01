import React, { Component } from 'react'
import { Statistic, Icon, Grid, Container, Image, Segment, Dimmer, Loader } from 'semantic-ui-react'
import { authApi } from '../../services/AuthApi'
import { handleLogError } from '../helpers/Helpers'

class Home extends Component {
  state = {
    numberOfUsers: 0,
    isLoading: false
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    try {
      let response = await authApi.numberOfUsers()
      const numberOfUsers = response.data.length

      this.setState({ numberOfUsers })
    } catch (error) {
      handleLogError(error)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { isLoading } = this.state
    if (isLoading) {
      return (
          <Segment basic style={{ marginTop: window.innerHeight / 2 }}>
            <Dimmer active inverted>
              <Loader inverted size='huge'>Loading</Loader>
            </Dimmer>
          </Segment>
      )
    } else {
      const { numberOfUsers } = this.state
      return (
          <Container text>
            <Grid stackable columns={1}>
              <Grid.Row textAlign={"center"}>
                <Grid.Column textAlign='center'>
                  <Segment color='purple'>
                    <Statistic>
                      <Statistic.Value><Icon name='user' color='grey' />{numberOfUsers}</Statistic.Value>
                      <Statistic.Label>Users</Statistic.Label>
                    </Statistic>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' style={{ marginTop: '2em' }} />
            <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
          </Container>
      )
    }
  }
}

export default Home