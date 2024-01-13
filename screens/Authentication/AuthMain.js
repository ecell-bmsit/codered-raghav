import React from 'react'
import { useState } from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,Alert,TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale } from "react-native-size-matters";
import { CommonActions } from '@react-navigation/native';

import { MotiView, useAnimationState } from 'moti'
import { Shadow } from 'react-native-shadow-2';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import User from '../../models/User';
import {
    TextButton,
    IconButton,
    FormInput,
    CheckBox,
    CountryDropDown,Header2
} from "../../components";
import { icons, images, COLORS, FONTS, SIZES } from '../../constants';
import Chemical from '../../models/Chemical';
import Elite from '../../models/Elite';

const AuthMain = ({ navigation ,route}) => {
    const signUp = route.params?.signUp;
    console.log(signUp)

    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [countryError, setCountryError] = useState(null);
    const [termsError, setTermsError] = useState(null);

    const validateName = (text) => {
        if (text.trim().length < 2) {
            setNameError("Name should be at least 2 characters.");
            return false;
        } else {
            setNameError(null);
            return true;
        }
    };
    const validateCountry = (selectedCountry) => {
        if (!selectedCountry) {  // Assuming an absence of selectedCountry means none selected
            setCountryError("Please select a country.");
            return false;
        } else {
            setCountryError(null);
            return true;
        }
    };
    
    const validateTerms = (isChecked) => {
        if (!isChecked) {
            setTermsError("You must agree to the Terms and Conditions to proceed.");
            return false;
        } else {
            setTermsError(null);
            return true;
        }
    };
    
    
    const validateEmail = (text) => {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regex.test(text)) {
            setEmailError("Please enter a valid email address.");
            return false;
        } else {
            setEmailError(null);
            return true;
        }
    };
    
    const validatePhone = (text) => {
        const regex = /^[0-9]+$/;  // simple validation, just checking for digits
        if (!regex.test(text) || text.length < 10) {
            setPhoneError("Please enter a valid phone number.");
            return false;
        } else {
            setPhoneError(null);
            return true;
        }
    };
    
    const validatePassword = (text) => {
        const lowerCaseRegex = /[a-z]/;
        const upperCaseRegex = /[A-Z]/;
        const digitRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        
        if (text.length < 8) {
            setPasswordError("Password should be at least 8 characters.");
            return false;
        }
        if (!lowerCaseRegex.test(text)) {
            setPasswordError("Password should contain at least one lowercase character.");
            return false;
        }
        if (!upperCaseRegex.test(text)) {
            setPasswordError("Password should contain at least one uppercase character.");
            return false;
        }
        if (!digitRegex.test(text)) {
            setPasswordError("Password should contain at least one digit.");
            return false;
        }
        if (!specialCharRegex.test(text)) {
            setPasswordError("Password should contain at least one special character.");
            return false;
        }
        setPasswordError(null);
        return true;
    };
    

    const handleSignupPress = () => {
        const isNameValid = validateName(name);
        const isEmailValid = validateEmail(email);
        const isPhoneValid = validatePhone(phone);
        const isPasswordValid = validatePassword(password);
        
    const isCountryValid = validateCountry(selectedCountry);
    const areTermsAccepted = validateTerms(termsChecked);
    if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isCountryValid && areTermsAccepted) {
        handleSignup();  // Assuming this function is implemented elsewhere
        }
    };
    

    const handleLogin = async () => {
        try {
            // const user = await User.login('demo@gmail.com','Hacchu@123');
            // Alert.alert("Pre","pressed")
                        const user = await User.login(email,password);
                        console.log(user.role)

            await AsyncStorage.setItem('user', JSON.stringify(user));

            
            const l1 = await Chemical.getlist1Chemicals()
            // console.log(l1)
           
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Dashboard',
                          
                        },
                    ],
                })
            );
           
            
   
           // Alert.alert("Success", "Logged in successfully!");
         
        } catch (error) {
            // const pppo = User.sendip()
            // Alert.alert("see",pppo)
            // console.log("hikjfkdjkfjkj")
            Alert.alert("Oops!", error.message);
            // console.log("hello")
        }
    };
    const handleSignup = async () => {
        try {
            const ph_no = selectedCountry.callingCode + ' ' + phone
            console.log(ph_no)
            const user = await User.sendOtp(ph_no,email)
            console.log(user)
            // Do something with the user object, e.g., navigate to another screen, save user data, etc.
            navigation.navigate("SignUpOtp", {phone,email,name,password,country:selectedCountry })

        } catch (error) {
            console.log("hi")
            Alert.alert("Error", error.message);
            console.log("hello")
        }
    };
    const [searchQuery, setSearchQuery] = React.useState("");

    const [mode, setMode] = signUp == true?  React.useState("signUp"): React.useState("signIn")
    const [countries, setCountries] = React.useState([])
    const [showCountryModal, setShowCountryModal] = React.useState(false)
    const [isVisible, setIsVisible] = React.useState(false)
    const [termsChecked, setTermsChecked] = React.useState(false)

    // Form State
    const [email, setEmail] = React.useState("")
    const [name, setName] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [selectedCountry, setSelectedCountry] = React.useState(null)
    const [password, setPassword] = React.useState("")

    const animationState = useAnimationState({
        signIn: {
            height: SIZES.height * 0.55,
        },
        signUp: {
            height: SIZES.height > 700 ? SIZES.height * 0.70 : SIZES.height * 0.65,
        },
    })

    React.useEffect(() => {
        if(signUp){
            animationState.transitionTo('signUp')
        }
        else{
        // Animation
        animationState.transitionTo('signIn')
    }

        // Fetch countires
        fetch("https://restcountries.com/v2/all")
            .then(response => response.json())
            .then(data => {
                let countryData = data.map(item => {
                    return {
                        code: item.alpha2Code,
                        name: item.name,
                        callingCode: `+${item.callingCodes[0]}`,
                        flag: `https://flagsapi.com/${item.alpha2Code}/shiny/64`
                    }
                })

                setCountries(countryData)
            })
    }, [])

    // Render

    function renderSignIn() {
        return (
            <MotiView
                state={animationState}
                style={{
                    marginTop: SIZES.padding,
                    height: SIZES.height * 0.55,
                }}
            >
                <Shadow>
                    <View
                        style={{
                            flex: 1,
                            width: SIZES.width - (SIZES.padding * 2),
                            paddingHorizontal: SIZES.padding,
                            paddingVertical: SIZES.padding,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.light,
                            zIndex: 1
                        }}
                    >
                        <Text
                            style={{
                                width: "60%",
                                lineHeight: scale(40),
                                color: COLORS.dark,
                                ...FONTS.h1,
                            }}
                        >
                            Sign in to continue.
                        </Text>

                        <KeyboardAwareScrollView
                            enableOnAndroid={true}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps={"handled"}
                            extraScrollHeight={-300}
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'center'
                            }}
                        >
                            {/* Email */}
                            <FormInput
                                containerStyle={{
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.error,
                                }}
                                placeholder="Email or Phone"
                                value={email}
                                onChange={(text) => setEmail(text)}
                                prependComponent={
                                    <Image
                                        source={icons.email}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: SIZES.base
                                        }}
                                    />
                                }
                            />

                            {/* Password */}
                            <FormInput
                                containerStyle={{
                                    marginTop: SIZES.radius,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.error,
                                }}
                                placeholder="Password"
                                value={password}
                                secureTextEntry={!isVisible}
                                onChange={(text) => setPassword(text)}
                                prependComponent={
                                    <Image
                                        source={icons.lock}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: SIZES.base
                                        }}
                                    />
                                }
                                appendComponent={
                                    <IconButton
                                        icon={isVisible ? icons.eye_off : icons.eye}
                                        iconStyle={{
                                            tintColor: COLORS.grey
                                        }}
                                        onPress={() => setIsVisible(!isVisible)}
                                    />
                                }
                            />

                            <View
                                style={{
                                    alignItems: 'flex-end'
                                }}
                            >
                                <TextButton
                                    label="Forgot Password?"
                                    contentContainerStyle={{
                                        marginTop: SIZES.radius,
                                        backgroundColor: null
                                    }}
                                    labelStyle={{
                                        color: COLORS.support3,
                                        ...FONTS.h4
                                    }}
                                    onPress={() => {
                                        navigation.navigate("ForgotPassword")
                                    }}
                                />
                            </View>
                        </KeyboardAwareScrollView>

                        <TextButton
                            label="Log In"
                            contentContainerStyle={{
                                height: 55,
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.primary
                            }}
                            labelStyle={{
                                ...FONTS.h3
                            }}
                            onPress={handleLogin}
                        />
                    </View>
                </Shadow>
            </MotiView>
        )
    }

    function renderSignUp() {
        return (
            <MotiView
                state={animationState}
                style={{
                    marginTop: SIZES.padding,
                    backgroundColor: COLORS.light
                }}
            >
                <Shadow>
                    <View
                        style={{
                            flex: 1,
                            width: SIZES.width - (SIZES.padding * 2),
                            paddingHorizontal: SIZES.padding,
                            paddingVertical: SIZES.padding,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.light,
                            //zIndex: 1
                        }}
                    >
                        <Text
                            style={{
                                ...FONTS.h1,
                                lineHeight: 45
                            }}
                        >
                            Create new account
                        </Text>

                        <KeyboardAwareScrollView
                            enableOnAndroid={true}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps={"handled"}
                            extraScrollHeight={-100}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexGrow: 1,
                                marginBottom:SIZES.padding,
                                paddingBottom: SIZES.padding * 2
                            }}
                        >
                            {/* Name */}
                            <FormInput
                                containerStyle={{
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.error,
                                }}
                                placeholder="Name"
                                value={name}
                                onChange={(text) => setName(text)}
                                prependComponent={
                                    <Image
                                        source={icons.person}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: SIZES.base
                                        }}
                                    />
                                }
                            />
                            { nameError && <Text style={{ color: 'red' }}>{nameError}</Text> }

                            {/* Email */}
                            <FormInput
                                containerStyle={{
                                    marginTop: SIZES.radius,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.error,
                                }}
                                placeholder="Email"
                                value={email}
                                onChange={(text) => setEmail(text)}
                                prependComponent={
                                    <Image
                                        source={icons.email}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: SIZES.base
                                        }}
                                    />
                                }
                            />
                            { emailError && <Text style={{ color: 'red' }}>{emailError}</Text> }


                            {/* Phone */}
                            <FormInput
                                containerStyle={{
                                    marginTop: SIZES.radius,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.error,
                                }}
                                placeholder="Phone"
                                value={phone}
                                onChange={(text) => setPhone(text)}
                                prependComponent={
                                    <Image
                                        source={icons.phone}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: SIZES.base
                                        }}
                                    />
                                }
                            />
        { phoneError && <Text style={{ color: 'red' }}>{phoneError}</Text> }

                            {/* Country */}
                            <CountryDropDown
                                containerStyle={{
                                    marginTop: SIZES.radius
                                }}
                                selectedCountry={selectedCountry}
                                onPress={() => setShowCountryModal(!showCountryModal)}
                            />
                            { countryError && <Text style={{ color: 'red' }}>{countryError}</Text> }


                            {/* Password */}
                            <FormInput
                                containerStyle={{
                                    marginTop: SIZES.radius,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.error,
                                }}
                                placeholder="Password"
                                value={password}
                                secureTextEntry={!isVisible}
                                onChange={(text) => setPassword(text)}
                                prependComponent={
                                    <Image
                                        source={icons.lock}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: SIZES.base
                                        }}
                                    />
                                }
                                appendComponent={
                                    <IconButton
                                        icon={isVisible ? icons.eye_off : icons.eye}
                                        iconStyle={{
                                            tintColor: COLORS.grey
                                        }}
                                        onPress={() => setIsVisible(!isVisible)}
                                    />
                                }
                            />
                            { passwordError && <Text style={{ color: 'red' }}>{passwordError}</Text> }


                            {/* Terms and Conditions */}
                            <CheckBox
                                containerStyle={{
                                    marginTop: SIZES.radius,
                                }}
                                label="By registering, you agree to our Terms and that you have read our Data Use Policy."
                                isSelected={termsChecked}
                                onPress={() => setTermsChecked(!termsChecked)}
                            />
                            { termsError && <Text style={{ color: 'red' }}>{termsError}</Text> }

                        </KeyboardAwareScrollView>

                        <TextButton
                            label="Create Account"
                            contentContainerStyle={{
                                height: scale(45),
                                marginTop:scale(-20),
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.primary
                            }}
                            labelStyle={{
                                ...FONTS.h3
                            }}
                            onPress={handleSignupPress}
                        />
                    </View>
                </Shadow>
            </MotiView>
        )
    }

    function renderAuthContainer() {
        if (mode == "signIn") {
            return renderSignIn()
        } else {
            return renderSignUp()
        }
    }

    function renderAuthContainerFooter() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height: scale(80),
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    marginTop: scale(-20),
                    marginHorizontal: SIZES.radius,
                    paddingBottom: SIZES.radius,
                    borderBottomLeftRadius: SIZES.radius,
                    borderBottomRightRadius: SIZES.radius,
                    backgroundColor: COLORS.light60,
                    
                }}
            >
                <Text
                    style={{
                        color: COLORS.grey,
                        ...FONTS.body5
                    }}
                >
                    {mode == "signIn" ? "Don't have an account?" : "I already have an account."}
                </Text>

                <TextButton
                    label={mode == "signIn" ? "Create New Account" : "Sign In"}
                    contentContainerStyle={{
                        marginLeft: SIZES.base,
                        backgroundColor: null
                    }}
                    labelStyle={{
                        color: COLORS.support3,
                        ...FONTS.h5
                    }}
                    onPress={() => {
                        console.log(mode)
                        if (animationState.current === 'signIn') {
                            animationState.transitionTo('signUp')
                            setMode("signUp")
                        } else {
                            animationState.transitionTo('signIn')
                            setMode("signIn")
                        }
                    }}
                />
            </View>
        )
    }

    
    function renderCountryModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showCountryModal}
            >
                <TouchableWithoutFeedback
                    onPress={() => setShowCountryModal(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.dark80
                        }}
                    >
                        <View
                            style={{
                                height: 400,
                                width: SIZES.width * 0.8,
                                backgroundColor: COLORS.light,
                                borderRadius: SIZES.radius
                            }}
                        >
                            <View style={{ padding: SIZES.padding, backgroundColor: COLORS.white }}>
    <TextInput 
        style={{ ...FONTS.body3, padding: SIZES.padding, backgroundColor: COLORS.lightGrey, borderRadius: SIZES.radius }} 
        placeholder="Search for country..."
        value={searchQuery}
        onChangeText={setSearchQuery}
    />
</View>

                            <FlatList
                              data={countries.filter(country => country.name.toLowerCase().includes(searchQuery.toLowerCase()))}

                                keyExtractor={(item) => item.code}
                                contentContainerStyle={{
                                    paddingHorizontal: SIZES.padding,
                                    paddingBottom: SIZES.padding,
                                }}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: SIZES.radius
                                            }}
                                            onPress={() => {
                                                console.log(item)
                                                setSelectedCountry(item)
                                                setShowCountryModal(false)
                                            }}
                                        >
                                            <Image
                                                source={{ uri: item.flag }}
                                                resizeMode="contain"
                                                style={{
                                                    width: 40,
                                                    height: 30
                                                }}
                                            />
                                            <Text style={{ flex: 1, marginLeft: SIZES.radius, ...FONTS.body3 }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
     
            <KeyboardAwareScrollView>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: SIZES.padding,
                        backgroundColor: COLORS.lightGrey
                    }}
                >
                
                    {/* Logo */}
                    <Image
                        source={images.logo}
                        style={{
                            alignSelf: 'center',
                            marginTop: SIZES.padding * 2,
                            width: 250,
                            height: 200,
                            resizeMode: 'contain'
                
                
                        }}
                    />
                    {/* Auth Container */}
                    <View
                        style={{
                            zIndex: 1,
                        }}
                    >
                        {renderAuthContainer()}
                    </View>
                    {renderAuthContainerFooter()}
                    {/* Social Logins */}
                    {/* {mode == "signIn" && renderSocialLogins()} */}
                    {/* Country Modal */}
                    {renderCountryModal()}
                </View>
            </KeyboardAwareScrollView>
        
    )
}

const styles = StyleSheet.create({
    socialButtonContainer: {
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.grey20
    }
})

export default AuthMain;