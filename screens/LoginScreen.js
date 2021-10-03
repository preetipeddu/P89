import React, {Component} from "react";
import {Text, View, StyleSheet, SafeAreaView, Platform, StatusBar, Image} from "react-native";
import firebase from "firebase";
import {TouchableOpacity} from "react-native-gesture-handler";
import {RFValue} from "react-native-responsive-fontsize";
import * as Google from "expo-google-app-auth";
import * as Font from "expo-font";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class LoginScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
        
        }
    }

    componentDidMount(){
    
    }

    isUserEqual = (googleUser, firebaseUser) =>{
        if(firebaseUser){
            var providerData = firebaseUser.providerData;
            for(var i = 0; i < providerData.length; i ++){
                if(
                    providerData[i].providerId ===
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()
                ){
                    return true;
                }
            }
        }
        return false;
    };

    onSignIn = googleUser =>{
        var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser =>{
            unsubscribe();
        if(!this.isUserEqual(googleUser, firebaseUser)){
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
            );

            firebase
                .auth()
                .signInWithCredential(credential)
                .then(function (result){
                    if(result.additionalUserInfo.isNewUser){
                        firebase
                            .database()
                            .ref("/users/" + result.user.uid)
                            .set({
                                gmail: result.user.email,
                                profile_picture: result.additionalUserInfo.profile.picture,
                                locale: result.additionalUserInfo.profile.locale,
                                first_name: result.additionalUserInfo.profile.given_name,
                                last_name: result.additionalUserInfo.profile.family_name,
                                current_theme: "dark"
                            })
                            .then(function (snapshot){});
                    }
                })
                .catch(error =>{
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var email = error.email;
                    var credential = error.credential;
                });
        } else {
            console.log("User already signed-in Firebase.");
        }
        });
    }

    signInWithGoogleAsync = async ()=>{
        try {
            const result = await Google.logInAsync({
                behaviour: "web",
                androidClientId: "653121982798-h3sv6qdg2de373iqqim07r4vln7jh9nr.apps.googleusercontent.com",
                iosClientId: "653121982798-hirsckjtihob5p8ojhed647mtpi5p6qb.apps.googleusercontent.com",
                scopes: ["profile", "email"]
            })

            if(result.type === "success"){
                this.onSignIn(result)
                return result.accessToken
            } else {
                return {cancelled: true}
            }
        } catch(e){
            console.log(e.message);
            return {error: true}
        }
    }

    render(){
            return(
                <View style = {styles.container}>
                    <SafeAreaView style = {styles.droidSafeArea} />
                    <View style = {styles.appTitle}>
                        <Image
                            source = {require("../assets/logo.png")}
                            style = {styles.appIcon}
                        >
                        </Image>
                        <Text style = {styles.appTitleText}>Spectagram</Text>
                    </View>
                    <View style = {styles.buttonContainer}>
                        <TouchableOpacity 
                        style = {styles.button}
                        onPress = {()=> this.signInWithGoogleAsync()}
                        >
                            <Text style = {styles.googleText}>Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#15193c"
      },
      droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
      },
      appTitle: {
        flex: 0.4,
        justifyContent: "center",
        alignItems: "center"
      },
      appIcon: {
        width: RFValue(130),
        height: RFValue(130),
        resizeMode: "contain"
      },
      appTitleText: {
        color: "white",
        textAlign: "center",
        fontSize: RFValue(40),
        fontFamily: "Bubblegum-Sans"
      },
      buttonContainer: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
      },
      button: {
        width: RFValue(250),
        height: RFValue(50),
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: RFValue(30),
        backgroundColor: "white"
      },
      googleIcon: {
        width: RFValue(30),
        height: RFValue(30),
        resizeMode: "contain"
      },
      googleText: {
        color: "black",
        fontSize: RFValue(20),
        fontFamily: "Bubblegum-Sans"
      }
})