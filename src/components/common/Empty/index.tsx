import { View, Text } from '@tarojs/components'
import './index.scss'

interface EmptyProps {
  text?: string
}

export default function Empty({ text = '暂无数据' }: EmptyProps) {
  return (
    <View className='empty'>
      <Text className='empty__icon'>🗂</Text>
      <Text className='empty__text'>{text}</Text>
    </View>
  )
}
