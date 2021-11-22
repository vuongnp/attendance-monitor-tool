from flask_pymongo import pymongo
from configurations.DatabaseConfig import DatabaseConfig
from pymongo import ReturnDocument


class AuthService:
    def login(db, username, password):
        try:
            # db = client.get_database(DatabaseConfig.DATABASE)
            auth_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            result = auth_collection.find_one(filter={'username': username})
            return result
        except Exception as ex:
            print("Exception in AuthService login function", ex)
            raise Exception from ex

    def find_account_by_username(db, username):
        try:
            # db = client.get_database(DatabaseConfig.DATABASE)
            auth_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            result = auth_collection.find_one(filter={'username': username})
            return result
        except Exception as ex:
            print("Exception in AuthService.find_account_by_username", ex)
            raise Exception from ex

    def find_account_by_id(db, id):
        try:
            # db = client.get_database(DatabaseConfig.DATABASE)
            auth_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            result = auth_collection.find_one(filter={'id': id})
            return result
        except Exception as ex:
            print("Exception in AuthService.find_account_by_id", ex)
            raise Exception from ex

    def signup_teacher(db, id, username, password, name, phone, email, gender, age, subject, level):
        try:
            # db = client.get_database(DatabaseConfig.DATABASE)
            auth_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            auth_collection.insert_one({
                'id': id,
                'phone': phone,
                'username': username,
                'password': password,
                'name': name,
                'email': email,
                'role': 0,
                'gender': gender,
                'age': age,
                'subject': subject,
                'level': level,
                'classes': [],
                'avatar': ''
            })
        except Exception as ex:
            print("Exception in AuthService.signup_teacher", ex)
            raise Exception from ex

    def signup_student(db, id, username, password, name, phone, email, gender, age):
        try:
            # now = TimeTool.get_current_time_in_str()
            # db = client.get_database(DatabaseConfig.DATABASE)
            auth_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            auth_collection.insert_one({
                'id': id,
                'phone': phone,
                'username': username,
                'password': password,
                'name': name,
                'email': email,
                'role': 1,
                'gender': gender,
                'age': age,
                'classes': [],
                'require_classes': [],
                'avatar': '',
                'embedding': [],
                'faults': {}
            })
        except Exception as ex:
            print("Exception in AuthService.signup_student", ex)
            raise Exception from ex

    def update_password(db, id, password):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            user_collection.find_one_and_update(filter={'id': id},
                                                update={'$set': {
                                                    'password': password}},
                                                return_document=ReturnDocument.AFTER,
                                                upsert=False)
        except Exception as ex:
            print("Exception in AuthService update_password function", ex)
            raise Exception from ex
