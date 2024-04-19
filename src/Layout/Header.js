// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavScrollExample() {
  return (
    <Navbar expand="lg" className="bg-body-secondary">
    
      <Container fluid>
        <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/Home">Home</Nav.Link>
            <Nav.Link href="/ReduxForm">Redux</Nav.Link>
            <Nav.Link href="/SagaForm">reduxsaga</Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Usestate</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                UseReducer
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                UseContext
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Hooks" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/usformapi">UsestateApi</NavDropdown.Item>
              <NavDropdown.Item href="/UrFormapi">
                UseReducerApi
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/UcFormapi">
                UseContextApi
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;