import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

import './styles/index.sass'


//to use async / await
const regeneratorRuntime = require("regenerator-runtime")


const getNode = async (nodeId, triesNumber = 30) =>
  new Promise((res, rej) => {
    let tryCounter = 0
    let elementLoadedChecker = setInterval(() => {
      const elem = document.getElementById(nodeId)
    
      if (tryCounter >= triesNumber) {
        clearInterval(elementLoadedChecker)
        rej(`#${nodeId} wasn't found after ${triesNumber} tries`)
      }

      if (!elem) {
        tryCounter++
        // console.log(`no #${nodeId} element in the DOM`)
        return
      } else {
        clearInterval(elementLoadedChecker)
        console.log(`#${nodeId} element found`)
        res(elem)
      }
    }, 300)  
  })

const tryInjectReact = async (component, divId) => {
  const elem = await getNode(divId).catch(error => console.log(error))

  if (elem) {
    ReactDOM.render(component, elem)
    console.log(`React injected into #${divId}`)
  }
}

tryInjectReact(<App />, "lev-schedule-container")

//remove react-components by React, before readymag do it himself on orientationchange
window.addEventListener("orientationchange", async () => {
  const threeSceneElem = document.getElementById("three-scene")
  const quizElem = document.getElementById("quiz")

  threeSceneElem && ReactDOM.unmountComponentAtNode(threeSceneElem)
  quizElem && ReactDOM.unmountComponentAtNode(quizElem)
}, true)

//inject react-components after orientationchange
window.addEventListener("orientationchange", async () => {
  const flag = await getNode("react-injected-div", 3).catch(error => console.log(error))

  if (!flag) {
    tryInjectReact(<App />, "lev-schedule-container")
  }
})