import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { IonIcon } from "react-ion-icon";
import '../style/products.css'
import { Link } from "react-router-dom";
import _GLobal_Link from './global';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function Products() {
    const { id, category } = useParams();
    const [getProductsid, setProductsid] = useState([])
    const [getProductsName, setProductsName] = useState([])
    const [getfinishdate, setfinishdate] = useState([])
    const [getProductImage, setProductImage] = useState([])
    const [big, setBig] = useState([]);

    useLayoutEffect(() => {
        axios.get(_GLobal_Link.link + "product?filter[f_catid]=" + id + "&include=media", {
            headers: {
                "content-type": "application/json",
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': true
            },
        }).then((res) => {
            for (let index = 0; index < res.data.data.length; index++) {
                setProductsid((prev) => [...prev, [res.data.data[index].attributes['product.id']]])
                setProductsName((prev) => [...prev, [res.data.data[index].attributes['product.label']]])
                setfinishdate((prev) => [...prev, [res.data.data[index].attributes['product.dateend']]])
                for (let index2 = 0; index2 < 1; index2++) {
                    for (let index3 = 0; index3 < res.data.included.length; index3++) {
                        if (res.data.included[index3].id === res.data.data[index].relationships.media.data[index2].id) {
                            setProductImage((prev) => [...prev, [res.data.included[index3].attributes['media.url']]])
                        }
                    }
                }
            }
        })
    }, [])

    useEffect(() => {
        let table = []
        axios.get(_GLobal_Link.link + "product?filter[f_catid]=" + id + "&include=attribute", {
            headers: {
                "content-type": "application/json",
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': true
            },
        }).then((res) => {
            for (let index = 0; index < res.data.included.length; index++) {
                table.push({ type: res.data.included[index].attributes["attribute.type"], value: res.data.included[index].attributes["attribute.label"] })
            }
            let result = table.reduce(function (r, a) {
                r[a.type] = r[a.type] || [];
                r[a.type].push(a);
                return r;
            }, Object.create(null));
            setBig(result);
        })
    }, [])


    const [personName, setPersonName] = useState([]);
    const [attrState, setattrState] = useState([])
    let obj = {}
    const handleChange = (event) => {
        const {
            target: { value, name },
        } = event;
        //console.log(value)
        // setPersonName(
        //     // On autofill we get a stringified value.
        //     typeof value === 'string' ? value.split(',') : value,
        // );
        // console.log(name + ':' + value);

        // if (attrState[name] === undefined) {
        //     setattrState(prev => {
        //         return { ...prev, [name]: value }
        //     })
        // } else {
        //     if (typeof attrState[name] === 'string' && attrState[name].indexOf(value.toString()) === -1) {
        //         setattrState(prev => {
        //             return { ...prev, [name]: [...[attrState[name]], value.toString()] }
        //         })
        //     } else if (typeof attrState[name] === 'object' && attrState[name].indexOf(value.toString()) === -1) {
        //         setattrState(prev => {
        //             return { ...prev, [name]: [...attrState[name], value.toString()] }
        //         })
        //     }

        //     if (attrState[name].indexOf(value.toString()) > -1) {
        //         var Index = attrState[name].indexOf(value.toString());
        //         attrState[name].splice(Index, 1);

        //         setattrState(prev => {
        //             return { ...prev, [name]: attrState[name] }
        //         })
        //     }
        // }

        setattrState(prev => {
            return { ...prev, [name]: value }
        })
    };
    // Update the count down every 1 second
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
            document.getElementById(id).innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
        }
    }

    return (
        <div className='carouselBody'>
            <div className='filterBlock'>
                {
                    Object.keys(big).map((data, key) => (
                        <FormControl key={key} className="formControl" sx={{ m: 1 }}>
                            <InputLabel id={data}>{data}
                                {console.log()}
                            </InputLabel>
                            <Select
                                labelId={data}
                                id={data}
                                multiple
                                value={attrState[data] !== undefined ? attrState[data] : []}
                                onChange={handleChange}
                                input={<OutlinedInput label={data} />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                                name={data}
                            >
                                {
                                    Object.values(big)[key] !== undefined ?
                                        Object.values(big)[key].map((data2, key2) => {
                                            return data === data2.type ?
                                                <MenuItem key={key2} value={data2.value}>
                                                    <Checkbox checked={
                                                        attrState[data] !== undefined ? attrState[data].indexOf(data2.value) > -1 : false
                                                    } />
                                                    <ListItemText primary={data2.value} />
                                                </MenuItem>
                                                :
                                                <></>
                                        })
                                        : <></>
                                }
                            </Select>
                        </FormControl>
                    ))
                }
            </div>
            <div className='gridBody'>
                {
                    [...new Set(getProductImage)].map((data, key) => (
                        <div key={key}>
                            <div className="heartBlock" >
                                <IonIcon name="heart-circle-outline"></IonIcon>
                            </div>
                            <Link className="bigBox" to={'/detail/' + [...new Set(getProductsid)][key] + '-' + category + '-' +
                                id + "/" + [...new Set(getfinishdate)][key]} style={{ textDecoration: 'none' }}>
                                <div className="gridFlex">
                                    <img src={"https://phplaravel-741765-2490038.cloudwaysapps.com/aimeos/" + data} alt="" />
                                </div>
                                <div>
                                    <span style={{ color: "black", }}>{[...new Set(getProductsName)][key]}</span>
                                </div>
                                <div>
                                    <span style={{ color: "gray", fontSize: "16px", }}>Current Bid</span> -
                                    <span style={{ fontSize: "16px", color: "gray", marginLeft: "5px" }}>€ 2,200</span><br />
                                    <span id={key + data} style={{ color: "gray", fontSize: "15px", }}>
                                        {
                                            setInterval(() => {
                                                counterDate([...new Set(getfinishdate)][key], key + data)
                                            }, 1000)
                                        }
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))
                }
                {console.log(attrState)}
            </div>
        </div>
    );
}

export default Products;