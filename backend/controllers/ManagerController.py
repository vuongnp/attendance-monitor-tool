from services.ManagerService import ManagerService
from configurations.AppConfig import AppConfig
from tools.CheckParameter import CheckParameter

class ManagerController:
    def getAdminHome_handling(db):
        try:
            data = ManagerService.get_admin_home_data(db)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {
                              'classes': data['classes']
                      }
                      }
            return result

        except Exception as ex:
            print("Exception in ManagerController getAdminHome_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result
    
    def getUsers_handling(db):
        try:
            data = ManagerService.get_users_data(db)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {
                              'teachers': data['teachers'],
                              'students': data['students']
                      }
                      }
            return result

        except Exception as ex:
            print("Exception in ManagerController getUsers_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def deleteUser_handling(db, id):
        try:
            ManagerService.delete_user(db, id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result

        except Exception as ex:
            print("Exception in ManagerController deleteUser_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def deleteClass_handling(db, id):
        try:
            ManagerService.delete_class(db, id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result

        except Exception as ex:
            print("Exception in ManagerController deleteClass_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def getAdminStatistic_handling(db):
        try:
            class_stat = ManagerService.get_class_statistic(db)
            fault_stat = ManagerService.get_fault_statistic(db)
            top_class_fault = ManagerService.get_top_class_fault_statistic(db)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {
                              'class_stat': class_stat,
                              'fault_stat': fault_stat,
                              'top_class_fault': top_class_fault
                      }
                      }
            return result

        except Exception as ex:
            print("Exception in ManagerController getAdminStatistic_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def getSettingMode_handling(db):
        try:
            type1 = ManagerService.get_setting(db, type='Lý thuyết')
            type2 = ManagerService.get_setting(db, type='Bài tập')
            type3 = ManagerService.get_setting(db, type='Lớp thi')
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {
                              'type1': {
                                  'mode': type1['mode'],
                                  'time_to_late': type1['time_to_late'],
                                  'time_to_fault_monitor': type1['time_to_fault_monitor']
                              },
                              'type2': {
                                  'mode': type2['mode'],
                                  'time_to_late': type2['time_to_late'],
                                  'time_to_fault_monitor': type2['time_to_fault_monitor']
                              },
                              'type3': {
                                  'mode': type3['mode'],
                                  'time_to_late': type3['time_to_late'],
                                  'time_to_fault_monitor': type3['time_to_fault_monitor']
                              }
                        }
                      }
            return result

        except Exception as ex:
            print("Exception in ManagerController getSettingMode_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def updateSettingMode_handling(db, type1, type2, type3):
        try:
            mode1 = type1['mode']
            mode2 = type2['mode']
            mode3 = type3['mode']
            time_to_late1 = type1['time_to_late']
            time_to_late2 = type2['time_to_late']
            time_to_late3 = type3['time_to_late']
            time_to_fault_monitor1 = type1['time_to_fault_monitor']
            time_to_fault_monitor2 = type2['time_to_fault_monitor']
            time_to_fault_monitor3 = type3['time_to_fault_monitor']

            if time_to_late1 == '' or time_to_late2 == '' or time_to_late3 == '' or time_to_fault_monitor1 == '' or time_to_fault_monitor2 == '' or time_to_fault_monitor3 == '':
                return CheckParameter.get_result_for_miss_parameter()
            ManagerService.update_setting(db, mode1, time_to_late1, time_to_fault_monitor1,type='Lý thuyết')
            ManagerService.update_setting(db, mode2, time_to_late2, time_to_fault_monitor2,type='Bài tập')
            ManagerService.update_setting(db, mode3, time_to_late3, time_to_fault_monitor3,type='Lớp thi')
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result

        except Exception as ex:
            print("Exception in ManagerController updateSettingMode_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result
