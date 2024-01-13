import React from "react";
import { View, Image, StyleSheet } from "react-native";


import { SIZES, images } from "../../constants";


const Walkthrough1 = () => {
  return (
    <View>
      <Image
                source={images.walkthrough_04}
                style={{
                    ...styles.image,
                    top:-90,
                    left:"10%",
                    height:300,
                    width:350
                }}
            />
    </View>
  );
};

export default Walkthrough1;
const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        width: 140,
        height: 140,
        zIndex: 0,
        borderRadius: SIZES.radius
    }
})
