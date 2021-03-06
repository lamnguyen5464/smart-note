import { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { useSelector, keySelector, useDispatch, actions } from '@core/context';
import AppNavigator from '@core/navigation/AppNavigator';
import AuthApiHelper from '@helpers/api/AuthApiHelper';
import debounce from 'lodash/debounce';
import FacebookSDK from '@core/nativemodule/facebooksdk';
import AUTH_STACKS_ENUMS from '@screens/AuthStack/enums';

const useAuthEmailVerify = ({ navigation }) => {
    const PAGE_STATUS = {
        TYPING_EMAIL: 'TYPING_EMAIL',
        SENDING_EMAIL: 'SENDING_EMAIL',
        TYPING_OTP: 'TYPING_OTP',
        VERYFYING_OTP: 'VERYFYING_OTP',
    };

    const [pageStatus, setPageStatus] = useState(PAGE_STATUS.TYPING_EMAIL);
    const [errorText, setErrorText] = useState('');

    const isShowOTPInput =
        pageStatus === PAGE_STATUS.TYPING_OTP || pageStatus === PAGE_STATUS.VERYFYING_OTP;

    const loadingCTA =
        pageStatus === PAGE_STATUS.SENDING_EMAIL || pageStatus === PAGE_STATUS.VERYFYING_OTP;

    const refInputEmail = useRef(null);

    const refInputOTP = useRef(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    useEffect(() => {
        if (isShowOTPInput) {
            refInputOTP.current?.focus();
        }
    }, [pageStatus]);

    const clearOTP = () => {
        refInputOTP.current?.reset();
        setPageStatus(PAGE_STATUS.TYPING_OTP);
    };

    const clearError = () => {
        setErrorText('');
    };

    const resetPageStatus = () => {
        setPageStatus(PAGE_STATUS.TYPING_EMAIL);
        clearError();
    };

    const onRecieveVerification = (data = {}) => {
        if (data?.email) {
            AppNavigator.pushScreen(navigation, AUTH_STACKS_ENUMS.AuthRegister, data);
        } else {
            // throw new Error({ description: "Something wrong with server's response" });
        }
    };

    return {
        PAGE_STATUS,
        refInputEmail,
        refInputOTP,
        isShowOTPInput,
        loadingCTA,
        errorText,

        onChangeEmail: debounce(() => {
            resetPageStatus();
        }, 300),

        onPressSendOTP: () => {
            const email = refInputEmail.current?.getValue();
            setPageStatus(PAGE_STATUS.SENDING_EMAIL);
            clearError();
            AuthApiHelper.requestOTP({ email })
                .then(res => {
                    setPageStatus(PAGE_STATUS.TYPING_OTP);
                })
                .catch(e => {
                    setErrorText(e.description);
                    setPageStatus(PAGE_STATUS.TYPING_EMAIL);
                })
                .finally(() => {});
        },

        onPressConfirmOTP: () => {
            const email = refInputEmail.current?.getValue();
            const otp = refInputOTP.current?.getValue();

            setPageStatus(PAGE_STATUS.VERYFYING_OTP);
            AuthApiHelper.verifyOTP({ email, otp })
                .then(res => {
                    onRecieveVerification(res?.data);
                })
                .catch(e => {
                    setErrorText(e.description);
                })
                .finally(() => {
                    clearOTP();
                });
        },

        onPressFacebook: async () => {
            try {
                const { token } = await FacebookSDK.getToken?.();
                AppNavigator.showLoading();
                const res = await AuthApiHelper.verifyFBToken({ facebookToken: token });
                onRecieveVerification(res?.data);
            } catch (e) {
                setErrorText(e.description);
            } finally {
                AppNavigator.hideLoading();
            }
        },
    };
};

export default useAuthEmailVerify;
