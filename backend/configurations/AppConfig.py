class AppConfig:
    RESPONSE_CODE = {
        1000: "OK",
        9993: 'Too many faces in image',
        9994: 'Face not found',
        9995: 'User is not validated',
        9996: 'User existed',
        9997: 'Method is invalid',
        9998: 'Incorrect password',
        1001: 'Can not connect to DB',
        1002: 'Parameter is not enough',
        1003: 'Parameter type is invalid',
        1004: 'Parameter value is invalid',
        1005: 'Account not found',
        1009: 'Not access',
        1013: 'Class name exists',
        1014: 'Phone number exists',
        1015: 'Username exists',
        1017: 'Missing parameter in update account status handling',
        1020: 'Change password fails because old password is not true'
    }