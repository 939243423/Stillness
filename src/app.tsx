import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import { PrivacyPopup } from './components/PrivacyPopup'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: 'cloud1-d2gk9rieib91d875d', // 这里建议填入你的环境ID，或者保持动态
        traceUser: true,
      })
    }
  }
  componentDidShow() {}
  componentDidHide() {}

  render() {
    return (
      <>
        {this.props.children}
        <PrivacyPopup />
      </>
    )
  }
}

export default App
