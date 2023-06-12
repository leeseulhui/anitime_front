import React,{useState, useEffect} from 'react';
import { View, Text, Button,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewScreen = () => {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    navigation.navigate('뒤로가기');
  };

  const App=()=>{
    const [data, setData] = useState(null);
  const url = 'http://192.168.35.163:5001/register';

  useEffect(() => {
    fetchData();
  }, []);
  }

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {data ? <Text>등록번호 {data.regist}</Text> : <Text>Loading...</Text>}
      {data ? <Text>반려견 이름 {data.dogName}</Text> : <Text>Loading...</Text>}
      {data ? <Text>견종 {data.Breed}</Text> : <Text>Loading...</Text>}
      {data ? <Text>출생년도 {data.dogBirthYear}</Text> : <Text>Loading...</Text>}
      {data ? <Text>성별 {data.dogSex}</Text> : <Text>Loading...</Text>}
      {data ? <Text>등록자 이름 {data.dogName}</Text> : <Text>Loading...</Text>}
      {data ? <Text>등록자 번호 {data.dogName}</Text> : <Text>Loading...</Text>}
      {data ? <Text>{data.regist}% 일치합니다</Text> : <Text>Loading...</Text>}

      <Button title="처음으로" onPress={handleButtonPress} />
    </View>
  );
};

export default NewScreen;
