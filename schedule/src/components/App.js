import React, { Component } from 'react'

import Schedule from './Schedule'


export default class App extends Component {
  render = () => (
    <>
      <div id="react-injected-div" />
      <Schedule />
    </>
  )
}