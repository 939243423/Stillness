import { View, Text, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <View className='index__header'>
        <Text className='index__title'>首页</Text>
      </View>
      <View className='index__content'>
        <Text className='index__desc'>欢迎使用 Taro React 小程序</Text>
      </View>
    </View>
  )
}
