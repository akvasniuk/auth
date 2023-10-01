import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import { Container, Menu, Dropdown } from 'semantic-ui-react'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
 const { getUser, userIsAuthenticated, userLogout } = useAuth()

  const logout = () => {
   userLogout()
  }

  const enterMenuStyle = () => {
    return userIsAuthenticated() ? { "display": "none" } : { "display": "block" }
  }

  const logoutMenuStyle = () => {
    return userIsAuthenticated() ? { "display": "block" } : { "display": "none" }
  }

  const adminPageStyle = () => {
    const user = getUser()
    return user && user?.data.roles[0] === 'ADMIN' ? { "display": "block" } : { "display": "none" }
  }

  const userPageStyle = () => {
    const user = getUser()
    return user && user?.data.roles[0] === 'USER' ? { "display": "block" } : { "display": "none" }
  }

  const getUserName = () => {
    const user = getUser()
    return user ? user?.person.name : ''
  }

  return (
    <Menu inverted color='violet' stackable size='massive' style={{borderRadius: 0}}>
      <Container>
        <Menu.Item header>Auth-UI</Menu.Item>
        <Menu.Item as={Link} exact='true' to="/">Home</Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item as={Link} to="/login" style={enterMenuStyle()}>Login</Menu.Item>
          <Menu.Item as={Link} to="/signup" style={enterMenuStyle()}>Sign Up</Menu.Item>
          {
            getUser() && <Dropdown text={`Hi ${getUserName()}`} pointing className='link item'>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/settings">Settings</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          }
          <Menu.Item as={Link} to="/" style={logoutMenuStyle()} onClick={logout}>Logout</Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default Navbar
