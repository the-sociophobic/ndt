import React from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import axios from 'axios'
import _ from 'lodash'

import ExternalLink from './ExternalLink'
import nameCleaner from '../utils/nameCleaner'
import firstTag from '../utils/firstTag'


export default class Schedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dates: {},
      spekts: {},
      performances: [],
      additionalData: {},
      tryCount: 0,
    }

    this.init()
  }

  init = async () => {
    await this.loadDates()
    this.parseSpekts()
    this.tryFindImgs()
  }

  loadDates = async () => {
    const months = (await axios
      .get('https://apit.bileter.ru/8e665805311706860c2ef141d3dc13e2/afisha?json=1'))
      .data
    const currentMonth = months[Object.keys(months)[0]]
    let dates = {}, performances = []

    _.forOwn(currentMonth, (date, dateName) => {
      date.forEach(performance => {
        const dateParts = performance.PerfDate.split(' ')[0].split('.')
        const time = performance.PerfDate.split(' ')[1]//.slice(0, -3)
        const PerfDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]} ${time}`

        if(!dates[dateName])
          dates[dateName] = []

        dates[dateName].push({
          ...performance,
          PerfDate: PerfDate,
        })
      })
    })

    _.values(dates)
      .map(date =>
        date
          .map(performance =>
            performances.push(performance)))

    this.setState({
      dates: dates,
      performances: performances,
    })
  }

  parseSpekts = () => {
    const { dates } = this.state
    let spekts = {}

    _.forOwn(dates, date => 
      _.forOwn(date, performance => {
        const date = performance.PerfDate.split(' ')[0]
        const time = performance.PerfDate.split(' ')[1].slice(0, 5)

        if (spekts.hasOwnProperty(performance.Name)) {
          const lastPerfomance = spekts[performance.Name][spekts[performance.Name].length - 1]

          if (lastPerfomance.PerfDate === date)
            lastPerfomance.time.push(time)
          else
            spekts[performance.Name].push({
              ...performance,
              PerfDate: date,
              time: [time]
            })
        } else
          spekts[performance.Name] = [{
            ...performance,
            PerfDate: date,
            time: [time]
          }]
      })
    )

    this.setState({spekts: spekts})
  }

  tryFindImgs = () => {
    if (!this.tryFindImgsInterval)
      this.tryFindImgsInterval = setInterval(this.tryFindImgs, 100)

    const blogPosts = document.getElementsByClassName('category-performance')
    const { tryCount } = this.state

    if (tryCount > 100) {
      console.log(`imgs wasn't found after ${tryCount} tries`)
      clearInterval(this.tryFindImgsInterval)
      this.tryFindImgsInterval = undefined
      return
    }

    if (blogPosts.length === 0) {
      this.setState({tryCount: tryCount + 1})
      return
    }

    console.log(`imgs found after ${tryCount} tries`)
    clearInterval(this.tryFindImgsInterval)
    this.tryFindImgsInterval = undefined

    Array.from(blogPosts).forEach(post => {
      const to = firstTag(firstTag(post, 'h2'), 'a').href
      const name = firstTag(firstTag(post, 'h2'), 'a').innerText
      const img = firstTag(post, 'img').src

      this.setState({additionalData: {
        ...this.state.additionalData,
        [nameCleaner(name)]: {
          img: img,
          to: to,
        }
      }})
    })
  }

  renderHeadline = () => 
    <h2 className="cmsmasters_heading">
      Смотрите в <ExternalLink to="https://nebdt.ru/afisha/">
        {(() => {
          const month = format(new Date(), "MMMM", { locale: ru })

          return month.slice(-1) === 'т' ? month : month.slice(0, -1) + 'е'
        })()}
      </ExternalLink>
    </h2>

  renderItem = (item, type) =>
    <div
      key={item.IdPerformance}
      className="lev-schedule__spekt"
    >
      <ExternalLink
        className="lev-schedule__spekt__to"
        to={this.state.additionalData[nameCleaner(item.Name)]?.to}
      >
        <img
          className="lev-schedule__spekt__to__img"
          src={this.state.additionalData[nameCleaner(item.Name)]?.img || ""}
        />
        <div className="lev-schedule__spekt__to__name">
          {item.Name}
        </div>
        <div className="lev-schedule__spekt__to__dates">
          {type === "spekt" ?
            item
              .map(performance => {
                const date = new Date(performance.PerfDate)
                const times = performance.time
                  .reduce((a, b) => a + ', ' + b)
                  .replace(/\,(?!.*\,)/, ' и')

                return format(date, `dd, iiii, ${times}`, { locale: ru })
              })
              .reduce((a, b) => a + ' / ' + b)
            :
            format(new Date(item.PerfDate), `dd, iiii, HH:mm`, { locale: ru })
          } / {(() => {
            const { BuildingName, HallName } = type === "spekt" ? item[0] : item
            const openBracketIndex = BuildingName.indexOf('(')
            const closeBracketIndex = BuildingName.indexOf(')')

            return openBracketIndex !== -1 && closeBracketIndex !== -1 ?
              BuildingName.slice(openBracketIndex + 1, closeBracketIndex)
              :
              HallName
          })()}
        </div>
      </ExternalLink>
      {type !== "spekt" &&
        <div
          className="lev-schedule__spekt__button with_buy bileter_afisha_showhall"
          id={`perf${item.IdPerformance}`}
        >
          Купить билет
        </div>
      }
    </div>

  renderSpekts = () =>
    Object.keys(this.state.spekts) &&
      _.values(this.state.spekts)
        .map(spekt =>
          this.renderItem(spekt, "spekt"))

  renderPerformances = () =>
    this.state.performances
      .slice(0, 6)
        .map(performance =>
          this.renderItem(performance))

  render = () =>
    <>
      {this.renderHeadline()}
      <div className="lev-schedule">
        {/* {this.renderSpekts()} */}
        {this.renderPerformances()}
      </div>
    </>
}