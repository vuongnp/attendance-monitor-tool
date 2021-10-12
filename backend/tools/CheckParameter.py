from configurations.AppConfig import AppConfig

class CheckParameter:

    @staticmethod
    def check_phone_number(phone_number):
        if len(phone_number)!=10: 
            return False
        if phone_number[0]!='0':
            return False
        for i in range(1,10):
            if phone_number[i]>'9' or phone_number[i]<'0':
                return False
        return True

    @staticmethod
    def get_result_for_miss_parameter():
        result = {'code': '1002', 'message': AppConfig.RESPONSE_CODE[1002]}
        return result

    @staticmethod
    def get_result_for_invalid_value_parameter():
        result = {'code': '1004', 'message': AppConfig.RESPONSE_CODE[1004]}
        return result

    @staticmethod
    def check_user_name(username):
        if len(username)<6 or len(username)>30:
            return False
        return True