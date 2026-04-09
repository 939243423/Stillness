import { Component, PropsWithChildren } from 'react'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {}
  componentDidShow() {}
  componentDidHide() {}

  render() {
    // Children 是要渲染的页面
    return this.props.children
  }
}

export default App
