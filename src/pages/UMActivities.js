import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { color } from '../utils/uiMap'
import { Link } from 'react-router-dom'
import { umAPI } from '../utils/apiMap'
import Loading from "../pages/Loading";
import moment from 'moment'
import { newsIDtoURL } from '../utils/helper'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

//https://www.um.edu.mo/zh-hant/events/

export default function UMActivities() {
  const [isLoading, setLoading] = useState(true)
  const [isLoadingMore, setLoadingMore] = useState(false)
  const [events, setEvents] = useState([])
  const [eventsLang, setEventsLang] = useState([])
  const [dateFrom, setDateFrom] = useState(moment())
  const [dateTo, setDateTo] = useState(moment().add(15, 'days'))
  const [lang, setLang] = useState("zh_TW")

  useEffect(() => {
    window.scrollTo(0,0)
    console.log(dateFrom.format())
    axios.get(umAPI.events + "?date_from=" + encodeURIComponent(dateFrom.format().slice(0, 10)) + "&date_to=" + encodeURIComponent(dateTo.format().slice(0, 10)), {
      headers: {
        Accept: 'application/json',
        Authorization: umAPI.token,
      },
    }).then(
      response => {
        setEvents(response.data._embedded)
        setEventsLang([])
        console.log("Events", response.data._embedded)
        response.data._embedded.map((e) => {
          e.details.map((l) => {
            if (l.locale === lang) {
              setEventsLang((prev) => {
                return [...prev, { "details": l, "common": e.common, "itemId": e.itemId, "lastModified": e.lastModified, "_id": e._id }]
              })
            }
          })
        })
        setLoading(false);
      }
    )
  }, [lang])

  function getMore() {
    setLoadingMore(true)
    setDateTo(dateTo.add(15, 'days'))
    axios.get(umAPI.events + "?date_from=" + encodeURIComponent(moment().format().slice(0, 10)) + "&date_to=" + encodeURIComponent(dateTo.format().slice(0, 10)), {
      headers: {
        Accept: 'application/json',
        Authorization: umAPI.token,
      },
    }).then(
      response => {
        setEventsLang([])
        response.data._embedded.map((e) => {
          e.details.map((l) => {
            if (l.locale === lang) {
              setEventsLang((prev) => {
                return [...prev, { "details": l, "common": e.common, "itemId": e.itemId, "lastModified": e.lastModified, "_id": e._id }]
              })
            }
          })
        })
        console.log("New Events", response.data._embedded);
        window.scrollTo(0, document.documentElement.scrollTop);
        setLoadingMore(false)
      }
    )
  }

  if (isLoading) {
    return <div><Loading></Loading></div>;
  }

  return (
    <div>
      {console.log("eventLang", eventsLang)}
      <div className='flex justify-center text-gray-500'>
        <p>Data source: <a href="https://data.um.edu.mo" target="_blank">data.um.edu.mo</a></p>
      </div>
      <div className="grid grid-cols-2">
        <button onClick={() => { setLang("zh_TW") }} className="p-1 text-center">??????</button>
        <button onClick={() => { setLang("en_US") }} className="p-1 text-center">English</button>
      </div>
      <hr />
      {
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 100: 1, 350: 2, 750: 3 }}
        >
          <Masonry>
            {
              eventsLang.map((e) => {
                return (
                  <Link to={"/detail/um-activities/" + newsIDtoURL(e.common.dateFrom, e.itemId) + "/" + lang} key={e._id}
                    className="box-border shadow-sm border m-2 rounded-lg card">
                    <div className='overflow-hidden'>
                      <img src={e.common.posterUrl} className="rounded-t-lg" />
                    </div>
                    <div className='flex flex-row'>
                      <div className='m-2 flex-grow'>
                        <span className='text-xs text-white font-semibold px-1 rounded-lg' style={{ backgroundColor: color.theme }}>{e.details.venues.map(v => v)}</span>
                        <div className='font-semibold text-sm flex-grow' style={{ color: color.theme }}>
                          {e.common.dateFrom.slice(5, 10) + " | " + e.common.timeFrom.slice(11, 16) + "-" + e.common.timeTo.slice(11, 16)}
                        </div>
                        <div className='font-semibold text-sm mr-1'>{e.details.title}</div>

                      </div>
                    </div>
                  </Link>
                )
              })
            }
          </Masonry>
        </ResponsiveMasonry>
      }
      <div className="flex justify-center">
        {isLoadingMore ?
          <div class="loadingio-spinner-spin-wx94p40losn"><div class="ldio-mhvcbdpseok">
            <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>
          </div></div> :
          <button onClick={getMore} className="rounded-full shadow p-3 mt-2 text-white font-bold" style={{ "backgroundColor": color.theme }}>
            ????????????
          </button>
        }
      </div>
    </div>
  )
}
