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
                'mode': 0,
                'is_learning': 0,
                'students': [],
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
                one_object = {
                    'id': id_student,
                    'phone': one_student['phone'],
                    'username': one_student['username'],
                    'name': one_student['name'],
                    'email': one_student['email'],
                    'gender': one_student['gender'],
                    'age': one_student['age'],
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
