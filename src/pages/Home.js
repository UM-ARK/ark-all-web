import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { color, btnStyle } from "../utils/uiMap";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper";

import { umallAPI, baseURL } from "../utils/apiMap";
import axios from "axios";

import Loading from "../pages/Loading";

export default function Home() {
    const [carousel, setCarousel] = useState({})
    const [isLoading, setLoading] = useState(true)

    //style
    const iconStyle = {
        fontSize: 40,
        color: color.theme
    }
    const imgStyle = {
        maxHeight: "20rem",
        objectFit: "contain",
        borderRadius: "0.75rem"
    }

    console.log(umallAPI.getAppInfo)

    useEffect(() => {
        window.scrollTo(0,0)
        axios.get(umallAPI.getAppInfo).then(
            res => {
                let data = res.data.content;
                console.log(data.index_head_carousel);
                setCarousel(data.index_head_carousel);
                setLoading(false);
            }
        )
    }, [])

    const carouselFn = () => carousel.map((i) => {
        return (
            <SwiperSlide>
                <div className="rounded-lg">
                    <img src={baseURL + i.url} style={imgStyle}></img>
                </div>
            </SwiperSlide>
        )
    })

    if (isLoading) {
        return <div>
            <Loading></Loading>
        </div>;
    }

    return (
        <div className="m-1">
            <div className="border bg-white mb-3 pb-2 shadow">
                <div className="mt-2">
                    <Swiper
                        navigation={false}
                        modules={[Navigation, Autoplay]}
                        speed={300}
                        loop={true}
                        autoplay={true}
                        className="mySwiper"
                    >
                        {carouselFn()}
                    </Swiper>
                </div>
                <div className="flex flex-row justify-center">
                    <div className="homeIcon text-center mx-4 mb-2 mt-3 text-sm">
                        <Link to="/campus-loop">
                            <ion-icon name="bus" style={iconStyle}></ion-icon><br />
                            ????????????
                        </Link>
                    </div>
                    <div className="homeIcon text-center mx-4 mb-2 mt-3 text-sm">
                        <Link to="/info/activities">
                            <ion-icon name="aperture-sharp" style={iconStyle}></ion-icon><br />
                            ????????????
                        </Link>
                    </div>
                    <div className="homeIcon text-center mx-4 mb-2 mt-3 text-sm">
                        <Link to="/info/organizations">
                            <ion-icon name="color-wand" style={iconStyle}></ion-icon><br />
                            ????????????
                        </Link>
                    </div>
                    <div className="homeIcon text-center mx-4 mb-2 mt-3 text-sm">
                        <Link to="/info/news">
                            <ion-icon name="earth-sharp" style={iconStyle}></ion-icon><br />
                            ????????????
                        </Link>
                    </div>
                    <div className="homeIcon text-center mx-4 mb-2 mt-3 text-sm">
                        <Link to="/services">
                            <ion-icon name="grid" style={iconStyle}></ion-icon><br />
                            ????????????
                        </Link>
                    </div>
                </div>
            </div>

            <div className="text-center border bg-white mb-3 p-2 shadow">
                ARK ALL??????FST??????????????????TAT??????????????????????????????<br />
                <div className="font-bold">
                    ??????????????????Github?????????????????????<br />
                    ??????????????????????????????????????? x1<br />
                    ??????????????????????????????????????? x2<br />
                    ??????????????????????????????????????? x3<br />
                    ???????????????????????????????????????????????? ???(????????)???<br />
                </div>
                ????????????????????????<br />
                <Link to="/about" style={btnStyle}>
                    ??????APP????
                </Link><br />
                ?????????????????????... (???????????????????????????)<br />
                <a href="https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&album_id=1463637399816323072" target="_blank" rel="noreferrer" style={btnStyle}>
                    ????????????
                </a><br />
                ???????????????????????????...<br />
                <a href="https://umall.one/qa.html" target="_blank" rel="noreferrer" style={btnStyle}>
                    ????????????...
                </a>
            </div>
        </div>
    );
}