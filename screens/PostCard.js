import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from "firebase";

export default class PostCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            light_theme: true,
            post_id: this.props.post.key,
            post_data: this.props.post.value
        }
    }

    componentDidMount(){
        this.fetchUser();
    }

    fetchUser = ()=>{
        let theme;
        firebase
            .database()
            .ref("/users/" + firebase.auth().currentUser.uid)
            .on("value", (snapshot)=>{
                theme = snapshot.val().current_theme
                this.setState({light_theme: theme === "light"})
            })
    }

    render(){
        return(
            <TouchableOpacity style = {styles.container} onPress = {()=> this.props.navigation.navigate("PostScreen", post = this.props.post)}>
                <View style = {this.state.light_theme ? styles.cardContainerLight : styles.cardContainer}>
                    <View style = {styles.authorContainer}>
                        <View style = {styles.authorImageContainer}>
                            <Image 
                             source = {require("../assets/profile_img.png")}
                             style = {styles.profileImage}>
                            </Image>
                        </View>
                        <View style = {styles.authorNameContainer}>
                            <Text style = {this.state.light_theme ? styles.authorNameTextLight : styles.authorNameText}>{this.props.post.author}</Text>
                        </View>
                    </View>
                    <Image source = {require("../assets/image_1.jpg")} style = {styles.postImage}/>
                    <View>
                        <Text style = {this.state.light_theme ? styles.captionTextLight : styles.captionText}>{this.props.post.caption}</Text>
                    </View>
                    <View style = {styles.actionContainer}>
                        <View style = {styles.likeButton}>
                            <Ionicons name = {"heart"} size = {RFValue(30)} color = {"white"} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
       flex: 1 
    },
    cardContainer: {
        margin: RFValue(13),
        backgroundColor: "#2a2a2a",
        borderRadius: RFValue(20),
        padding: RFValue(20)
    },
    cardContainerLight: {
        margin: RFValue(13),
    
        backgroundColor: "white",
        borderRadius: RFValue(20),
        shadowColor: "rgb(0, 0, 0)",
        shadowOffset: {
          width: 3,
          height: 3
        }
     },
    authorContainer: {
        flex: 1,
        flexDirection: "row"
    },
    authorImageContainer: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    profileImage: {
        resizeMode: "contain",
        width: "100%",
        height: "100%",
        borderRadius: RFValue(100)
    },
    authorNameContainer: {
        flex: 0.85,
        justifyContent: "center"
    },
    authorNameText: {
        fontSize: RFValue(20),
        color: "white"
    },
    authorNameTextLight: {
        fontSize: RFValue(18),
        color: "black"
    },
    postImage: {
        marginTop: RFValue(20),
        resizeMode: "contain",
        width: "100%",
        alignSelf: "center",
        height: RFValue(275)
    },
    actionContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10)
    },
    captionText: {
        fontSize: 13,
        color: "white",
        paddingTop: RFValue(10)
    },
    captionTextLight: {
        fontSize: 13,
        color: "black",
        paddingTop: RFValue(10)
    },
    likeButton: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#eb3948",
        borderRadius: RFValue(30)
    }
})