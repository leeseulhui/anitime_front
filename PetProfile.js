//강아지 프로필 등록 PetProfile.js
    import { StatusBar } from 'expo-status-bar';
    import React, { useState, useEffect } from 'react';
    import { StyleSheet, Text, View, TextInput, ScrollView
    , TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Button,} from 'react-native';
    import * as ImagePicker from 'expo-image-picker';
    import {Picker} from '@react-native-picker/picker';

    //성별 옵션
    const genderOptions = [
    { label: '수컷', value: '수컷' },
    { label: '암컷', value: '암컷' },
    ];
    //출생년도 옵션
    const years = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012,
    2011, 2010, 2009,2008,2007,2006,2005,2004,2003,2002];

    export default function PetProfile({ navigation, route }) {
    const [image, setImage] = useState(null);
    const [text, setText]=useState("");
    const [selectedBreed, setSelectedBreed] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [yearModalVisible, setYearModalVisible] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [selectedGender, setSelectedGender] = useState(null);

    //Main에서 선택된 대표사진을 PetProfile에서 사용하기위함
    useEffect(() => {
        if (route.params && route.params.selectedImage) {
          setImage(route.params.selectedImage);
        }
      }, []);

      //사용자가 선택한 객체data를 서버로 전송
      const handleSaveProfile = async () => {
        const newProfile = {
            dogName: text,
            dogBreed: selectedBreed,
            dogBirthYear: selectedYear,
            dogSex: selectedGender,
        };
    
        try {
            const response = await fetch('http://192.168.35.163:5001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProfile),
            });
    
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleGenderValueChange = (gender) => {
        setSelectedGender(gender);
        setGenderModalVisible(false);
    };

    const handlePress = () => {
        setModalVisible(true);
    };
    
    const handlePickerValueChange = (value) => {
        setSelectedBreed(value);
        setModalVisible(false);
    };
    
    const handleYearValueChange = (value) => {
        setSelectedYear(value);
    };


    
    //프로필 사진을 변경할 수 있는 함수
    const pickImage = async() =>{
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect:[4,3],
        quality: 1,
        });

        console.log(result);

        if(!result.canceled){
        setImage(result.uri);
        }
    };

    const onChangeText = (text) => {
        setText(text);
    };
    //견종 옵션
    const breeds = [
        '치와와',
        '푸들',
        '골든 리트리버',
        '비숑 프리제',
        '시츄',
        '미니어처 핀셔',
        '닥스훈트',
        '요크셔 테리어',
        '보더 콜리',
        '스코티쉬 테리어',
        '웰시 코기',];
    
    return (
       
        <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
            <Text style={styles.petprofile}>반려견 프로필</Text>
        </View>        
        <TouchableOpacity onPress={pickImage} style={styles.imageUploader}>{/*사용자가 터치하면 pickimage실행*/}
            {image ? (
            <Image source={{ uri: image }} style={styles.image} />
            ) : (
            null
            )}
        </TouchableOpacity>
        <View>
            <Text style={styles.title}>반려견 이름</Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.Textin}
            onChangeText={onChangeText}
            value={text}
            returnKeyType='done'
            />
        </View>
        <View>
    <Text style={styles.title}>견종</Text>
    <TouchableOpacity onPress={handlePress}>
        <View style={styles.breedPicker}>
        {selectedBreed ?
            <Text style={styles.selectedBreedText}>{selectedBreed}</Text> :
            <Text style={styles.placeholderText}>선택</Text>
        }
        </View>
    </TouchableOpacity>

{/*견종 모달창 */}
    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
    >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
        <Picker
            selectedValue={selectedBreed}
            onValueChange={handlePickerValueChange}
        >
            <Picker.Item label="선택" value={null} />
            {breeds.map((breed, index) => (
            <Picker.Item key={index} label={breed} value={breed} />
            ))}
        </Picker>
        </View>
    </Modal>
    </View>

    <View>
    <Text style={styles.title}>출생년도</Text>
    <TouchableOpacity onPress={() => setYearModalVisible(true)}>
        <View style={styles.breedPicker}>
        {selectedYear ?
            <Text style={styles.selectedBreedText}>{selectedYear}</Text> :
            <Text style={styles.placeholderText}>선택</Text>
        }
        </View>
    </TouchableOpacity>

{/* 출생년도 모달창 */}
    <Modal
        visible={yearModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setYearModalVisible(false)}
    >
        <TouchableWithoutFeedback onPress={() => setYearModalVisible(false)}>
        <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
        <Picker
            selectedValue={selectedYear}
            onValueChange={handleYearValueChange}
        >
            <Picker.Item label="선택" value={null} />
            {years.map((year, index) => (
            <Picker.Item key={index} label={year.toString()} value={year} />
            ))}
        </Picker>
        </View>
    </Modal>
    </View>



    <View>
    <Text style={styles.title}>성별</Text>
    <TouchableOpacity onPress={() => setGenderModalVisible(true)}>
        <View style={styles.breedPicker}>
        {selectedGender ?
            <Text style={styles.selectedBreedText}>{selectedGender}</Text> :
            <Text style={styles.placeholderText}>선택</Text>
        }
        
{/* 성별 모달창 */}
    <Modal
    visible={genderModalVisible}
    transparent={true}
    animationType="fade"
    onRequestClose={() => setGenderModalVisible(false)}
    >
    <TouchableWithoutFeedback onPress={() => setGenderModalVisible(false)}>
        <View style={styles.modalOverlay} />
    </TouchableWithoutFeedback>

    <View style={styles.modalContent}>
        <Picker
        selectedValue={selectedGender}
        onValueChange={handleGenderValueChange}
        >
        <Picker.Item label="선택" value={null} />
    {genderOptions.map((option, index) => (
    <Picker.Item key={index} label={option.label} value={option.value} />
    ))}

        </Picker>
    </View>
    </Modal>
        </View>
    </TouchableOpacity>
    </View>
  <TouchableOpacity style={styles.completeButton} onPress={async() => {
    if (image && text && selectedBreed && selectedYear && selectedGender) {
            await handleSaveProfile();//handleSaveProfile await키워드로 호출 > 서버전송
        navigation.navigate('유저 프로필설정');
    } else {
      alert('모든 항목을 선택해주세요.');
    }
  }}>
  <Text style={styles.buttonText}>다음</Text>
  </TouchableOpacity>
</View>

   

   
    );
    };


    const styles = StyleSheet.create({
        container: {
        flex: 1,
        backgroundColor: '#fff',
        
        },
        header: {
        marginLeft: 30,
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 30,
        
        },
        petprofile :{
            fontSize: 35,
            fontWeight: "600",
            color:'#FFB74D', 
        },
        image: {
            
            width: 150,
            height: 150,
            borderRadius: 75,
        },
        imageUploader:{
            marginHorizontal:120,
            width:150,
            height:150,
            borderRadius:75,
            borderWidth:3,
            borderColor: '#bbb',
            alignItems:'center',
            justifyContent:'center'
        },
        Textin:{
            padding:10,
            fontSize: 16,
            borderWidth:0,
            borderBottomWidth: 1,
            borderColor:'gray',
            textAlign : 'center',
        
        
        },
        inputContainer:{
        
            marginTop : 10,
            marginLeft : 40,
            width:'80%',
            
        },
        title:{
            marginTop : 10,
            marginLeft: 50,
            fontSize :18,
            color:'#FFB74D',
            fontWeight:'300',
        },
        breedPicker: {
            marginTop: 10,
            width: 200,
            height: 40,
            borderWidth: 0.5,
            borderRadius: 15,
            marginLeft:90,
            borderColor: '#ccc',
            alignItems: 'center',
            justifyContent: 'center',
        },
        selectedBreedText: {
            color: '#333',
            fontSize: 16,
        },
        placeholderText: {
            color: '#999',
            fontSize: 16,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            justifyContent: 'center',
        },
        completeButton: {
          marginTop: 50,
          marginLeft:75,
          height: 50,
          width: 250,
          borderRadius: 25,
          backgroundColor: '#FFB74D',
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonText: {
            color: '#fff',
            fontSize: 20,
          },
            
          });