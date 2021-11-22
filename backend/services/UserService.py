from flask_pymongo import pymongo
from configurations.DatabaseConfig import DatabaseConfig
from pymongo import ReturnDocument


class UserService:
    def getUser_info(db, id):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            result = user_collection.find_one(filter={'id': id})
            return result
        except Exception as ex:
            print("Exception in UserService getUser_info function:", ex)
            raise Exception from ex

    def update_teacher_info(db, teacher_id, name, phone, email, gender, age, level, subject):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            user_collection.find_one_and_update(filter={'id': teacher_id},
                                                update={'$set': {
                                                    'name': name,
                                                    'phone': phone,
                                                    'email': email,
                                                    'gender': gender,
                                                    'age': age,
                                                    'level': level,
                                                    'subject': subject}},
                                                return_document=ReturnDocument.AFTER,
                                                upsert=False)
        except Exception as ex:
            print("Exception in UserService update_teacher_info function:", ex)
            raise Exception from ex

    def update_student_info(db, student_id, name, phone, email, gender, age):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            user_collection.find_one_and_update(filter={'id': student_id},
                                                update={'$set': {
                                                    'name': name,
                                                    'phone': phone,
                                                    'email': email,
                                                    'gender': gender,
                                                    'age': age}},
                                                return_document=ReturnDocument.AFTER,
                                                upsert=False)
        except Exception as ex:
            print("Exception in UserService update_student_info function:", ex)
            raise Exception from ex

    def change_avatar(db, id, avatar):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            user_collection.find_one_and_update(filter={'id': id},
                                                update={'$set': {
                                                    'avatar': avatar}},
                                                return_document=ReturnDocument.AFTER,
                                                upsert=False)
        except Exception as ex:
            print("Exception in UserService change_avatar function:", ex)
            raise Exception from ex

    def update_embedding(db, id, embedding):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            user_collection.find_one_and_update(filter={'id': id},
                                                update={'$set': {
                                                    'embedding': embedding}},
                                                return_document=ReturnDocument.AFTER,
                                                upsert=False)
        except Exception as ex:
            print("Exception in UserService update_embedding function:", ex)
            raise Exception from ex

    
