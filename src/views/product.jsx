import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams, } from "react-router-dom";
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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

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
    let [searchParams, setSearchParams] = useSearchParams();
    const [isloading, setisloading] = useState(false);
    const [noResult, setnoResult] = useState(false);
    const [elementShow, setelementShow] = useState([]);
    const [lastelemrnts, setlastelemrnts] = useState([]);
    const [FinalShow, setFinalShow] = useState([]);
    const [resutArray, setresutArray] = useState([]);
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

    useLayoutEffect(() => {
        let table = []
        axios.get(_GLobal_Link.link + "product?filter[f_catid]=" + id + "&include=attribute", {
            headers: {
                "content-type": "application/json",
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': true
            },
        }).then((res) => {
            for (let index = 0; index < res.data.included.length; index++) {
                table.push({
                    type: res.data.included[index].attributes["attribute.type"],
                    value: res.data.included[index].attributes["attribute.label"],
                    id: res.data.included[index].attributes["attribute.id"]
                })
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
    const handleChange = (event) => {
        const {
            target: { value, name },
        } = event;

        setattrState(prev => {
            return { ...prev, [name]: value }
        })
    };
    useEffect(() => {
        setSearchParams(attrState)
    }, [attrState]);

    useEffect(() => {
        let temporyText = ''
        if (Object.keys(attrState).length > 0) {
            let tableAT = []
            let elementsS = [];
            let bigFinal = []
            //let resutArray = []
            let startArray = []
            let test = []
            Object.keys(attrState).map((data, key) => {
                for (let index = 0; index < attrState[data].length; index++) {
                    temporyText += 'filter[f_optid][]=' + attrState[data][index] + '&'
                }
                tableAT.push({ [data]: temporyText })
                temporyText = '';
                return tableAT;
            })
            for (let index = 0; index < tableAT.length; index++) {
                if (tableAT[index][Object.keys(tableAT[index])] === '') {
                    delete tableAT[index][Object.keys(tableAT[index])];
                }
                let finalData = [];
                axios.get(_GLobal_Link.link + "product?include=media&" + Object.values(tableAT[index]).toString() + "&filter[f_catid]=" + id, {
                    headers: {
                        "content-type": "application/json",
                        'Access-Control-Allow-Credentials': true,
                        'Access-Control-Allow-Origin': true
                    },
                }).then((res) => {
                    for (let index2 = 0; index2 < res.data.data.length; index2++) {
                        finalData.push(res.data.data[index2].links.self.href)
                    }
                    elementsS.push({ [Object.keys(tableAT[index])]: finalData })
                    if (tableAT.length === elementsS.length) {
                        for (let index3 = 0; index3 < elementsS.length; index3++) {
                            if (Object.keys(elementsS[index3]).toString() !== '') {
                                bigFinal.push(elementsS[index3])

                            }
                        }
                    }
                    if (bigFinal.length > 0) {
                        if (bigFinal.length === 1) {

                        }
                        if (bigFinal.length === 2) {
                            if (startArray.length === 0) {
                                startArray.push(bigFinal[0])
                            }
                            if (startArray.length > 0) {
                                for (let index = 0; index < Object.values(startArray[0])[0].length; index++) {

                                    for (let index2 = 0; index2 < Object.values(bigFinal[1])[0].length; index2++) {
                                        if (Object.values(startArray[0])[0][index] === Object.values(bigFinal[1])[0][index2]) {
                                            //resutArray.push(Object.values(bigFinal[1])[0][index2])
                                            setresutArray(prev => [...prev, Object.values(bigFinal[1])[0][index2]])
                                        }
                                    }
                                }

                            }
                            // 
                        }

                     //   test.push(resutArray)
                        if (bigFinal.length > 2) {
                            console.log(resutArray)
                            // setTimeout(() => {
                            //     console.log(resutArray)
                            // }, 2000);


                            // for (let index = 2; index < bigFinal.length; index++) {
                            //     // const element = array[index];
                            //     console.log(bigFinal[index])

                            // }
                        }
                    }

                    finalData = [];
                })
                //  }
                // else if (Object.values(tableAT[index]).toString() === '' && tableAT.length > 1) {
                //     console.log(tableAT.length)
                //     delete tableAT[index][Object.keys(tableAT[index])];
                //     tableAT[index][Object.keys(tableAT[index])] = []

                //     let _Index = tableAT.indexOf(tableAT[index])//get  "car" index
                //     tableAT.splice(_Index);

                // }
                // if (tableAT.length === 0) {

                // } length - length  = first length; length - length -1

            }

            //  console.log(Object.values(elementsS))
            // Object.keys(elements).map((data, key) => {
            //     console.log(data)
            // })
            //  console.log(elementsS)
            // console.log(Object.keys(elementsS))
            // for (let index3 = 0; index3 < elements.length; index3++) {
            //     //const element = array[index];
            // }
            //console.log(tableAT)
            //   setlastelemrnts(elementsS)
            setlastelemrnts(elementsS)

        }
    }, [attrState]);


    // useEffect(() => {

    // }, [resutArray])



    useLayoutEffect(() => {
        if (lastelemrnts.length > 0) {
            // setProductsid([])
            // setProductsName([])
            // setfinishdate([])
            // setProductImage([])
            // for (let index = 0; index < [...new Set(lastelemrnts)].length; index++) {
            //     axios.get([...new Set(lastelemrnts)][index] + '&include=media', {
            //         headers: {
            //             "content-type": "application/json",
            //             'Access-Control-Allow-Credentials': true,
            //             'Access-Control-Allow-Origin': true
            //         },
            //     }).then((res) => {
            //         setFinalShow(prev => [...prev, res]);
            //         setlastelemrnts([])
            //     })
            // }

        }
        // console.log(Object.keys(lastelemrnts))
        // 
        //  console.log(lastelemrnts);
        // setTimeout(() => {
        //     console.log(lastelemrnts.length);
        // }, 2000);

    }, [lastelemrnts])

    useLayoutEffect(() => {
        if (FinalShow.length > 0) {
            console.log([...new Set(FinalShow)]);
        }
    }, [FinalShow])
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
            <Backdrop
                sx={{ color: 'var(--base-color)', zIndex: 10000 }}
                open={isloading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className='filterBlock'>
                {
                    Object.keys(big).map((data, key) => (
                        <FormControl key={key} className="formControl" sx={{ m: 1 }}>
                            <InputLabel id={data}>
                                {data}
                            </InputLabel>
                            <Select
                                labelId={data}
                                id={data}
                                multiple
                                value={attrState[data] !== undefined ? attrState[data] : []}
                                onChange={handleChange}
                                input={<OutlinedInput label={data} />}
                                renderValue={(selected) => data + ' ' + selected.length}
                                MenuProps={MenuProps}
                                name={data}
                            >
                                {
                                    Object.values(big)[key] !== undefined ?
                                        Object.values(big)[key].map((data2, key2) => {
                                            return data === data2.type ?
                                                <MenuItem key={key2} value={data2.id}>
                                                    <Checkbox checked={
                                                        attrState[data] !== undefined ? attrState[data].indexOf(data2.id) > -1 : false
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
                {[...new Set(getProductImage)].length > 0 ?
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
                    )) : <></>
                }
            </div>
            {
                noResult === true ?
                    <div style={{ display: 'flex', flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
                        <Alert severity="error">No result ! Try another search term or check spelling.</Alert>
                    </div>
                    : <></>
            }
        </div>
    );
}

export default Products;