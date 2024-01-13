import React from "react";
import { useState } from 'react';

import {
    View,
    Text,
    Image,
    Keyboard, Alert
} from "react-native"

import {
    Header2,
    FormInput,
    TextButton,IconButton
} from "../../components";
import { COLORS, FONTS, SIZES, icons, TextInput } from '../../constants';
import User from "../../models/User";
import { CommonActions } from '@react-navigation/native';

const ForgotPassword = ({ navigation }) => {
    const [isVisible, setIsVisible] = React.useState(false)

    const [phone, setPhone] = React.useState("")
    const [passwordError, setPasswordError] = useState(null);
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
    const [buttonPosition, setButtonPosition] = React.useState(SIZES.padding)
    const [isOtpSent, setIsOtpSent] = React.useState(false);
    const [otp, setOtp] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [phoneError, setPhoneError] = useState(null);
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
    React.useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", (e) => {
            setButtonPosition(e.endCoordinates.height + SIZES.padding)
        });
        const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
            setButtonPosition(SIZES.padding)
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleotp = async () => {
        try {
            const isPhoneValid = validatePhone(phone);

          if(isPhoneValid){
            console.log(phone)
            const status = await User.sendOtp2(phone)
            if (status) {
                setIsOtpSent(true);
            }
          }
        } catch (error) {
            console.log("hisjd")
            Alert.alert("Error", error.message);
        }
    };
    const handlechange = async () => {
        try {
            console.log(phone)
            const isPasswordValid = validatePassword(newPassword);

           if(isPasswordValid){
            const status = await User.changePassword(phone,newPassword,otp)
            if (status) {
                // setIsOtpSent(true);
                Alert.alert("Yeah..!","Password Updated Succesfully")
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'AuthMain',
                               
                            },
                        ],
                    })
                );
            }
           }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightGrey }}>
            <Header2 title="Forgot Password" />

            <View style={{ flex: 1, paddingHorizontal: SIZES.padding }}>
                {!isOtpSent ? (
                    <>
                        <Text style={{ marginTop: SIZES.padding * 2, width: "70%", ...FONTS.h1 }}>
                            Continue using phone number.
                        </Text>
                        <FormInput
                            containerStyle={{ marginTop: SIZES.padding * 2, borderRadius: SIZES.radius }}
                            inputContainerStyle={{ backgroundColor: COLORS.light }}
                            placeholder="Phone number"
                            value={phone}
                            keyboardType="phone-pad"
                            prependComponent={
                                <Image
                                    source={icons.phone}
                                    style={{ width: 25, height: 25, marginRight: SIZES.base }}
                                />
                            }
                            onChange={(text) => setPhone(text)}
                        />
                                { phoneError && <Text style={{ color: 'red' }}>{phoneError}</Text> }

                    </>
                ) : (
                    <>
                        <FormInput
                            containerStyle={{ marginTop: SIZES.padding * 2, borderRadius: SIZES.radius }}
                            inputContainerStyle={{ backgroundColor: COLORS.light }}
                            placeholder="OTP"
                            value={otp}
                            keyboardType="number-pad"
                            onChange={(text) => setOtp(text)}
                        />
                        <FormInput
                            containerStyle={{ marginTop: SIZES.padding, borderRadius: SIZES.radius }}
                            inputContainerStyle={{ backgroundColor: COLORS.light }}
                            placeholder="New Password"
                            value={newPassword}
                            secureTextEntry={!isVisible}
                            appendComponent={
                                <IconButton
                                    icon={isVisible ? icons.eye_off : icons.eye}
                                    iconStyle={{
                                        tintColor: COLORS.grey
                                    }}
                                    onPress={() => setIsVisible(!isVisible)}
                                />
                            }
                            onChange={(text) => setNewPassword(text)}
                        />
                                                    { passwordError && <Text style={{ color: 'red' }}>{passwordError}</Text> }

                    </>
                )}
            </View>

            <TextButton
                label={!isOtpSent ? "Send Verification Code" : "Submit"}
                contentContainerStyle={{
                    position: 'absolute',
                    bottom: buttonPosition,
                    left: SIZES.padding,
                    right: SIZES.padding,
                    height: 55,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.primary
                }}
                labelStyle={{ ...FONTS.h3 }}
                onPress={!isOtpSent ? handleotp :handlechange
                }
            />
        </View>
    )
}

export default ForgotPassword;
