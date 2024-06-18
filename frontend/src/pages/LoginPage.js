// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authActions';
import { Redirect } from 'react-router-dom';

const LoginPage = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const error = useSelector((state) => state.auth.error);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    if (isAuthenticated) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <form onSubmit={onSubmit}>
                <input type="email" name="email" value={email} onChange={onChange} required />
                <input type="password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
