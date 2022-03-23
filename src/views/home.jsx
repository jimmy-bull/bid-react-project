import React, { useLayoutEffect, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Echo from "laravel-echo";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper";
import '../style/swipeHome.css'
import { EffectCreative } from "swiper";
import { Link } from "react-router-dom";
import _GLobal_Link from './global';
import axios from 'axios';
import { IonIcon } from "react-ion-icon";
import ScrollToTop from "react-scroll-to-top";

function Home() {

    const [FinalCarsouelData, setFinalCarsouelData] = useState([]);
    const [categorieFinalData, setcategorieFinalData] = useState([]);
    const [categorieFinalDataLAbel, setcategorieFinalDataLAbel] = useState([]);
    const [categorieFinalDataID, setcategorieFinalDataID] = useState([]);

    useLayoutEffect(() => {
        let relationShipid = [];
        let relationShipidCat = [];
        axios
            .get(_GLobal_Link.link + "catalog?include=catalog,media", {
                headers: {
                    "content-type": "application/json",
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Origin': true
                },
            })
            .then((res) => {
                for (let index = 0; index < res.data.included.length; index++) {
                    if (res.data.included[index].attributes['catalog.label'] === 'Carousel') {
                        if (res.data.included[index].links.self.href !== undefined) {
                            axios.get(res.data.included[index].links.self.href + "&include=catalog,media", {
                                headers: {
                                    "content-type": "application/json",
                                    'Access-Control-Allow-Credentials': true,
                                    'Access-Control-Allow-Origin': true
                                },
                            }).then((res2) => {
                                for (let index2 = 0; index2 < res2.data.included.length; index2++) {
                                    if (res2.data.included[index2].relationships !== undefined) {
                                        for (let index3 = 0; index3 < res2.data.included[index2].relationships.media.data.length; index3++) {
                                            relationShipid.push(res2.data.included[index2].relationships.media.data[index3].id)
                                        }
                                    }
                                    if (typeof relationShipid === 'object') {
                                        for (let index4 = 0; index4 < relationShipid.length; index4++) {
                                            if (res2.data.included[index2].id === relationShipid[index4]) {
                                                setFinalCarsouelData((prev) => [...prev, res2.data.included[index2].attributes["media.url"]])
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    } else {
                        if (res.data.included[index].type === 'catalog' && res.data.included[index].attributes['catalog.label'] !== 'Carousel') {
                            for (let index4 = 0; index4 < res.data.included.length; index4++) {
                                if (res.data.included[index4].relationships !== undefined) {
                                    for (let index5 = 0; index5 < res.data.included[index4].relationships.media.data.length; index5++) {
                                        relationShipidCat.push(res.data.included[index4].relationships.media.data[index5].id)
                                    }
                                }
                                if (typeof relationShipidCat === 'object') {
                                    for (let index6 = 0; index6 < relationShipidCat.length; index6++) {
                                        if (res.data.included[index4].id === relationShipidCat[index6]) {
                                            setcategorieFinalData((prev) => [...prev, res.data.included[index4].attributes["media.url"]])
                                        } else if (res.data.included[index4].id !== relationShipidCat[index6]) {
                                            if (res.data.included[index4].attributes["catalog.label"] !== undefined &&
                                                res.data.included[index4].attributes["catalog.label"] !== 'Carousel') {
                                                setcategorieFinalDataLAbel((prev) => [...prev, res.data.included[index4].attributes["catalog.label"]])
                                                setcategorieFinalDataID((prev) => [...prev, res.data.included[index4].id])
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
    }, []);

    // function handleClick(e) {
    //     axios
    //         .get(
    //             `https://phplaravel-741765-2490038.cloudwaysapps.com/api/broadcast`
    //         )
    //         .then((res) => {
    //             console.log(res.data);
    //         });
    // }
    // store swiper instances

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <div className="carouselBody">
            <ScrollToTop smooth />
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                navigation={true}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                grabCursor={true}
                effect={"creative"}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: [0, 0, -400],
                    },
                    next: {
                        translate: ["100%", 0, 0],
                    },
                }}
                modules={[Navigation, Pagination, EffectCreative]}
                className="mySwiper"
                style={{ maxHeight: '500px', background: '#f0f1f5',minHeight:'500px' }}
            >
                {
                    [...new Set(FinalCarsouelData)].map((data, key) => (
                        <SwiperSlide key={key}>
                            <img id={key} alt="" src={"https://phplaravel-741765-2490038.cloudwaysapps.com/aimeos/" + data} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <div className="catagoriesBlock">
                <h4 style={{ color: "gray" }}>Categories</h4>
                <div>
                    <span style={{ color: 'var(--base-color)' }}>View all</span>
                </div>

            </div>
            <div className="categorieBlockelement">
                {
                    [...new Set(categorieFinalData)].map((data, key) => (
                        <Link key={key} to={"/product/" + [...new Set(categorieFinalDataID)][key] + '-' + [...new Set(categorieFinalDataLAbel)][key]} className='elementCategorie'>
                            <img alt='' src={"https://phplaravel-741765-2490038.cloudwaysapps.com/aimeos/" + data} />
                            <div style={{ marginTop: "10px" }}>
                                {
                                    <span style={{ textDecoration: "none" }}>{[...new Set(categorieFinalDataLAbel)][key]}</span>
                                }
                            </div>
                        </Link>
                    ))
                }
            </div>
            <div className="catagoriesBlock">
                <h4 style={{ color: "gray" }}>Most liked</h4>
            </div>
            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                navigation={true}
                effect={'cards'}
                pagination={{
                    clickable: true,
                }}
                modules={[Navigation]}
                className="mySwiper2"
                breakpoints={{
                    "@0.00": {
                        slidesPerView: 2,
                        spaceBetween: 5,
                    },
                    "@0.75": {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    "@1.00": {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    "@1.50": {
                        slidesPerView: 4,
                        spaceBetween: 50,
                    },
                }}
            >
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://assets.catawiki.nl/assets/2022/2/25/e/6/d/e6d3b17f-87bc-4988-b7af-743c82b32a26.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://assets.catawiki.nl/assets/2021/9/27/8/e/7/8e7e61a8-9a23-4490-a6e5-8a19028648e6.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/ed8c79d4-8529-4bbe-bf91-9d5a5e97e7c1-3-1626364671.jpeg?crop=1.00xw:0.788xh;0,0.113xh&resize=640:*" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://picolio.auto123.com/auto123-media/mercedes-benz_100786706_h.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/ed8c79d4-8529-4bbe-bf91-9d5a5e97e7c1-3-1626364671.jpeg?crop=1.00xw:0.788xh;0,0.113xh&resize=640:*" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://picolio.auto123.com/auto123-media/mercedes-benz_100786706_h.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/ed8c79d4-8529-4bbe-bf91-9d5a5e97e7c1-3-1626364671.jpeg?crop=1.00xw:0.788xh;0,0.113xh&resize=640:*" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://picolio.auto123.com/auto123-media/mercedes-benz_100786706_h.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>



            </Swiper>

            <div className="catagoriesBlock">
                <h4 style={{ color: "gray" }}>Auctions ending soon</h4>
            </div>
            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                navigation={true}
                effect={'cards'}
                pagination={{
                    clickable: true,
                }}
                modules={[Navigation]}
                className="mySwiper2"
                breakpoints={{
                    "@0.00": {
                        slidesPerView: 2,
                        spaceBetween: 5,
                    },
                    "@0.75": {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    "@1.00": {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    "@1.50": {
                        slidesPerView: 4,
                        spaceBetween: 50,
                    },
                }}
            >
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/ed8c79d4-8529-4bbe-bf91-9d5a5e97e7c1-3-1626364671.jpeg?crop=1.00xw:0.788xh;0,0.113xh&resize=640:*" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://picolio.auto123.com/auto123-media/mercedes-benz_100786706_h.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/ed8c79d4-8529-4bbe-bf91-9d5a5e97e7c1-3-1626364671.jpeg?crop=1.00xw:0.788xh;0,0.113xh&resize=640:*" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://picolio.auto123.com/auto123-media/mercedes-benz_100786706_h.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/ed8c79d4-8529-4bbe-bf91-9d5a5e97e7c1-3-1626364671.jpeg?crop=1.00xw:0.788xh;0,0.113xh&resize=640:*" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://picolio.auto123.com/auto123-media/mercedes-benz_100786706_h.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/ed8c79d4-8529-4bbe-bf91-9d5a5e97e7c1-3-1626364671.jpeg?crop=1.00xw:0.788xh;0,0.113xh&resize=640:*" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>
                <SwiperSlide style={{ position: 'relative' }}>
                    <div className="heartBlock" >
                        <IonIcon name="heart-circle-outline"></IonIcon>
                    </div>
                    <Link className="bigBox" to='/' style={{ textDecoration: 'none' }}>
                        <div className="gridFlex">
                            <img src="https://picolio.auto123.com/auto123-media/mercedes-benz_100786706_h.jpg" alt="" />
                        </div>
                        <div>
                            <span style={{ color: "black", }}>Ferrari - Formula One - Rear wing</span>
                        </div>
                        <div>
                            <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                            <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                            <span style={{ color: "gray", fontSize: "15px", }}>1d 4h 58m 47s</span>
                        </div>
                    </Link>

                </SwiperSlide>



            </Swiper>
            <div className="catagoriesBlock">
                <h4 style={{ color: "gray" }}>Explore all categories</h4>
            </div>
            <div className="allCategorieBlock">
                <div>
                    <p><Link to='/'>Archaeology & Natural History</Link> </p>
                    <p><Link to='/'>Cameras & Computers</Link></p>
                    <p><Link to='/'>Fashion</Link></p>
                    <p><Link to='/'>Music</Link></p>
                </div>
                <div>
                    <p><Link to='/'>Art</Link></p>
                    <p><Link to='/'>Classic Cars, Motorcycles & Automobilia</Link></p>
                    <p><Link to='/'>Interiors & Decorations</Link></p>
                    <p><Link to='/'>Sports & Events</Link></p>
                </div>
                <div>
                    <p><Link to='/'>Asian & Tribal Art</Link></p>
                    <p><Link to='/'>Coins & Stamps</Link></p>
                    <p><Link to='/'>Jewellery & Watches</Link></p>
                    <p><Link to='/'>Toys & Models</Link></p>
                </div>
                <div>
                    <p><Link to='/'>Books & Comics</Link></p>
                    <p><Link to='/'>Diamonds & Gemstones</Link></p>
                    <p><Link to='/'>Militaria & Weaponry</Link></p>
                    <p><Link to='/'>Wine & Whisky</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Home;
