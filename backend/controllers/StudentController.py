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
                            'students': data['students']
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
            StudentService.join_classroom(db, student_id, code)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
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