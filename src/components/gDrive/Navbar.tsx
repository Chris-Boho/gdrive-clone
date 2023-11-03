import { Navbar, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function NavbarComponent() {
  return (
    <Navbar bg="light" expand="sm">
        <Navbar.Brand className="me-auto p-2" as={Link} to={"/"}>
            <h3>GDrive</h3>
        </Navbar.Brand>
        <Nav>
            <Nav.Link className="fs-5" as={Link} to={"/user"} >Profile</Nav.Link>
        </Nav>

    </Navbar>
  )
}
