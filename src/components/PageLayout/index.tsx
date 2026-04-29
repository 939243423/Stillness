import { View } from '@tarojs/components';
import { PrivacyPopup } from '../PrivacyPopup';

export const PageLayout = (props: any) => {
  return (
    <View style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {props.children}
      <PrivacyPopup />
    </View>
  );
};
