import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { PrivacyPopup } from './components/PrivacyPopup'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: 'cloud1-d2gk9rieib91d875d',
        traceUser: true,
      })
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='app-wrapper'>
        {this.props.children}
        <PrivacyPopup />
      </View>
    )
  }
}

export default App
