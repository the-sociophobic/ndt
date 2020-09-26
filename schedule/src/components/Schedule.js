import React from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import axios from 'axios'
import _ from 'lodash'

import ExternalLink from './ExternalLink'


const nameCleaner = string =>
  string
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^а-я]/g, '')

export default class Schedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      spekts: {},
      additionalData: {},
      tryCount: 0,
    }

    this.init()
  }

  init = async () => {
    await this.loadData()
    this.tryFindImgs()
  }

  loadData = async () => {
    const months = (await axios
      .get('https://apit.bileter.ru/8e665805311706860c2ef141d3dc13e2/afisha?json=1'))
      .data
    // const currentMonth = months[Object.keys(months)[1]]
    const currentMonth = months[Object.keys(months)[0]]
    let spekts = {}

    _.forOwn(currentMonth, day => 
      _.forOwn(day, performance => {
        const date = performance.PerfDate.split(' ')[0]
        const time = performance.PerfDate.split(' ')[1].slice(0, 5)

        // if (spekts.hasOwnProperty(performance.Name)) {
        //   const lastPerfomance = spekts[performance.Name][spekts[performance.Name].length - 1]

        //   if (lastPerfomance.PerfDate === date)
        //     lastPerfomance.time.push(time)
        //   else
        //     spekts[performance.Name].push({
        //       ...performance,
        //       PerfDate: date,
        //       time: [time]
        //     })
        // } else
        //   spekts[performance.Name] = [{
        //     ...performance,
        //     PerfDate: date,
        //     time: [time]
        //   }]
        spekts[performance.Name] = [{
          ...performance,
          PerfDate: date,
          time: [time]
        }]
      })
    )

    console.log(currentMonth)
    console.log(spekts)

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
      const to = Array.from((Array.from(post.getElementsByTagName('h2'))[0]).getElementsByTagName('a'))[0].href
      const name = Array.from((Array.from(post.getElementsByTagName('h2'))[0]).getElementsByTagName('a'))[0].innerText
      const img = Array.from(post.getElementsByTagName('img'))[0].src

      this.setState({additionalData: {
        ...this.state.additionalData,
        [nameCleaner(name)]: {
          img: img,
          to: to,
        }
      }})
    })
  }

  render = () =>
    <>
      <h2 className="cmsmasters_heading">
        Смотрите в <ExternalLink to="https://nebdt.ru/afisha/">
          {(() => {
            const month = format(new Date(), "MMMM", { locale: ru })

            return month.slice(-1) === 'т' ? month : month.slice(0, -1) + 'е'
          })()}
        </ExternalLink>
      </h2>
      <div className="lev-schedule">
        {Object.keys(this.state.spekts)
          .map(spektName =>
            <div
              key={spektName}
              className="lev-schedule__spekt"
            >
              <ExternalLink
                className="lev-schedule__spekt__to"
                to={this.state.additionalData[nameCleaner(spektName)]?.to}
              >
                <img
                  className="lev-schedule__spekt__to__img"
                  src={this.state.additionalData[nameCleaner(spektName)]?.img || ""}
                />
                <div className="lev-schedule__spekt__to__name">
                  {spektName}
                </div>
                <div className="lev-schedule__spekt__to__dates">
                  {this.state.spekts[spektName]
                    .map(performance => {
                      const parts = performance.PerfDate.split('.')
                      const date = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`)
                      const times = performance.time
                        .reduce((a, b) => a + ', ' + b)
                        .replace(/\,(?!.*\,)/, ' и')

                      return format(date, `dd, iiii, ${times}`, { locale: ru })
                    })
                    .reduce((a, b) => a + ' / ' + b)
                  } / {(() => {
                    const { BuildingName, HallName } = this.state.spekts[spektName][0]
                    const openBracketIndex = BuildingName.indexOf('(')
                    const closeBracketIndex = BuildingName.indexOf(')')

                    return openBracketIndex !== -1 && closeBracketIndex !== -1 ?
                      BuildingName.slice(openBracketIndex + 1, closeBracketIndex)
                      :
                      HallName
                  })()}
                </div>
              </ExternalLink>
              <div
                className="lev-schedule__spekt__button with_buy bileter_afisha_showhall"
                id={`perf${this.state.spekts[spektName][0].IdPerformance}`}
              >
                Купить билет
              </div>
            </div>
        )}
      </div>
    </>
}