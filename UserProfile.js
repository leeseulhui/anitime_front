//사용자 프로필 등록 UserProfile.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';

export default function UserProfile({ navigation }) {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  //완료 버튼을 눌렀을 시 항목이 채워졌는지 조회하기 위한 함수
  const isFormValid = () => {
    return userName !== '' && phoneNumber !== '' && email !== '';
  };
  //항목이 모두 채워졌을시 서버로 정보를 전송하고 Complete.js로 네비게이션, 아닐경우 경고 창
  const handleCompletePress = async() => {
    await handleSaveProfile_user();
    if (isFormValid()) {
      navigation.navigate('Complete');
    } else {
      alert('모든 항목을 채워주세요.');
    }
  };

  //userProfile 정보를 서버로 전송하기위한 함수
  const handleSaveProfile_user = async () => {
    const userProfile = {
        registrant : userName,
        phoneNum:phoneNumber,
        email:email,
    };

    try {
        const response = await fetch('http://192.168.35.163:5001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userProfile),
        });

        const responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <View style={styles.container}>
       <View style={styles.header}>
            <Text style={styles.petprofile}>등록자 프로필</Text>
        </View>
      <Text style={styles.title}>등록자 이름</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setUserName(text)}
        value={userName}
        returnKeyType="done"
      />
      <Text style={styles.title}>전화번호</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
        keyboardType="phone-pad"
        returnKeyType="done"
      />
      <Text style={styles.title}>이메일</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.completeButton} onPress={handleCompletePress}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:50,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  title: {
    marginTop: 40,
    fontSize: 18,
    color: '#FFB74D',
    fontWeight: '300',
  },
  input: {
    marginTop: 10,
    fontSize: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  completeButton: {
    marginTop: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFB74D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  header: {
    marginLeft: 10,
    flexDirection: 'row',
    marginTop: 100,
    marginBottom: 30,

},
petprofile :{
  fontSize: 35,
  fontWeight: "600",
  color:'#FFB74D', 
},
});
