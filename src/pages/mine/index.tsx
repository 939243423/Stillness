import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Mine() {
  useLoad(() => {
    console.log('Mine page loaded.')
  })

  return (
    <View className='mine'>
      <View className='mine__header'>
        <View className='mine__avatar' />
        <Text className='mine__name'>用户昵称</Text>
      </View>
      <View className='mine__menu'>
        {['我的订单', '收货地址', '设置', '关于我们'].map((item) => (
          <View key={item} className='mine__menu-item'>
            <Text>{item}</Text>
            <Text className='mine__arrow'>›</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
