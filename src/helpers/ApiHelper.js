import Http from '@core/http';

module.exports = {
    requestOTP({ email = '' }) {
        return Http.request({
            method: Http.METHOD.POST,
            data: {
                email,
            },
            path: '/sign-up/post-email',
        });
    },

    verifyOTP({ email = '', otp = '' }) {
        return Http.request({
            method: Http.METHOD.POST,
            data: {
                email,
                otp,
            },
            path: '/sign-up/verify-otp',
        });
    },
};