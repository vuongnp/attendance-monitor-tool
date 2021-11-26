from flask_pymongo import pymongo
from configurations.DatabaseConfig import DatabaseConfig
from pymongo import ReturnDocument


class StudentService:
    def getStudent_home(db, username):
        try:
            # db = client.get_database(DatabaseConfig.DATABASE)
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            student = user_collection.find_one(filter={'username': username})
            list_ids = student['classes']
            list_require_ids = student['require_classes']
            classes = []
            require_classes = []
            for id in list_ids:
                one_class = class_collection.find_one(filter={'id': id})
                one_teacher = user_collection.find_one(filter={'id': one_class['teacher']})
                one_object = {
                    'id': id,
                    'name': one_class['name'],
                    'description': one_class['description'],
                    'schedule': one_class['schedule'],
                    'type': one_class['type'],
                    'duration': one_class['duration'],
                    'teacher': one_teacher['name'],
                    'code': one_class['code'],
                    'mode': one_class['mode'],
                    'is_learning': one_class['is_learning'],
                    'start_time': one_class['start_time'],
                    'students': one_class['students']
                }
                classes.append(one_object)
            for id in list_require_ids:
                one_class = class_collection.find_one(filter={'id': id})
                one_teacher = user_collection.find_one(filter={'id': one_class['teacher']})
                one_object = {
                    'id': id,
                    'name': one_class['name'],
                    'description': one_class['description'],
                    'schedule': one_class['schedule'],
                    'type': one_class['type'],
                    'duration': one_class['duration'],
                    'teacher': one_teacher['name'],
                    'code': one_class['code'],
                    'mode': one_class['mode'],
                    'is_learning': one_class['is_learning'],
                    'start_time': one_class['start_time'],
                    'students': one_class['students']
                }
                require_classes.append(one_object)
            result = {'student': student, 'classes': classes, 'require_classes': require_classes}
            return result
        except Exception as ex:
            print("Exception in StudentService getStudent_home function:", ex)
            raise Exception from ex

    def get_classroom(db, id):
        try:
            # db = client.get_database(DatabaseConfig.DATABASE)
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            classroom = class_collection.find_one(filter={'id': id})
            teacher = user_collection.find_one(filter={'id': classroom['teacher']})
            result = {
                'id': id,
                'name': classroom['name'],
                'description': classroom['description'],
                'schedule': classroom['schedule'],
                'type': classroom['type'],
                'duration': classroom['duration'],
                'teacher': teacher['name'],
                'students': classroom['students'],
                'teacher_id': classroom['teacher'],
                'is_learning': classroom['is_learning'],
                'mode': classroom['mode'],
                'start_time': classroom['start_time'],
                'time_to_late': classroom['time_to_late'],
                'time_to_fault_monitor': classroom['time_to_fault_monitor']
            }
            return result
        except Exception as ex:
            print("Exception in StudentService get_classroom function:", ex)
            raise Exception from ex

    def join_classroom(db, student_id, code):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            # add student to classroom
            classroom = class_collection.find_one(filter={'code': code})
            if classroom:
                list_student_ids = classroom['students']
                if list_student_ids:
                    list_student_ids = list_student_ids+ [student_id]
                else:
                    list_student_ids = [student_id]
                list_student_ids = set(list_student_ids)
                class_collection.find_one_and_update(filter={'code': code},
                                                            update={
                                                                '$set': {'students': list_student_ids}},
                                                            return_document=ReturnDocument.AFTER,
                                                            upsert=False)
                # add classroom to student
                student = user_collection.find_one(filter={'id': student_id})
                list_class_ids = student['classes']
                if list_class_ids:
                    list_class_ids = list_class_ids + [classroom['id']]
                else:
                    list_class_ids = [classroom['id']]
                list_class_ids = set(list_class_ids)
                user_collection.find_one_and_update(filter={'id': student_id},
                                                            update={
                                                                '$set': {'classes': list_class_ids}},
                                                            return_document=ReturnDocument.AFTER,
                                                            upsert=False)
                return True
            else:
                return False
        except Exception as ex:
            print("Exception in StudentService join_classroom function:", ex)
            raise Exception from ex

    def out_classroom(db, student_id, class_id):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            # delete student from classroom
            classroom = class_collection.find_one(filter={'id': class_id})
            list_student_ids = classroom['students']
            list_student_ids.remove(student_id)
            class_collection.find_one_and_update(filter={'id': class_id},
                                                         update={
                                                             '$set': {'students': list_student_ids}},
                                                         return_document=ReturnDocument.AFTER,
                                                         upsert=False)
            # delete classroom from student
            student = user_collection.find_one(filter={'id': student_id})
            list_class_ids = student['classes']
            list_class_ids.remove(class_id)
            user_collection.find_one_and_update(filter={'id': student_id},
                                                         update={
                                                             '$set': {'classes': list_class_ids}},
                                                         return_document=ReturnDocument.AFTER,
                                                         upsert=False)
        except Exception as ex:
            print("Exception in StudentService out_classroom function:", ex)
            raise Exception from ex

    def check_code_classroom(db, code):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            classroom = class_collection.find_one(filter={'code': code})
            if classroom:
                return {'found': True, 'class_id': classroom['id']}
            else:
                return {'found': False}
            
        except Exception as ex:
            print("Exception in StudentService check_code_classroom function:", ex)
            raise Exception from ex

    def require_classroom(db, noti_id, class_id, student_id, timestamp):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            noti_collection = pymongo.collection.Collection(
                db, DatabaseConfig.NOTIFICATION_COLLECTION)

            student = user_collection.find_one(filter={'id': student_id})
            list_class_joined = student['classes']
            if class_id not in list_class_joined:
                list_class_ids = student['require_classes']
                if class_id not in list_class_ids:
                    if list_class_ids:
                        list_class_ids = list_class_ids + [class_id]
                    else:
                        list_class_ids = [class_id]
                    
                    user_collection.find_one_and_update(filter={'id': student_id},
                                                                        update={
                                                                            '$set': {'require_classes': list_class_ids}},
                                                                        return_document=ReturnDocument.AFTER,
                                                                        upsert=False)
                    noti_collection.insert_one({
                            'id': noti_id,
                            'class_id': class_id,
                            'timestamp': timestamp,
                            'type': 0,
                            'message': {
                                'student_id': student_id,
                                'student_username': student['username'],
                                'student_name': student['name'],
                                'student_phone': student['phone'],
                                'student_email': student['email'],
                                'student_age': student['age'],
                                'text': 'student want to join classroom'
                            },
                            'is_waiting': 1
                    })
                    return True
                else:
                    return False
            else:
                return False
        except Exception as ex:
            print("Exception in StudentService require_classroom function:", ex)
            raise Exception from ex

    def update_learning_student(db, class_id, student_id):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            classroom = class_collection.find_one(filter={'id': class_id})
            list_student_ids = classroom['learning_students']
            if list_student_ids:
                list_student_ids = list_student_ids+ [student_id]
            else:
                list_student_ids = [student_id]
            class_collection.find_one_and_update(filter={'id': class_id},
                                                            update={
                                                                '$set': {'learning_students': list_student_ids}},
                                                            return_document=ReturnDocument.AFTER,
                                                            upsert=False)
            
        except Exception as ex:
            print("Exception in StudentService update_learning_student function:", ex)
            raise Exception from ex

    def add_late_fault(db, idF, idN, student_id, class_id, time_late, timestamp):
        try:
            fault_collection = pymongo.collection.Collection(
                db, DatabaseConfig.FAULT_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            noti_collection = pymongo.collection.Collection(
                db, DatabaseConfig.NOTIFICATION_COLLECTION)

            fault_collection.insert_one({
                'id': idF,
                'class_id': class_id,
                'student_id': student_id,
                'type': 0,
                'time_late': time_late,
                'description': 'fault attendance late'
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
            #save log
            noti_collection.insert_one({
                            'id': idN,
                            'class_id': class_id,
                            'timestamp': timestamp,
                            'type': 1,
                            'message': {
                                'student_id': student_id,
                                'student_username': student['username'],
                                'student_name': student['name'],
                                'time_late': time_late,
                                'text': 'student join classroom late'
                            },
                            'is_waiting': 0
                    })
        except Exception as ex:
            print("Exception in StudentService addLateFault function:", ex)
            raise Exception from ex

    def add_notification_monitor(db, class_id, student_id, student_name, student_username, timestamp, list_imgs, idN):
        try:
            noti_collection = pymongo.collection.Collection(
                db, DatabaseConfig.NOTIFICATION_COLLECTION)
            noti_collection.insert_one({
                            'id': idN,
                            'class_id': class_id,
                            'timestamp': timestamp,
                            'type': 2,
                            'message': {
                                'student_id': student_id,
                                'student_username': student_username,
                                'student_name': student_name,
                                'imgs': list_imgs,
                                'text': 'student distraction'
                            },
                            'is_waiting': 1
                    })
        except Exception as ex:
            print("Exception in StudentService addLateFault function:", ex)
            raise Exception from ex

    def update_stay_in_student(db, class_id, student_id):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            classroom = class_collection.find_one(filter={'id': class_id})
            list_student_ids = classroom['stayin_students']
            if list_student_ids:
                list_student_ids = list_student_ids+ [student_id]
            else:
                list_student_ids = [student_id]
            class_collection.find_one_and_update(filter={'id': class_id},
                                                            update={
                                                                '$set': {'stayin_students': list_student_ids}},
                                                            return_document=ReturnDocument.AFTER,
                                                            upsert=False)
            
        except Exception as ex:
            print("Exception in StudentService update_stay_in_student function:", ex)
            raise Exception from ex
    
