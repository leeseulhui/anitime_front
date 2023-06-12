import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActionSheetIOS,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from 'expo-splash-screen';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function delay_splash() {
  await SplashScreen.preventAutoHideAsync();
  await sleep(3000);
  await SplashScreen.hideAsync();
}

const MainScreen = ({ navigation }) => {
  const [libraryPermission, setLibraryPermission] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const requestPermissions = async () => {
      // 앨범접근권한확인
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setLibraryPermission(libraryStatus.status === "granted");
  
      // 카메라 접근 권한 확인
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === "granted");
    };
  
    requestPermissions();
  }, []);

  //등록하기 버튼> 옵션모달창
  const showModal = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '촬영하기', '선택하기'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openGallery();  
          }
        }
      );
    }
  };  

  const showModalver2 = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '촬영하기'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            openCameraver2();
          }
        }
      );
    }
  };

  const openCamera = async () => { 
    if (!cameraPermission) { 
      alert("카메라 권한이 필요합니다."); 
      return; 
    } 
   
    setSelectedImages([]); // selectedImages 배열 초기화, 재촬영시 사진 반복사용 막음

    if (selectedImages.length >= 5) { 
      alert("최대 5장까지만 선택할 수 있습니다."); 
   
      navigation.navigate("SelectedImageScreen", { 
        imageUriList: selectedImages 
      }); 
   
      return; 
    } 
   
    const result = await ImagePicker.launchCameraAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsMultipleSelection: false, 
    }); 
   
    if (!result.canceled) { 
      const newSelectedImages = [...selectedImages, result.assets[0].uri]; 
      setSelectedImages(newSelectedImages); 
   
      // 이미지가 5장 미만이면 다시 카메라를 실행하지 않고, 사용자가 5장의 사진을 모두 선택한 경우 대표 사진 선택 페이지로 이동 
      if (newSelectedImages.length >= 5) { 
        navigation.navigate("SelectedImageScreen", { 
          imageUriList: newSelectedImages, 
        }); 
      } 
    } 
  }; 

  const openCameraver2 = async () => { 
    if (!cameraPermission) { 
      alert("카메라 권한이 필요합니다."); 
      return; 
    } 

    const result = await ImagePicker.launchCameraAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsMultipleSelection: false, 
    }); 
   
    if (!result.canceled) { 
      const newSelectedImages = [...selectedImages, result.assets[0].uri]; 
      setSelectedImages(newSelectedImages); 

      if (newSelectedImages.length >= 1) { 
        navigation.navigate("사진조회", { 
          imageUriList: newSelectedImages, 
        }); 
      }  
    } 
    setSelectedImages([]); // selectedImages 배열 초기화, 재촬영시 사진 반복사용 막음
  }; 
  
  
  const openGallery = async () => {
    if (!libraryPermission) {
      alert("앨범 접근 권한이 필요합니다.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      maxImagesCount: 5,
    });
  
    if (!result.canceled) {
      // result.assets를 URI 리스트로 매핑
      const imageUriList = result.assets.map((asset) => asset.uri);
  
      navigation.navigate("SelectedImageScreen", {
        imageUriList: imageUriList, // 매핑한 URI 리스트  를 전달
      });
    }
  };

  return (
    <ImageBackground source={require('./images/hero.jpg')} style={styles.background}> 
      <View style={styles.container}>
        <Text style={[styles.title, { color: '#FFB74D' }]}>ANITIME</Text>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => {
              showModal();
            }}
          >
          <Text style={styles.mainButtonText}>등록하기</Text> 
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => {
              showModalver2();
            }}
          >
          <Text style={styles.mainButtonText}>조회하기</Text>
          </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

//이미지를 서버로 전송
const sendImages = async () => {
  const url = "http://192.168.35.163:5001/register";

  const formData = new FormData();

  selectedImages.forEach((imageUri, index) => {
    const fileType = imageUri.substring(imageUri.lastIndexOf(".") + 1);
    const fileName = `image_${index}.${fileType}`;
    formData.append("images[]", {
      uri: imageUri,
      name: fileName,
      type: `image/${fileType}`,  
    });
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  return response.json();
};

//대표사진선택(프로필사진이용)
const SelectedImageScreen = ({ route, navigation }) => {
  const { imageUriList } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  //5장의 사진을 정렬하기 위해 사이즈 지정
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedImage(item)}>
      <Image source={{ uri: item }} style={{ width: 100, height: 100, margin: 10 }} />
    </TouchableOpacity>
  );

  //대표사진을 선택완료 시 이동 및 알림창
  const confirmSelectedImage = async() => {
    if (selectedImage) {
      alert("대표 사진을 선택했습니다.");
      navigation.navigate("반려견 설정", { selectedImage });
      const result = await sendImages(); //이미지 전송
      console.log(result);

    } else {
      alert("대표 사진을 선택하세요.");
    }
  };

  return (
    <View>
      <FlatList
        data={imageUriList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
      />
      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Text style={styles.selectedImageText}>선택한 대표 사진:</Text>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        </View>
      )}
      <TouchableOpacity style={styles.completeButton} onPress={confirmSelectedImage}>
        <Text style={styles.buttonText}>대표 사진 선택</Text>
      </TouchableOpacity>
    </View>
  );
};

const ReviewScreen = ({ route, navigation }) => {
  const { imageUriList } = route.params;

  const handleCompletePress = () => {
      navigation.navigate('Complete_inquiry');
  };

  return (
    <View style={styles.container}>
      {imageUriList.length > 0 ? (
        <Image source={{ uri: imageUriList[0] }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>찍은 사진이 없습니다.</Text>
      )}

      <TouchableOpacity style={styles.inquiryButton} onPress={handleCompletePress}>
        <Text style={styles.buttonText}>조회하기</Text>
      </TouchableOpacity>
    </View>
  );
};




const Stack = createStackNavigator();

const Main = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="뒤로가기" component={MainScreen} options={{
        headerShown: false
      }}/>
      <Stack.Screen name="사진조회" component={ReviewScreen} />
      <Stack.Screen name="SelectedImageScreen" component={SelectedImageScreen} />
    </Stack.Navigator>
  );
};






const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  completeButton: {
    marginTop: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFB74D",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  inquiryButton: {
    marginTop: 0,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFB74D",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 140,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  mainButton: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginVertical: 10,
  },
  mainButtonText:{
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  selectedImageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    margin: 8,
  },
  image: {
    width: '100%',
    height: 430,
    resizeMode: 'cover',
    marginBottom: 120,
  },
});

export default Main;
