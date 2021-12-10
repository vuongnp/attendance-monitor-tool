from services.StudentService import StudentService
from tools.CheckParameter import CheckParameter
from tools.RandomTool import RandomTool
from configurations.AppConfig import AppConfig


class StudentController:
    def getStudent_home_handling(db, username):
        try:
            data = StudentService.getStudent_home(db, username)
            if data is None:
                result = {
                    'code': '9995',
                    'message': AppConfig.RESPONSE_CODE[9995],
                    'data': {
                        'id': '',
                        'username': '',
                        'role': '',
                    }
                }
                return result
            else:
                result = {
                    'code': '1000',
                    'message': AppConfig.RESPONSE_CODE[1000],
                    'data': {
                        'id': data['student']['id'],
                        'name': data['student']['name'],
                        'phone': data['student']['phone'],
                        'username': data['student']['username'],
                        'email': data['student']['email'],
                        'gender': data['student']['gender'],
                        'age': data['student']['age'],
                        'role': data['student']['role'],
                        'avatar': data['student']['avatar'],
                        'embedding': data['student']['embedding'],
                        'classes': data['classes'],
                        'require_classes': data['require_classes']                      
                    }
                }
                return result
        except Exception as ex:
            print("Exception in StudentController getStudent_home_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def getClassJoined_handling(db, id):
        try:
            data = StudentService.get_classroom(db, id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {
                            'id': data['id'],
                            'name': data['name'],
                            'description': data['description'],
                            'schedule': data['schedule'],
                            'type': data['type'],
                            'duration': data['duration'],
                            'teacher': data['teacher'],
                            'students': data['students'],
                            'is_learning': data['is_learning'],
                            'teacher_id': data['teacher_id'],
                            'mode': data['mode'],
                            'start_time': data['start_time'],
                            'time_to_late': data['time_to_late'],
                            'time_to_fault_monitor': data['time_to_fault_monitor']
                        }
                      }
            return result
        except Exception as ex:
            print("Exception in StudentController getClassJoined_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def joinClass_handling(db, student_id, code):
        try:
            res = StudentService.join_classroom(db, student_id, code)
            if res:
                result = {'code': '1000',
                        'message': AppConfig.RESPONSE_CODE[1000],
                        'data': {}
                        }
                return result
            else:
                result = {'code': '9999',
                        'message': AppConfig.RESPONSE_CODE[9999],
                        'data': {}
                        }
                return result
        except Exception as ex:
            print("Exception in StudentController joinClass_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def outClass_handling(db, student_id, class_id):
        try:
            StudentService.out_classroom(db, student_id, class_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in StudentController outClass_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result
    
    def check_code_handling(db, code):
        try:
            res = StudentService.check_code_classroom(db, code)
            if res['found']:
                result = {'code': '1000',
                        'message': AppConfig.RESPONSE_CODE[1000],
                        'data': res['class_id']
                        }
                return result
            else:
                result = {'code': '9999',
                        'message': AppConfig.RESPONSE_CODE[9999],
                        'data': {}
                        }
                return result
        except Exception as ex:
            print("Exception in StudentController check_code_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def require_join_handling(db, class_id, student_id, timestamp):
        try:
            noti_id = RandomTool.get_random_id()
            res = StudentService.require_classroom(db, noti_id, class_id, student_id, timestamp)
            if res:
                return True
            else:
                return False
        except Exception as ex:
            print("Exception in StudentController require_join_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def attendance_ontime_handling(db, student_id, class_id):
        try:
            StudentService.update_learning_student(db, class_id, student_id)

            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in StudentController.attendance_ontime_handling", ex)
            result = {'code': '1001', 'message': AppConfig.RESPONSE_CODE[1001]}
            return result

    def reportAttendance_handling(db, class_id, student_id, student_name, student_username, student_avt, time_late, time_to_late, timestamp, list_imgs):
        try:
            print("AAAAAAAa")
            idN = RandomTool.get_random_id()
            StudentService.add_notification_report_attendance(db, class_id, student_id, student_name, student_username, student_avt, time_late, time_to_late, timestamp, list_imgs, idN)

            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in StudentController.reportAttendance_handling", ex)
            result = {'code': '1001', 'message': AppConfig.RESPONSE_CODE[1001]}
            return result

    def attendance_fault_handling(db, student_id, class_id, time_late, timestamp):
        try:
            idF = RandomTool.get_random_id()
            idN = RandomTool.get_random_id()
            StudentService.update_learning_student(db, class_id, student_id)
            StudentService.add_late_fault(db, idF, idN, student_id, class_id, time_late, timestamp)

            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in StudentController.attendance_fault_handling", ex)
            result = {'code': '1001', 'message': AppConfig.RESPONSE_CODE[1001]}
            return result

    def notification_monitor_handling(db, class_id, student_id, student_name, student_username, timestamp, list_imgs):
        try:
            idN = RandomTool.get_random_id()
            StudentService.add_notification_monitor(db, class_id, student_id, student_name, student_username, timestamp, list_imgs, idN)

            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in StudentController.notification_monitor_handling", ex)
            result = {'code': '1001', 'message': AppConfig.RESPONSE_CODE[1001]}
            return result

    def iStayIn_handling(db, class_id, student_id):
        try:
            StudentService.update_stay_in_student(db, class_id, student_id)

            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in StudentController.iStayIn_handling", ex)
            result = {'code': '1001', 'message': AppConfig.RESPONSE_CODE[1001]}
            return result
    
    def updateGPU_handling(db, student_id, gpu):
        try:
            StudentService.update_gpu(db, student_id, gpu)

            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in StudentController.updateGPU_handling", ex)
            result = {'code': '1001', 'message': AppConfig.RESPONSE_CODE[1001]}
            return result