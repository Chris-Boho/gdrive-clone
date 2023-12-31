import React, { useState, useRef } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import CenteredContainer from './CenteredContainer';

export default function UpdateProfile() {
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)
    const { currentUser, changeEmail, changePassword } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (emailRef.current !== null && passwordRef.current !== null && passwordConfirmRef.current !== null) {
            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
                return setError("Passwords do not match")
            }

            const promises = []
            setLoading(true)
            setError("")

            if (emailRef.current.value !== currentUser?.email) {
                promises.push(changeEmail(emailRef.current.value))
            }
            if (passwordRef.current.value) {
                promises.push(changePassword(passwordRef.current.value))
            }

            Promise.all(promises).then(() => {
                navigate("/user")
            }).catch(() => {
                setError("Failed to update account")
            }).finally(() => {
                setLoading(false)
            })
        }

    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4'>Update Profile</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={currentUser?.email as string} />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} placeholder='Leave blank to keep the same' />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} placeholder='Leave blank to keep the same' />
                        </Form.Group>
                        <Button disabled={loading} className='w-100 mt-3' type='submit'>Update</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                <Link to={"/user"}>Cancel</Link>
            </div>
        </CenteredContainer>
    )
}
