//조회하기 대기 창 
import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TimerScreen = () => {
  const navigation = useNavigation();
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerFinished(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timerFinished) {
      navigation.navigate('NewScreen_inquiry');
    }
  }, [navigation, timerFinished]);

  return (
    <ImageBackground
      source={require('./assets/petloading.jpg')}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <View style={{ marginBottom: 160 }}>
        <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>세상에서</Text>
        <Text style={{ fontSize: 48, color: 'white', fontWeight: 'bold' }}>가장귀여운</Text>
        <Text style={{ fontSize: 38, color: 'white', fontWeight: 'bold' }}>강아지를 찾고있어요!</Text>
      </View>
    </ImageBackground>
  );
};

export default TimerScreen;
