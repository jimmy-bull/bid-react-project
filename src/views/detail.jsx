import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import '../style/products.css'
import {
    Link,
    useParams
} from "react-router-dom";
import { useForm } from "react-hook-form";
import '../style/detail.css'
import _GLobal_Link from './global';
import { Swiper, SwiperSlide } from "swiper/react";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Echo from "laravel-echo";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { FreeMode, Navigation, Thumbs } from "swiper";
import ScrollToTop from "react-scroll-to-top";
window.Pusher = require("pusher-js");

function Detail() {
    const [getproductName, setproductName] = useState('')
    const { id, category, categoryid, date } = useParams();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [getProductImage, setProductImage] = useState([])
    const [bidErrorText, setbidErrorText] = useState('Please insert a valid bid amount');
    const [bidValueFieldError, setbidValueFieldError] = useState(false);
    const [bidValueFieldErrorText, setbidValueFieldErrorText] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isloading, setisloading] = useState(false);
    const [NotconnectdError, setNotconnectdError] = useState(false);
    const [NotconnectdErrorText, setNotconnectdErrorText] = useState('');
    const [currentBid, setcurrentBid] = useState('');
    const [nextMinimumBid, setnextMinimumBid] = useState('');
    const [biderrDatta, setbiderrDatta] = useState([]);
    // const [peakChange, setpeakChange] = useState(0);
    // const [iterate, setIterate] = useState(0);

    useLayoutEffect(() => {
        // setpeakChange([])
        axios.get(_GLobal_Link.link + "product?id=" + id + '&include=media', {
            headers: {
                "content-type": "application/json",
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': true
            },
        }).then((res) => {
            setproductName(res.data.data.attributes['product.label'])
            for (let index = 0; index < res.data.included.length; index++) {
                if (res.data.included[index].type === 'media') {
                    setProductImage((prev) => [...prev, [res.data.included[index].attributes['media.url']]]);
                }
            }
        })
        axios.get(_GLobal_Link._link_simple + "api/getBid/" + id, {
            headers: {
                "content-type": "application/json",
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': true
            },
        }).then((res) => {
            if (res.data.currentBid === null) {
                setcurrentBid(0);
            } else {
                setcurrentBid(res.data.currentBid);
            }
            setnextMinimumBid(res.data.nextMinimumBid);

            setbiderrDatta(res.data.biderrDatta);
        })
    }, [])

    useLayoutEffect(() => {
        window.Echo = new Echo({
            broadcaster: "pusher",
            key: "3440a3a0631d8979ae20",
            cluster: "eu",
            forceTLS: true,
        });
        window.Echo.channel("bid-system-channel").listen(".bidsystem", (e) => {
            console.log(e)
            if (e.currentBid === null) {
                setcurrentBid(0);
            } else {
                setcurrentBid(e.currentBid);
            }
            setnextMinimumBid(e.nextMinimumBid);
            setbiderrDatta(e.biderrDatta);
        });
    }, [biderrDatta, nextMinimumBid, currentBid]);



    const onSubmit = data => {
        setisloading(true)
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
                    if (res.data === 'Already connected') {
                        axios.get(_GLobal_Link._link_simple + 'api/bid/' + id + '/' + localStorage.getItem("session_token") + '/' + data.postal, {
                            headers: {
                                "content-type": "application/json",
                                'Access-Control-Allow-Credentials': true,
                                'Access-Control-Allow-Origin': true,
                                'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')
                            },
                        }).then((res) => {
                            if (res.data !== 'Bid added') {
                                setbidValueFieldErrorText(res.data);
                                setbidValueFieldError(true)
                                setisloading(false);
                            } else {
                                setbidValueFieldError(false)
                                setisloading(false);
                            }
                            axios.get(_GLobal_Link._link_simple + 'api/broadcast/' + id, {
                                headers: {
                                    "content-type": "application/json",
                                    'Access-Control-Allow-Credentials': true,
                                    'Access-Control-Allow-Origin': true,
                                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')
                                },
                            }).then((res) => {
                               // alert('jimmy')
                            })
                        })
                    }

                });

        } else {
            setisloading(false)
            setNotconnectdError(true)
            setNotconnectdErrorText("You'll need to Sign in or Create a free account before bidding.")
            window.scrollTo(0, 0)
        }
    }
    const counterDate = (countDownDate, id) => {
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = new Date(countDownDate).getTime() - now;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (document.getElementById(id) !== null) {
            document.getElementById(id).innerHTML = 'The auction will end in ' + days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
        }
    }
    return (
        <div className='carouselBody'>
            <ScrollToTop smooth />
            <Backdrop
                sx={{ color: 'var(--base-color)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isloading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className='topLInk'>
                <Link to='/'>home /</Link>
                <Link to={'/product/' + categoryid + "-" + category}>{category} /</Link>
                <Link to='' onClick={(e) => e.preventDefault()}>{getproductName} /</Link>
                <Link style={{ color: '#007aff', fontWeight: 'bold' }} id={'detailDate' + id} to='' onClick={(e) => e.preventDefault()}>
                    {
                        setInterval(() => {
                            counterDate(date, 'detailDate' + id);
                        }, 1000)
                    }
                </Link>
            </div>
            {NotconnectdError === true ?
                <div style={{ marginTop: "20px" }}>
                    <Alert severity="error">{NotconnectdErrorText}</Alert>
                </div> : <></>
            }
            <div className='bidBlockItem'>
                <div>
                    <div>
                        <Swiper
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper2"
                        >
                            {
                                [...new Set(getProductImage)].map((data, key) => (
                                    <SwiperSlide key={key}>
                                        <img style={{ height: "80vh", objectFit: 'contain', background: '#f0f1f5' }} src={_GLobal_Link._link_simple + "aimeos/" + data} alt='' />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={7}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper"
                        >
                            {
                                [...new Set(getProductImage)].map((data, key) => (
                                    <SwiperSlide key={key}>
                                        <img style={{ height: "100px", objectFit: 'contain', }} src={_GLobal_Link._link_simple + "aimeos/" + data} alt='' />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
                <div className='titleDetailBlock'>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px', flex: 1, textAlign: 'start' }}>
                        <div className='titleDetail'>
                            <strong >{getproductName}</strong>
                        </div>
                        <div className='biftitleDetail'>
                            <strong>Current bid € {currentBid}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'gray', fontSize: '16px' }}>The current bid for this lot falls below its reserve price.</span>
                        </div>
                        <div>
                            <span style={{ color: 'gray', fontSize: '13px' }}>It’s a great time to bid!</span>
                        </div>
                        <div>
                            <span style={{ color: 'gray', fontSize: '13px' }}>The current bid is still under the estimate.</span>
                        </div>
                        <div className='biftitleDetail'>
                            <strong >Next minimum bid € {nextMinimumBid}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'gray', fontSize: '13px' }}>Auction fee: 9% of the winning bid</span>
                        </div>
                        <hr />
                        <div className='biftitleDetail'>
                            <strong >Quick bid</strong>
                        </div>
                        <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'space-evenly' }}>
                            <Button style={{ boxShadow: 'none', fontSize: '17px', color: 'white', background: 'var(--base-color)', display: 'flex', alignItems: 'center', flex: 1, marginLeft: "10px" }} variant="contained" >
                                <div>
                                    <span style={{ textTransform: 'lowercase' }}>€{3700}</span>
                                </div>
                            </Button>
                            <Button style={{ boxShadow: 'none', fontSize: '17px', color: 'white', background: 'var(--base-color)', display: 'flex', alignItems: 'center', flex: 1, marginLeft: "10px" }} variant="contained" >
                                <div>
                                    <span style={{ textTransform: 'lowercase' }}>€{3700}</span>
                                </div>
                            </Button>
                            <Button style={{ boxShadow: 'none', fontSize: '17px', color: 'white', background: 'var(--base-color)', display: 'flex', alignItems: 'center', flex: 1, marginLeft: "10px" }} variant="contained" >
                                <div>
                                    <span style={{ textTransform: 'lowercase' }}>€{3700}</span>
                                </div>
                            </Button>
                        </div>

                        <div className='biftitleDetail'>
                            <strong >Bid directly</strong>
                        </div>

                        <Paper onSubmit={handleSubmit(onSubmit)} component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', background: '#f0f1f5', color: 'gray', boxShadow: 'none', marginLeft: "10px", marginTop: '10px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <InputBase
                                    type='number'
                                    sx={{ flex: 1, fontFamily: "'Oswald', sans-serif" }}
                                    placeholder="€"
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                    id='postal'
                                    {...register("postal", { required: true, pattern: /[0-9]$/ })}
                                />
                                <strong style={{ color: 'red', marginLeft: '10px' }}>
                                    {errors.postal?.type === 'required' && bidErrorText}
                                </strong>
                            </div>

                            <Button type='submit' style={{ boxShadow: 'none', fontSize: '17px', color: 'white', background: 'var(--base-color)', display: 'flex', alignItems: 'center', marginLeft: "10px" }} variant="contained" >
                                <div>
                                    <span style={{ textTransform: 'lowercase' }}>Place Bid</span>
                                </div>
                            </Button>
                        </Paper>


                        {bidValueFieldError === true ?
                            <div style={{ marginTop: "20px" }}>
                                <Alert severity="error">{bidValueFieldErrorText}</Alert>
                            </div> : <></>
                        }
                        {/* 
                    <div className='biftitleDetail'>
                        <strong >Place an automatic bid</strong>
                    </div>
                    <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', background: '#f0f1f5', color: 'gray', boxShadow: 'none', marginLeft: "10px", marginTop: '10px', marginBottom: '20px' }}>
                        <InputBase
                            sx={{ flex: 1, fontFamily: "'Oswald', sans-serif" }}
                            placeholder="€"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <Button style={{ boxShadow: 'none', fontSize: '17px', color: 'white', background: 'var(--base-color)', display: 'flex', alignItems: 'center', marginLeft: "10px" }} variant="contained" >
                            <div>
                                <span style={{ textTransform: 'lowercase' }}>Automatic Bid</span>
                            </div>
                        </Button>
                    </Paper> */}
                        <hr />
                        <div style={{ height: '195px', overflow: 'scroll' }}>
                            {biderrDatta.map((data, key) => (
                                <div key={key} style={{ display: 'flex', marginTop: '10px', justifyContent: 'space-between', }}>
                                    <div>
                                        <strong style={{ fontSize: '14px' }}>{data.bider_id}</strong>
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        <strong style={{ color: 'gray', fontSize: '13px' }}>{new Date(data.created_at).toLocaleDateString("en-US") + ' --- ' +
                                            new Date(data.created_at).getHours() + ':' + new Date(data.created_at).getMinutes() + ':' + new Date(data.created_at).getSeconds()}</strong>
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        <strong style={{ fontSize: '14px' }}>  € {data.bidDirectly} </strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Detail;
