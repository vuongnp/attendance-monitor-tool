
class GetParameter:

    @staticmethod
    def check_and_get(data_dict, para):
        try:
            if para in data_dict:
                result = data_dict[para]
                if len(result)==0:
                    return None
                return result
            else:
                return None
        except Exception as ex:
            print(ex)
            return None