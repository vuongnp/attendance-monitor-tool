from flask_pymongo import pymongo
from configurations.DatabaseConfig import DatabaseConfig
from pymongo import ReturnDocument


class TeacherService:
    def getTeacher_home(db, username):
        try:
            # db = client.get_database(DatabaseConfig.DATABASE)
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            teacher = user_collection.find_one(filter={'username': username})
            list_ids = teacher['classes']
            classes=[]
            for id in list_ids:
                one_class = class_collection.find_one(filter={'id': id})
                one_object = {
                'id': id,
                'name': one_class['name'],
                'description': one_class['description'],
                'schedule': one_class['schedule'],
                'type': one_class['type'],
                'duration': one_class['duration'],
                'teacher': one_class['teacher'],
                'code': one_class['code'],
                'mode': one_class['mode'],
                'is_learning': one_class['is_learning'],
                'students': one_class['students']
                }
                classes.append(one_object)
            result = {'teacher': teacher, 'classes': classes}
            return result
        except Exception as ex:
            print("Exception in TeacherService getTeacher_home function:", ex)
            raise Exception from ex

    def addClassroom(db, id, name, description, schedule, type, duration, code, username):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            teacher = user_collection.find_one(filter={'username': username})
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            one_class = {
                'id': id,
                'name': name,
                'description': description,
                'schedule': schedule,
                'type': type,
                'duration': duration,
                'teacher': teacher['id'],
                'code': code,
                'mode': "0",
                'is_learning': 0,
                'students': [],
                'learning_students':[],
                'start_time': ""
            }
            class_collection.insert_one(one_class)
            # update teacher
            list_classes = teacher['classes']
            if list_classes:
                list_classes = list_classes + [id]
            else:
                list_classes = [id]
            result = user_collection.find_one_and_update(filter={'username': username},
                                                         update={
                                                             '$set': {'classes': list_classes}},
                                                         return_document=ReturnDocument.AFTER,
                                                         upsert=False)
            return result
        except Exception as ex:
            print("Exception in TeacherService addClassroom function:", ex)
            raise Exception from ex

    def update_classroom_by_id(db, id, name, description, schedule, type, duration):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            result = class_collection.find_one_and_update(filter={'id': id},
                                                          update={'$set': {
                                                              'name': name, 'description': description, 'schedule': schedule, 'type': type, 'duration': duration}},
                                                          return_document=ReturnDocument.AFTER,
                                                          upsert=False)
            return result
        except Exception as ex:
            print("Exception in TeacherService updateClassroombyid function:", ex)
            raise Exception from ex

    def update_classroom_by_code(db, code, name, description, schedule, type, duration):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            result = class_collection.find_one_and_update(filter={'code': code},
                                                          update={'$set': {
                                                              'name': name, 'description': description, 'schedule': schedule, 'type': type, 'duration': duration}},
                                                          return_document=ReturnDocument.AFTER,
                                                          upsert=False)
            return result
        except Exception as ex:
            print("Exception in TeacherService updateClassroombycode function:", ex)
            raise Exception from ex

    def delete_classroom(db, id, username):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            teacher = user_collection.find_one(filter={'username': username})
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            class_collection.delete_one(filter={'id': id})
            list_classes = teacher['classes']
            list_classes.remove(id)
            result = user_collection.find_one_and_update(filter={'username': username},
                                                         update={
                                                             '$set': {'classes': list_classes}},
                                                         return_document=ReturnDocument.AFTER,
                                                         upsert=False)
            return result

        except Exception as ex:
            print("Exception in TeacherService deleteClassroom function:", ex)
            raise Exception from ex

    def get_classroom(db, id):
        try:
            # db = client.get_database(DatabaseConfig.DATABASE)
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)

            classroom = class_collection.find_one(filter={'id': id})
            list_ids = classroom['students']
            students=[]
            for id_student in list_ids:
                one_student = user_collection.find_one(filter={'id': id_student})
                number_faults = None
                if id in one_student['faults']:
                    number_faults = len(one_student['faults'][id])
                else:
                    number_faults = 0
                one_object = {
                    'id': id_student,
                    'phone': one_student['phone'],
                    'username': one_student['username'],
                    'name': one_student['name'],
                    'email': one_student['email'],
                    'gender': one_student['gender'],
                    'age': one_student['age'],
                    'faults': number_faults,
                    'avatar': one_student['avatar']
                }
                students.append(one_object)
            result = {'classroom': classroom, 'students': students}
            return result
        except Exception as ex:
            print("Exception in TeacherService getClassroom function:", ex)
            raise Exception from ex

    def get_student(db, id):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            result = user_collection.find_one(filter={'id': id})
            return result
        except Exception as ex:
            print("Exception in TeacherService get_student function:", ex)
            raise Exception from ex

    def delete_student(db, id_student, id_class):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            # remove student from classroom
            classroom = class_collection.find_one(filter={'id': id_class})
            list_student_ids = classroom['students']
            list_student_ids.remove(id_student)
            class_collection.find_one_and_update(filter={'id': id_class},
                                                         update={
                                                             '$set': {'students': list_student_ids}},
                                                         return_document=ReturnDocument.AFTER,
                                                         upsert=False)
            # remove classroom from student
            student = user_collection.find_one(filter={'id': id_student})
            list_class_ids = student['classes']
            list_class_ids.remove(id_class)
            user_collection.find_one_and_update(filter={'id': id_student},
                                                         update={
                                                             '$set': {'classes': list_class_ids}},
                                                         return_document=ReturnDocument.AFTER,
                                                         upsert=False)
        except Exception as ex:
            print("Exception in TeacherService delete_student function:", ex)
            raise Exception from ex
    
    def update_classroom_mode(db, id, mode):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            result = class_collection.find_one_and_update(filter={'id': id},
                                                          update={'$set': {
                                                              'mode': mode}},
                                                          return_document=ReturnDocument.AFTER,
                                                          upsert=False)
            return result
        except Exception as ex:
            print("Exception in TeacherService update_classroom_mode function:", ex)
            raise Exception from ex

    def update_classroom_status(db, id):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            classroom = class_collection.find_one(filter={'id':id})
            status = 0
            if classroom['is_learning']==0:
                status = 1
            else:
                status = 0
            result = class_collection.find_one_and_update(filter={'id': id},
                                                          update={'$set': {
                                                              'is_learning': status}},
                                                          return_document=ReturnDocument.AFTER,
                                                          upsert=False)
            return result
        except Exception as ex:
            print("Exception in TeacherService update_classroom_status function:", ex)
            raise Exception from ex

    def update_classroom_start_learn(db, class_id, start_time, time_to_late, time_to_fault_monitor):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            result = class_collection.find_one_and_update(filter={'id': class_id},
                                                          update={'$set': {
                                                              'is_learning': 1,
                                                              'start_time': start_time,
                                                              'learning_students':[],
                                                              'time_to_late':time_to_late,
                                                              'time_to_fault_monitor':time_to_fault_monitor}},
                                                          return_document=ReturnDocument.AFTER,
                                                          upsert=False)
            return result
        except Exception as ex:
            print("Exception in TeacherService update_classroom_start_learn function:", ex)
            raise Exception from ex

    def update_classroom_stop_learn(db, id):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            result = class_collection.find_one_and_update(filter={'id': id},
                                                          update={'$set': {
                                                              'is_learning': 0}},
                                                          return_document=ReturnDocument.AFTER,
                                                          upsert=False)
            return result
        except Exception as ex:
            print("Exception in TeacherService update_classroom_stop_learn function:", ex)
            raise Exception from ex

    def get_notification(db, class_id):
        try:
            noti_collection = pymongo.collection.Collection(
                db, DatabaseConfig.NOTIFICATION_COLLECTION)
            notisList = noti_collection.find(filter={'class_id': class_id}).sort("timestamp", -1)[:10]
            notifications = []
            for noti in notisList:
                one_object=None
                if noti['type']==0:
                    one_object = {
                        'id': noti['id'],
                        'class_id': noti['class_id'],
                        'student_id': noti['message']['student_id'],
                        'student_username': noti['message']['student_username'],
                        'student_name': noti['message']['student_name'],
                        'student_email': noti['message']['student_email'],
                        'student_phone': noti['message']['student_phone'],
                        'student_age': noti['message']['student_age'],
                        'type': 0,
                        'timestamp': noti['timestamp'],
                        'is_waiting': noti['is_waiting']
                    }
                elif noti['type']==1:
                    one_object = {
                        'id': noti['id'],
                        'class_id': noti['class_id'],
                        'student_id': noti['message']['student_id'],
                        'student_username': noti['message']['student_username'],
                        'student_name': noti['message']['student_name'],
                        'time_late': noti['message']['time_late'],
                        'type': 1,
                        'timestamp': noti['timestamp'],
                        'is_waiting': noti['is_waiting']
                    }
                elif noti['type']==2:
                    one_object = {
                        'id': noti['id'],
                        'class_id': noti['class_id'],
                        'student_id': noti['message']['student_id'],
                        'student_username': noti['message']['student_username'],
                        'student_name': noti['message']['student_name'],
                        'imgs': noti['message']['imgs'],
                        'type': 2,
                        'timestamp': noti['timestamp'],
                        'is_waiting': noti['is_waiting']
                    }
                notifications.append(one_object)
            result = {'notifications': notifications}
            return result
        except Exception as ex:
            print("Exception in TeacherService get_notification function:", ex)
            raise Exception from ex

    def checked_notification(db, notification_id):
        try:
            noti_collection = pymongo.collection.Collection(
                db, DatabaseConfig.NOTIFICATION_COLLECTION)

            noti_collection.find_one_and_update(filter={'id': notification_id},
                                                          update={'$set': {
                                                              'is_waiting': 0}},
                                                          return_document=ReturnDocument.AFTER,
                                                          upsert=False)
            
        except Exception as ex:
            print("Exception in TeacherService checked_notification function:", ex)
            raise Exception from ex

    def add_student_to_class(db, class_id, student_id):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            # add student to classroom
            classroom = class_collection.find_one(filter={'id': class_id})
            list_student_ids = classroom['students']
            if list_student_ids:
                list_student_ids = list_student_ids+ [student_id]
            else:
                list_student_ids = [student_id]
            # list_student_ids = set(list_student_ids)
            class_collection.find_one_and_update(filter={'id': class_id},
                                                            update={
                                                                '$set': {'students': list_student_ids}},
                                                            return_document=ReturnDocument.AFTER,
                                                            upsert=False)
            # add classroom to student
            student = user_collection.find_one(filter={'id': student_id})
            list_class_ids = student['classes']
            list_require_class_ids = student['require_classes']
            list_require_class_ids.remove(class_id)
            if list_class_ids:
                list_class_ids = list_class_ids + [class_id]
            else:
                list_class_ids = [class_id]
            # list_class_ids = set(list_class_ids)
            user_collection.find_one_and_update(filter={'id': student_id},
                                                            update={
                                                                '$set': {
                                                                    'classes': list_class_ids,
                                                                    'require_classes':list_require_class_ids}},
                                                            return_document=ReturnDocument.AFTER,
                                                            upsert=False)
        except Exception as ex:
            print("Exception in TeacherService add_student_to_class function:", ex)
            raise Exception from ex

    def add_fault_monitor(db, class_id, student_id, idF):
        try:
            fault_collection = pymongo.collection.Collection(
                db, DatabaseConfig.FAULT_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)

            fault_collection.insert_one({
                'id': idF,
                'class_id': class_id,
                'student_id': student_id,
                'type': 2
            })
            # add fault to student
            student = user_collection.find_one(filter={'id': student_id})
            dict_class = student['faults']
            if class_id not in dict_class:
                dict_class[class_id] = [idF]
            else:
                dict_class[class_id] = dict_class[class_id] + [idF]
            user_collection.find_one_and_update(filter={'id': student_id},
                                                    update={'$set': {'faults': dict_class}},
                    return_document=ReturnDocument.AFTER,
                    upsert=False)
        except Exception as ex:
            print("Exception in TeacherService add_fault_monitor function:", ex)
            raise Exception from ex

    def get_students_learned(db, class_id):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)

            classroom = class_collection.find_one(filter={'id': class_id})
            students = classroom['students']
            learning_students = classroom['learning_students']
            list_students=[]
            for id in students:
                if id not in learning_students:
                    student = user_collection.find_one(filter={'id': id})
                    one_object={
                        'name': student['name'],
                        'username': student['username']
                    }
                    list_students.append(one_object)
            return list_students
        except Exception as ex:
            print("Exception in TeacherService get_students_learned function:", ex)
            raise Exception from ex
