from flask_pymongo import pymongo
from configurations.DatabaseConfig import DatabaseConfig
from pymongo import ReturnDocument


class ManagerService:
    def get_admin_home_data(db):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            list_classes = class_collection.find()
            classes = []
            for one_class in list_classes:
                one_teacher = user_collection.find_one(
                    filter={'id': one_class['teacher']})
                one_object = {
                    'id': one_class['id'],
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
            result = {'classes': classes}
            return result
        except Exception as ex:
            print("Exception in ManagerService get_admin_home_data function", ex)
            raise Exception from ex

    def get_users_data(db):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            list_users = user_collection.find()
            teachers = []
            students = []
            for user in list_users:
                if user['role'] == 0:
                    one_object = {
                        'id': user['id'],
                        'name': user['name'],
                        'phone': user['phone'],
                        'username': user['username'],
                        'email': user['email'],
                        'gender': user['gender'],
                        'age': user['age'],
                        'subject': user['subject'],
                        'level': user['level'],
                        'role': user['role'],
                        'avatar': user['avatar'],
                        'classes': len(user['classes'])
                    }
                    teachers.append(one_object)
                elif user['role']==1:
                    one_object = {
                        'id': user['id'],
                        'name': user['name'],
                        'phone': user['phone'],
                        'username': user['username'],
                        'email': user['email'],
                        'gender': user['gender'],
                        'age': user['age'],
                        'role': user['role'],
                        'avatar': user['avatar'],
                        'classes': len(user['classes'])
                    }
                    students.append(one_object)
            result = {'teachers': teachers, 'students': students}
            return result
        except Exception as ex:
            print("Exception in ManagerService get_users_data function", ex)
            raise Exception from ex

    def delete_user(db, id):
        try:
            user_collection = pymongo.collection.Collection(
                db, DatabaseConfig.USER_COLLECTION)
            user_collection.delete_one({'id': id})
        except Exception as ex:
            print("Exception in ManagerService delete_user function", ex)
            raise Exception from ex

    def delete_class(db, id):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            class_collection.delete_one({'id': id})
        except Exception as ex:
            print("Exception in ManagerService delete_class function", ex)
            raise Exception from ex

    def get_class_statistic(db):
        try:
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)
            list_classes = class_collection.find()
            count1 = 0  # ly thuyet
            count2 = 0  # bai tap
            count3 = 0  # lop thi
            for one_class in list_classes:
                if one_class['type'] == 'Lý thuyết':
                    count1 += 1
                elif one_class['type'] == 'Bài tập':
                    count2 += 1
                else:
                    count3 += 1
            labels = ['Lý thuyết', 'Bài tập', 'Lớp thi']
            stats = [count1, count2, count3]
            result = {'labels': labels, 'stats': stats}
            return result
        except Exception as ex:
            print("Exception in ManagerService get_class_statistic function", ex)
            raise Exception from ex

    def get_fault_statistic(db):
        try:
            fault_collection = pymongo.collection.Collection(
                db, DatabaseConfig.FAULT_COLLECTION)
            list_faults = fault_collection.find()
            count1 = 0  # Đi muộn
            count2 = 0  # Không học
            count3 = 0  # Mất tập trung
            for one_fault in list_faults:
                if one_fault['type'] == 0:
                    count1 += 1
                elif one_fault['type'] == 1:
                    count2 += 1
                else:
                    count3 += 1
            labels = ['Vào lớp muộn', 'Không tham dự', 'Giám sát']
            stats = [count1, count2, count3]
            result = {'labels': labels, 'stats': stats}
            return result
        except Exception as ex:
            print("Exception in ManagerService get_fault_statistic function", ex)
            raise Exception from ex

    def get_top_class_fault_statistic(db):
        try:
            fault_collection = pymongo.collection.Collection(
                db, DatabaseConfig.FAULT_COLLECTION)
            class_collection = pymongo.collection.Collection(
                db, DatabaseConfig.CLASS_COLLECTION)

            list_faults = fault_collection.find()
            result = {}
            for one_fault in list_faults:
                one_class = class_collection.find_one(
                    filter={'id': one_fault['class_id']})
                if one_class:
                    if one_class['name'] not in result:
                        result[one_class['name']] = 1
                    else:
                        result[one_class['name']] = result[one_class['name']] + 1
            result = sorted(
                result.items(), key=lambda x: x[1], reverse=True)[:10]
            labels = []
            stats = []
            for item in result:
                labels.append(item[0])
                stats.append(item[1])
            res = {'labels': labels, 'stats': stats}
            return res
        except Exception as ex:
            print(
                "Exception in ManagerService get_top_class_fault_statistic function", ex)
            raise Exception from ex

    def get_setting(db, type):
        try:
            setting_collection = pymongo.collection.Collection(
                db, DatabaseConfig.SETTING_COLLECTION)

            result = setting_collection.find_one(filter={'type': type})
            return result
        except Exception as ex:
            print("Exception in ManagerService get_setting function", ex)
            raise Exception from ex

    def update_setting(db, mode, time_to_late, time_to_fault_monitor, type):
        try:
            setting_collection = pymongo.collection.Collection(
                db, DatabaseConfig.SETTING_COLLECTION)

            setting_collection.find_one_and_update(filter={'type': type},
                                                   update={'$set': {
                                                       'mode': mode,
                                                       'time_to_late': time_to_late,
                                                       'time_to_fault_monitor': time_to_fault_monitor
                                                   }},
                                                   return_document=ReturnDocument.AFTER,
                                                   upsert=False)
        except Exception as ex:
            print("Exception in ManagerService update_setting function", ex)
            raise Exception from ex
