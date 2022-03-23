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

function Register() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        setisloading(true)
        axios.get(_GLobal_Link._link_simple + 'api/register/' +
            data.email + "/" + data.firstname + "/" + data.lastname + "/" + data.address + "/" +
            data.postal + "/" + data.city + "/" + data.country + "/" + data.password, {
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
                    if (res.data === "This email already exists.") {
                        setregisteringError(true);
                        setregisteringErrorText(res.data)
                    } else {
                        setregisteringError(false);
                        setregisteringErrorText("")
                        localStorage.setItem("session_token", res.data);
                        localStorage.setItem("user_name", res.data[1])
                        dispatch(loginAction(true, res.data[1]));
                        navigate("/");
                    }
                }
            });
    }
    const [isloading, setisloading] = useState(false);
    const [registeringError, setregisteringError] = useState(false);
    const [registeringErrorText, setregisteringErrorText] = useState('');
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
                <div className="title">Welcome</div>
                <div className="subtitle">Let's create your account!</div>

                {isloading === true ?
                    <div style={{ marginTop: "20px" }}>
                        <CircularProgress />
                    </div> : <></>
                }
                <div className='inputBoxBlock'>
                    <div className="input-container ic1">
                        <input id="firstname"  {...register("firstname", { required: true })} className="input" type="text"
                            placeholder="" />
                        <div className='errors'>
                            {errors.firstname?.type === 'required' && "First name is required"}
                        </div>
                        <div className="cut"> </div>
                        <label htmlFor={"firstname"} className="placeholder">First name</label>
                    </div>

                    <div className="input-container ic1">
                        <input id="lastname" {...register("lastname", { required: true })} className="input" type="text"
                            placeholder=" " />
                        <div className='errors'>
                            {errors.lastname?.type === 'required' && "Last name is required"}
                        </div>
                        <div className="cut"></div>
                        <label htmlFor={"lastname"} className="placeholder">Last Name</label>
                    </div>
                </div>
                <div className='inputBoxBlock'>
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
                    <div className="input-container ic1">
                        <input {...register("address", { required: true })} id="address" className="input" type="text" placeholder=" " />
                        <div className='errors'>
                            {errors.address && "Address is required"}
                        </div>
                        <div className="cut"></div>
                        <label htmlFor={"address"} className="placeholder">Address</label>
                    </div>
                    <div className="input-container ic1">
                        <input {...register("postal", { required: true, pattern: /[0-9]$/ })} id="postal" className="input" type="number" placeholder=" " />
                        <div className='errors'>
                            {errors.postal && "Postal is required"}
                        </div>
                        <div className="cut"></div>
                        <label htmlFor={"postal"} className="placeholder">Postal</label>
                    </div>
                </div>
                <div className='inputBoxBlock'>
                    <div className="input-container ic1">
                        <input {...register("city", { required: true })} id="city" className="input" type="text" placeholder=" " />
                        <div className='errors'>
                            {errors.city && "City is required"}
                        </div>
                        <div className="cut"></div>
                        <label htmlFor={"city"} className="placeholder">City</label>
                    </div>
                    <div className="input-container ic1">
                        <input  {...register("country", { required: true })} id="country" className="input" type="text" placeholder=" " />
                        <div className='errors'>
                            {errors.country && "Country is required"}
                        </div>
                        <div className="cut"></div>
                        <label htmlFor={"country"} className="placeholder">Country</label>
                    </div>
                </div>
                <div className='inputBoxBlock'>
                    <div style={{ width: '100%', position: 'relative' }}>
                        <input type='submit' className="submit" value={"Sign up"} />
                    </div>
                </div>
                <p style={{ marginLeft: '20px', marginRight: '20px', color: 'gray' }}>By registering for an account, you agree to our terms of use. Please read our privacy policy.</p>
                {/* <input type="text" name="_token" value="{{ csrf_token() }}" /> */}
            </form>
        </div>
    );
}

export default Register;
