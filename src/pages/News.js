import axios from 'axios'
import React from 'react'
import { umAPI } from '../utils/apiMap'
import { useState, useEffect } from 'react'
import Loading from "../pages/Loading";
import moment from 'moment'
import { color } from '../utils/uiMap';
import { Link } from 'react-router-dom';
import { newsIDtoURL } from '../utils/helper';

//https://www.um.edu.mo/zh-hant/category/news-and-press-releases/

export default function News() {
  const [isLoading, setLoading] = useState(true)
  const [isLoadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  const [news, setNews] = useState([])

  const [lang, setLang] = useState("zh_TW")

  // var newsFrom = moment().subtract(1, 'months')
  // var newsTo = moment()

  const [newsFrom, setNewsFrom] = useState(moment().subtract(15, 'days'))
  const [newsTo, setNewsTo] = useState(moment())

  useEffect(() => {
    window.scrollTo(0,0)
    axios.get(umAPI.news + "?date_from=" + encodeURIComponent(newsFrom.format()) + "&date_to=" + encodeURIComponent(newsTo.format()), {
      headers: {
        Accept: 'application/json',
        Authorization: umAPI.token,
      },
    }).then(
      response => {
        setNews(response.data._embedded)

        //false when no more news
        setHasMore(response.data._embedded.length > 0)
        console.log("News", response.data._embedded)
        setLoading(false);
      }
    ).catch(
      setError(true)
    )
  }, [])

  function getMoreNews() {
    setLoadingMore(true)
    setNewsFrom(newsFrom.subtract(15, 'days'))
    setNewsTo(newsTo.subtract(15, 'days'))
    axios.get(umAPI.news + "?date_from=" + encodeURIComponent(newsFrom.format()) + "&date_to=" + encodeURIComponent(newsTo.format()), {
      headers: {
        Accept: 'application/json',
        Authorization: umAPI.token,
      },
    }).then(
      response => {
        setNews(prevNews => {
          return [...prevNews, ...response.data._embedded]
        })
        //false when no more news
        setHasMore(response.data._embedded.length > 0)
        console.log("New News", response.data._embedded)
        setLoadingMore(false)
      }
    ).catch(
      setError(true)
    )
  }


  if (isLoading) {
    return <div><Loading></Loading></div>;
  }

  return (
    <div>
      {window.scrollTo(0, document.documentElement.scrollTop)}
      <div className='flex justify-center text-gray-500'>
        <p>Data source: <a href="https://data.um.edu.mo" target="_blank">data.um.edu.mo</a></p>
      </div>
      <div className="grid grid-cols-3">
        <button onClick={() => setLang("zh_TW")} className="p-1">??????</button>
        <button onClick={() => setLang("en_US")} className="p-1">English</button>
        <button onClick={() => setLang("pt_PT")} className="p-1">Portugu??s</button>
      </div>
      <hr />
      <div>
        {
          news.map((n) => {
            //if there is no details
            if (n.details[0] === undefined) {
              return ""
            }
            else
              return n.details.map((l) => {
                if (l.locale === lang) {
                  return (
                    <>
                      <div key={n._id} className="flex flex-row my-3 ml-1 text-sm sm:text-base lg:text-lg px-2">
                        <div className='flex-grow w-48 mr-1'>
                          <Link to={"/detail/news/" + newsIDtoURL(n.common.publishDate, n.itemId) + "/" + lang} className='font-bold newsTitle'>{l.title}</Link>
                          <p className='text-gray-500'>@{n.common.publishDate.slice(5, 10)}</p>
                        </div>
                        <div className='newsCard flex flex-wrap content-center justify-middle shadow rounded-lg h-20 lg:h-36 w-32 lg:w-48 overflow-hidden bg-gray-100'>
                          <Link to={"/detail/news/" + newsIDtoURL(n.common.publishDate, n.itemId) + "/" + lang}>
                            <img src={n.common.imageUrls[0]} className="object-contain h-20 lg:h-36 w-32 lg:w-48" />
                          </Link>
                        </div>
                      </div>
                      <hr />
                    </>
                  )
                } else
                  return ""
              }
              )
          })
        }
      </div>
      <div className="flex justify-center">
        {isLoadingMore ?
          <div class="loadingio-spinner-spin-wx94p40losn"><div class="ldio-mhvcbdpseok">
          <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>
          </div></div> :
          <button onClick={getMoreNews} className="rounded-full shadow p-3 mt-2 text-white font-bold" style={{ "backgroundColor": color.theme }}>
            ????????????
          </button>}
      </div>
    </div>
  )
}
