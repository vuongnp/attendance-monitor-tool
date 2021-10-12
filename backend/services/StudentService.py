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
            classes = []
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
                    'students': one_class['students']
                }
                classes.append(one_object)
            result = {'student': student, 'classes': classes}
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
                'students': classroom['students']
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
            list_student_ids = classroom['students']
            if list_student_ids:
                list_student_ids = list_student_ids+ [student_id]
            else:
                list_student_ids = [student_id]
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
            user_collection.find_one_and_update(filter={'id': student_id},
                                                         update={
                                                             '$set': {'classes': list_class_ids}},
                                                         return_document=ReturnDocument.AFTER,
                                                         upsert=False)
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