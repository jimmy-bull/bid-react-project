import React, { useState, useEffect } from 'react';
import '../style/login.css';
import axios from 'axios';
import { useForm } from "react-hook-form";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux';
import loginAction from '../app/actions/loginAction';
import {
    useNavigate
} from "react-router-dom";
import _GLobal_Link from './global';
function Login() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isloading, setisloading] = useState(false);
    const [registeringError, setregisteringError] = useState(false);
    const [registeringErrorText, setregisteringErrorText] = useState('');
    const onSubmit = data => {
        setisloading(true)
        axios.get(_GLobal_Link._link_simple + 'api/login/' +
            data.email + '/' + data.password, {
            headers: {
                "content-type": "application/json",
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': true,
                'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')
            },
        })
            .then((res) => {
                if (res.data !== undefined) {
                    setisloading(false);
                    if (res.data === "Cannot login, check your password or email.") {
                        setregisteringError(true);
                        setregisteringErrorText(res.data)
                    } else {
                        setregisteringError(false)
                        setregisteringErrorText("")
                        localStorage.setItem("session_token", res.data[0])
                        localStorage.setItem("user_name", res.data[1])
                        dispatch(loginAction(true, res.data[1]));
                        navigate("/");
                    }
                }
            });
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("session_token")) {
            axios.get(_GLobal_Link._link_simple + 'api/connected/' +
                localStorage.getItem("session_token"), {
                headers: {
                    "content-type": "application/json",
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Origin': true,
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')
                },
            })
                .then((res) => {
                    console.log(res.data)
                    if (res.data === 'Already connected') {
                        navigate("/")
                    }
                });
        }
    });
    return (
        <div className="formBodyLogin">
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                {registeringError === true ?
                    <div style={{ marginTop: "20px" }}>
                        <Alert severity="error">{registeringErrorText}</Alert>
                    </div> : <></>
                }
                <div className="title">Welcome back !</div>
                <div className="subtitle">Connection</div>

                {isloading === true ?
                    <div style={{ marginTop: "20px" }}>
                        <CircularProgress />
                    </div> : <></>
                }
                <div className='inputBoxBlockLogin'>
                    <div className="input-container ic2">
                        <input {...register("email", { required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ })}
                            id="email" className="input" type="email" placeholder=" " />
                        <div className='errors'>
                            {errors.email && "Enter a valid email"}
                        </div>
                        <div className="cut"></div>
                        <label htmlFor={"email"} className="placeholder">E-mail</label>
                    </div>
                    <div className="input-container ic2">
                        <input {...register("password", { required: true, pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ })}
                            id="password" className="input" type="password" placeholder=" " />
                        <div className='errors'>
                            {errors.password && "Minimum eight characters, at least one letter, one number and one special character"}
                        </div>
                        <div className="cut"></div>
                        <label htmlFor={"password"} className="placeholder">Password</label>
                    </div>
                </div>
                <div className='inputBoxBlock'>
                    <div style={{ width: '100%', position: 'relative' }}>
                        <input type='submit' className="submit" value={"Sign in"} />
                    </div>
                </div>
                <p style={{ marginLeft: '20px', marginRight: '20px', color: 'gray' }}>By Signing in , you agree to our terms of use. Please read our privacy policy.</p>
            </form>
        </div>
    );
}

export default Login;
