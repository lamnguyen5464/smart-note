import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { DefaultSize } from '@utils/Constants';
import LinearGradient from 'react-native-linear-gradient';

const CustomizedContainer = ({ type = null, containerStyle = {}, children, angle = 45 }) => {
    const appliedType = styles[type] || {};
    containerStyle = Array.isArray(containerStyle) ? containerStyle : [containerStyle];
    const combinedStyle = [appliedType, ...containerStyle].reduce((finalStyle, currentStyle) => ({
        ...finalStyle,
        ...currentStyle,
    }));
    const colors = combinedStyle?.backgroundColor?.length > 1 && combinedStyle?.backgroundColor;
    return (
        <LinearGradient
            style={combinedStyle}
            colors={colors || [Colors.white, Colors.white]}
            useAngle={true}
            angle={angle}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    main_theme: {
        backgroundColor: [Colors.primary_1, Colors.primary_2],
    },
    foreground: {
        backgroundColor: [Colors.primary_2, 'white', 'white'],
        width: '100%',
        height: 300,
    },
    primary: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: [Colors.primary_1, Colors.primary_1],
    },
    secondary: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: [Colors.white, Colors.white],
        borderColor: Colors.primary_1,
        borderWidth: DefaultSize.XXS / 2,
    },
    white_overlay: {
        ...SharedStyles.shadow,
        paddingHorizontal: DefaultSize.L,
        paddingVertical: DefaultSize.XL,
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%',
        borderRadius: DefaultSize.L,
    },
    main_screen: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: Colors.gradient_peach,
    },
    peach: {
        ...SharedStyles.shadow,
        backgroundColor: [Colors.base_2, Colors.base_2],
        paddingHorizontal: DefaultSize.L,
        paddingVertical: DefaultSize.XS,
        borderRadius: DefaultSize.XL,
        alignItems: 'center',
    },
    gray: {
        ...SharedStyles.shadow,
        backgroundColor: [Colors.black_03, Colors.black_03],
        paddingHorizontal: DefaultSize.L,
        paddingVertical: DefaultSize.XS,
        borderRadius: DefaultSize.XL,
        alignItems: 'center',
    },
});

export default React.memo(CustomizedContainer);
