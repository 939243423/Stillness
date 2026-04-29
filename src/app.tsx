import { Component, PropsWithChildren } from 'react'
import { PrivacyPopup } from './components/PrivacyPopup'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {}
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
