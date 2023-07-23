import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const MainNav = () => {
  return (
    <Navbar expand="lg" className="nav-bar">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="CS 348"
            src="/caret-down-fill.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          CS 348
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/incidents">Incidents</Nav.Link>
            <Nav.Link href="/agencies">Agencies</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text style={{fontSize: "12px"}}>
            The <em>Washington Post</em> police shooting data project
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNav;
