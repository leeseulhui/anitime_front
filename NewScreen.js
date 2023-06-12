import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewScreen = () => {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    navigation.navigate('뒤로가기');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>등록완료되었습니다</Text>
      <Button title="Home" onPress={handleButtonPress} />
    </View>
  );
};

export default NewScreen;
