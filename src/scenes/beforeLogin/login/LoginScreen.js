import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import useRequest from "../../../hooks/useRequest.js";
import InputWithError from "../../../components/atoms/InputWithError.js";
import Button from "../../../components/atoms/Button.js";
import loginRequest from "../../../requests/login.js";
import AuthContext from "../../../context/AuthContext.js";
import loginScreenValidations from "./LoginScreenValidations.js";
import useValidation from "../../../hooks/useValidation.js";
import logoImage from "./logo.png";
import baseUrl from "../../../baseUrl.js";
import * as fs from "expo-file-system"

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useState({ username: "", password: "" });
  const { auth, setAuth } = useContext(AuthContext);
  const [request, requesting] = useRequest(loginRequest);
  const { validate, errors, addErrors } = useValidation(loginScreenValidations);
  const [isLoading, setIsLoading] = useState(false);

  const sessionPath = fs.cacheDirectory + '/creds.json';

  const today = new Date().toJSON().slice(0,10).replace(/-/g,'/')
  const mustUPDATE = today==="2023/03/03"

  useEffect(() => {
    // Try to read username/password from file
    fs.readAsStringAsync(sessionPath).then((raw) => {
        const json = JSON.parse(raw);
        return request(json.loginCreds);
    }).then(({data}) => {
        setLoggedInState(data);
    }).catch((error) => {
        console.error("something went wrong with automatic login")
    }).finally(() => {
        setIsLoading(false);
    });
}, []);

  //basicaly sets text written inside username and password fields
  //inside 'username' and 'password' properties of 'user' object
  const onChangeText = async (name, text) => {
    const newUser = { ...user, [name]: text };
    setUser(newUser);
    validate(newUser, name).catch((error) => {
      //console.error(error, "<--this is validation error");
    });
  };

  //3. this gets called 3rd
  const getLoginState = (data) => {
    return {
      access_token: data.access_token,
      remember_token: data.remember_token,
      is_logged_in: true,
      agent: data.staff,
      username: user.username,
      password: user.password,
      fromLogin: true
    };
  };

  //this gets called 2nd
  // i should add logic inside here
  // if i want to render stuff based on if user is agnet or client
  const setLoggedInState = (data) => {
    const state = getLoginState(data);
    //console.log(state);
    //pretty sure it should also trigger updateAuthStorage()
  
    setAuth(state);
  };

  const setLoggedIn = (data)=>{
    const state = getLoginState(data);

    const toWrite = JSON.stringify({loginCreds: {...user, remember_token: true}, authState: state});
    console.log(toWrite, "<--towrite")
    fs.writeAsStringAsync(sessionPath, toWrite)
        .then(()=>{
          console.log("it works");
            setLoggedInState(data);
        })
        .catch((e)=>{
          console.error(e, "file prolemn")
        });
  } 

  //this gets execued when login button is clicked
  //so this would be 1st function
  const login = () => {
    validate(user)
      .then(() => {
        // POST /auth/staff
        request({ ...user, remember_token: true })
          .then(({ data }) => {
            
            setLoggedIn(data);
          })
          .catch((error) => {
            addErrors({
              username: "Wrong username/password",
              password: "Wrong username/password",
            });
            console.error(error, "wrong usernmae or password got entered");
          });
      })
      .catch((error) => {
        console.error(error, "44444");
      });
  };

  if (isLoading) {
    return null;
  } else {
    if(!mustUPDATE){
      return (
        <View style={styles.container}>
          <View style={styles.logo}>
            <Image source={logoImage} style={styles.logoImage} />
          </View>
          <View>
            <Text style={styles.PROD}>
              {/* {Date.get} */}
              {baseUrl === "https://api.georgiancargo.co.uk"
                ? "you are on ^^^ PRODUCTION ^^^"
                : "you are on ^^^ STGAGING ^^^^"}
            </Text>
            {/* <Text style={styles.PROD}>{baseUrl}</Text> */}
          </View>
          <View style={styles.formGroup}>
            <InputWithError
              name="username"
              error={errors.username}
              value={user.username}
              label="Username or Email"
              placeholder="Username or Email"
              onChangeText={onChangeText}
              style={styles.field}
            />
            <InputWithError
              name="password"
              error={errors.password}
              value={user.password}
              label="Password"
              placeholder="Password"
              onChangeText={onChangeText}
              secureTextEntry={true}
              style={styles.field}
            />
            <Button onPress={login} loading={requesting} style={styles.field}>
              Login
            </Button>
            <View style={styles.singUp}>
              <Text>Don't have an account? </Text>
              <Text
                style={styles.singUpClickableText}
                onPress={() => {
                  navigation.navigate("Signup");
                }}
              >
                Signup
              </Text>
            </View>
            <View style={styles.resetPassword}>
              <Text>Forgot Password? </Text>
              <Text
                style={styles.resetPasswordClickableText}
                onPress={() => {
                  navigation.navigate("Reset Password");
                }}
              >
                Reset Password
              </Text>
            </View>
          </View>
          <View style={styles.elasticBottom} />
        </View>
      );
    }else{
      return (
        <View><Text style={{display:"flex", justifyContent:"center", paddingTop: "20%", fontWeight: "800", fontSize: 50}}>You must update to the latest version of the application</Text></View>
      )
    }
    
  }
};

const styles = StyleSheet.create({
  PROD: {
    fontWeight: "bold",

    alignSelf: "center",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    //makes login whole login page white
    backgroundColor: "white",
  },
  logo: {
    //higher you set this flex then lower the logo,
    //login and password fields and login button go
    flex: 2,
    //makes logo vertically in center in the space between status bar and login and password fields
    justifyContent: "center",
    //makes logo horizonatally centerd on screen
    alignItems: "center",
  },
  formGroup: {
    flex: 4,
    //makes form be verticllay cented on screen between the logo and bottom of the screen
    justifyContent: "center",
  },
  field: {
    //defines space between fileds in the form
    margin: 5,
  },
  elasticBottom: {
    flex: 2,
  },
  singUp: {
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 10,
  },
  resetPassword: {
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 5,
  },
  singUpClickableText: {
    color: "red",
    fontWeight: "bold",
  },
  resetPasswordClickableText: {
    color: "purple",
    fontWeight: "bold",
  },
  button: {
    // no matter what value I set here, their width doesn't changes
    height: 40,
  },
  logoImage: {
    width: 300,
    resizeMode: "contain",
  },
});

export default LoginScreen;
