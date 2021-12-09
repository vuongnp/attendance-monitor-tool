from services.TeacherService import TeacherService
from tools.CheckParameter import CheckParameter
from tools.RandomTool import RandomTool
from configurations.AppConfig import AppConfig


class TeacherController:
    def getTeacher_home_handling(db, username):
        try:
            data = TeacherService.getTeacher_home(db, username)
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
                        'id': data['teacher']['id'],
                        'name': data['teacher']['name'],
                        'phone': data['teacher']['phone'],
                        'username': data['teacher']['username'],
                        'email': data['teacher']['email'],
                        'gender': data['teacher']['gender'],
                        'age': data['teacher']['age'],
                        'role': data['teacher']['role'],
                        'avatar': data['teacher']['avatar'],
                        'classes': data['classes']
                    }
                }
                return result
        except Exception as ex:
            print("Exception in TeacherController getTeacher_home_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def addClassroom_handling(db, name, description, schedule, type, duration, username):
        try:
            # if name == '' or duration == '':
            #     result = {
            #         'code': '9995',
            #         'message': AppConfig.RESPONSE_CODE[9995],
            #         'data': {}
            #     }
            #     return result
            if name == '' or duration == '' or name is None or duration is None or schedule is None:
                return CheckParameter.get_result_for_miss_parameter()
            if description is None:
                description = ''
            if type is None:
                type = 'Lý thuyết'
            id = RandomTool.get_random_id()
            code = RandomTool.get_classroom_code()
            teacher = TeacherService.addClassroom(
                db, id, name, description, schedule, type, duration, code, username)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {
                          'id': teacher['id'],
                          'name': teacher['name'],
                          'phone': teacher['phone'],
                          'username': teacher['username'],
                          'email': teacher['email'],
                          'gender': teacher['gender'],
                          'age': teacher['age'],
                          'role': teacher['role'],
                          'avatar': teacher['avatar'],
                          'classes': teacher['classes']
                      }
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController addClassroom_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def updateClassroom_handling(db, id, name, description, schedule, type, duration):
        try:
            if name == '' or duration == '':
                result = {
                    'code': '9995',
                    'message': AppConfig.RESPONSE_CODE[9995],
                    'data': {}
                }
                return result
            if name is None or duration is None:
                return CheckParameter.get_result_for_miss_parameter()
            if description is None:
                description = ''
            if schedule is None:
                schedule = ''
            if type is None:
                type = 'Lý thuyết'
            TeacherService.update_classroom_by_id(
                    db, id, name, description, schedule, type, duration)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController updateClassroom_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def deleteClassroom_handling(db, id, username):
        try:
            TeacherService.delete_classroom(db, id, username)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController deleteClassroom_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def getClassroom_handling(db, id):
        try:
            data = TeacherService.get_classroom(db, id)
            result = {
                'code': '1000',
                'message': AppConfig.RESPONSE_CODE[1000],
                'data': {
                        'id': data['classroom']['id'],
                        'name': data['classroom']['name'],
                        'description': data['classroom']['description'],
                        'schedule': data['classroom']['schedule'],
                        'type': data['classroom']['type'],
                        'mode': data['classroom']['mode'],
                        'duration': data['classroom']['duration'],
                        'code': data['classroom']['code'],
                        'is_learning': data['classroom']['is_learning'],
                        'time_to_late': data['classroom']['time_to_late'],
                        'time_to_fault_monitor': data['classroom']['time_to_fault_monitor'],
                        'students': data['students']
                        # 'notifications': data['notifications']
                }
            }
            return result
        except Exception as ex:
            print("Exception in TeacherController getClassroom_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result
    
    def getStudent_handling(db, id):
        try:
            data = TeacherService.get_student(db, id)
            numclasss = None
            numfaults = None
            if data['classes']:
                numclasss = len(data['classes'])
            else:
                numclasss = 0
            if data['faults']:
                numfaults = len(data['faults'])
            else:
                numfaults = 0
            result = {
                'code': '1000',
                'message': AppConfig.RESPONSE_CODE[1000],
                'data': {
                        'id': data['id'],
                        'name': data['name'],
                        'phone': data['phone'],
                        'username': data['username'],
                        'email': data['email'],
                        'gender': data['gender'],
                        'age': data['age'],
                        'role': data['role'],
                        'classes': numfaults,
                        'faults': numclasss,
                        'avatar': data['avatar'],
                }
            }
            return result
        except Exception as ex:
            print("Exception in TeacherController getStudent_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result
    

    def deleteStudent_handling(db, id_student, id_class):
        try:
            TeacherService.delete_student(db, id_student, id_class)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController deleteStudent_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def selectClassMode_handling(db, id, mode):
        try:
            TeacherService.update_classroom_mode(db, id, mode)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController selectClassMode_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def toggleStartFinish_handling(db, id):
        try:
            classroom = TeacherService.update_classroom_status(db, id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {
                            'id': classroom['id'],
                            'name': classroom['name'],
                            'description': classroom['description'],
                            'schedule': classroom['schedule'],
                            'type': classroom['type'],
                            'mode': classroom['mode'],
                            'duration': classroom['duration'],
                            'code': classroom['code'],
                            'is_learning': classroom['is_learning']
                        }
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController toggleStartFinish_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result
    def startLearning_handling(db, class_id, start_time, time_to_late, time_to_fault_monitor):
        try:
            if time_to_late is None or time_to_fault_monitor is None or time_to_fault_monitor=='' or time_to_late=='':
                return CheckParameter.get_result_for_miss_parameter()
            time_to_late = float(time_to_late)
            time_to_fault_monitor= float(time_to_fault_monitor)
            TeacherService.update_classroom_start_learn(db, class_id, start_time, time_to_late, time_to_fault_monitor)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController startLearning_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result
    def stopLearning_handling(db, id):
        try:
            TeacherService.update_classroom_stop_learn(db, id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController stopLearning_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def getNotification_handling(db, class_id):
        try:
            data = TeacherService.get_notification(db, class_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {'notifications': data['notifications']}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController getNotification_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def refuseNotification_handling(db, notification_id):
        try:
            TeacherService.checked_notification(db, notification_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController refuseJoinClass_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def acceptJoinClass_handling(db, class_id, student_id, notification_id):
        try:
            TeacherService.add_student_to_class(db, class_id, student_id)
            TeacherService.checked_notification(db, notification_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController refuseJoinClass_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result
    
    def refuseReportAttendance_handling(db, notification_id):
        try:
            TeacherService.checked_notification(db, notification_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController refuseReportAttendance_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def acceptReportAttendance_handling(db, class_id, student_id, time_late, time_to_late, notification_id):
        try:
            if(int(time_late)>int(time_to_late)):
                idF = RandomTool.get_random_id()
                TeacherService.add_fault_attendance_late(db, class_id, student_id, time_late, idF)          
            TeacherService.checked_notification(db, notification_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController acceptReportAttendance_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def getStudentNotLearned_handling(db, class_id):
        try:
            data = TeacherService.get_students_not_learned(db, class_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': data
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController getStudentLearned_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def acceptFaultMonitor_handling(db, class_id, student_id, notification_id):
        try:
            idF = RandomTool.get_random_id()
            TeacherService.add_fault_monitor(db, class_id, student_id, idF)
            TeacherService.checked_notification(db, notification_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController refuseJoinClass_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def saveFaultsNotLearn_handling(db, class_id):
        try:
            classroom = TeacherService.get_basic_info_class(db, class_id)
            students = classroom['students']
            learning_students = classroom['learning_students']

            for student_id in students:
                if student_id not in learning_students:
                    idF = RandomTool.get_random_id()
                    TeacherService.add_fault_not_learn(db, class_id, student_id, idF)

            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController saveFaultsNotLearn_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def checkStudentStayIn_handling(db, class_id):
        try:
            TeacherService.update_stayin_student(db, class_id)

            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController checkStudentStayIn_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def saveFaultsStayIn_handling(db, class_id):
        try:
            classroom = TeacherService.get_basic_info_class(db, class_id)
            stayin_students = classroom['stayin_students']
            learning_students = classroom['learning_students']

            for student_id in learning_students:
                if student_id not in stayin_students:
                    idF = RandomTool.get_random_id()
                    TeacherService.add_fault_monitor(db, class_id, student_id, idF)

            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in TeacherController saveFaultsStayIn_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def getTeacherStatistic(db, teacher_id):
        try:
            class_stat = TeacherService.get_class_statistic(db,teacher_id)
            top_class_fault = TeacherService.get_top_class_fault_statistic(db,teacher_id)
            result = {'code': '1000',
                      'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {
                              'class_stat': class_stat,
                              'top_class_fault': top_class_fault
                      }
                      }
            return result

        except Exception as ex:
            print("Exception in TeacherController getTeacherStatistic", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result