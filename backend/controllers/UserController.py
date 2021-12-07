from services.UserService import UserService
from tools.CheckParameter import CheckParameter
from tools.RandomTool import RandomTool
from configurations.AppConfig import AppConfig
from utils.Detect import Detect
from utils.Vectorize import Vectorize
import cv2
import numpy as np
from urllib.request import urlopen


class UserController:
    def getUserInfo_handling(db, user_id):
        try:
            data = UserService.getUser_info(db, user_id)
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
                if data['role'] == 0:
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
                            'avatar': data['avatar'],
                            'level': data['level'],
                            'subject': data['subject']
                        }
                    }
                    return result
                else:
                    len_classes = None
                    if data['classes']:
                        len_classes=len(data['classes'])
                    else:
                        len_classes=0
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
                            'classes': len_classes,
                            'avatar': data['avatar'],
                            'embedding': data['embedding']
                        }
                    }
                    return result
        except Exception as ex:
            print("Exception in UserController getUserInfo_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def updateStudentInfo_handling(db, student_id, name, phone, email, gender, age):
        try:
            if name is None or phone is None:
                return CheckParameter.get_result_for_miss_parameter()
            if email is None:
                email = ''
            if age is None:
                age = ''
            # phone number is wrong format
            if not CheckParameter.check_phone_number(phone):
                return CheckParameter.get_result_for_invalid_value_parameter()

            UserService.update_student_info(
                    db, student_id, name, phone, email, gender, age)
            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in UserController updateStudentInfo_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def updateTeacherInfo_handling(db, teacher_id, name, phone, email, gender, age, level, subject):
        try:
            if name is None or phone is None:
                return CheckParameter.get_result_for_miss_parameter()
            if email is None:
                email = ''
            if age is None:
                age = ''
            if level is None:
                level = ''
            if subject is None:
                subject = ''
            # phone number is wrong format
            if not CheckParameter.check_phone_number(phone):
                return CheckParameter.get_result_for_invalid_value_parameter()

            UserService.update_teacher_info(
                    db, teacher_id, name, phone, email, gender, age, level, subject)
            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in UserController updateTeacherInfo_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    # def changeAvatar_handling(db, user_id, avatar, retinaface, retina_inname, vectorize, vectorize_inname, image, role):
    #     try:
    #         if role=="0":
    #             UserService.change_teacher_avatar(db, user_id, avatar)
    #         else:
    #             # print('image', image)
    #             filestr = image.read()
    #             # print("filestr", filestr)
    #             npimg = np.fromstring(filestr, np.uint8)
    #             # npimg = np.fromfile(image, np.uint8)
    #             # print("npimg", npimg)
    #             img_raw = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    #             dets = Detect.get_bbox(retinaface, retina_inname, img_raw)
    #             # print("Boxs: ",dets)
    #             # face not found
    #             if len(dets)==0:
    #                 result = {'code': '9994', 'message': AppConfig.RESPONSE_CODE[9994],
    #                   'data': {}
    #                   }
    #                 return result
    #             # too many faces
    #             elif len(dets)>1:
    #                 result = {'code': '9993', 'message': AppConfig.RESPONSE_CODE[9993],
    #                   'data': {}
    #                   }
    #                 return result
    #             # one face
    #             for b in dets:
    #                 b = list(map(int, b))
    #                 # print(b)
    #                 b[0] = int(b[0])
    #                 b[1] = int(b[1])
    #                 b[2] = int(b[2])
    #                 b[3] = int(b[3])
    #                 crop_img = img_raw[(int(b[1])):(int(b[3])), (int(b[0])):(int(b[2]))]
    #                 crop_img = Vectorize.precess_img_vectorize(crop_img)
    #                 embedding = Vectorize.get_vectorize(vectorize, vectorize_inname, crop_img)
    #                 upload_result = cloudinary.uploader.upload(image)
    #                 avatar = upload_result['url']
    #                 UserService.change_student_avatar(db, user_id, avatar, str(list(embedding)))
    #                 # print("Embedding: ",list(embedding))
    #         result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
    #                   'data': {}
    #                   }
    #         return result
    #     except Exception as ex:
    #         print("Exception in UserController changeAvatar_handling", ex)
    #         result = {
    #             'code': '1001',
    #             'message': AppConfig.RESPONSE_CODE[1001]
    #         }
    #         return result

    def changeAvatar_handling(db, id, avatar):
        try:
            UserService.change_avatar(db, id, avatar)
            result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                      'data': {}
                      }
            return result
        except Exception as ex:
            print("Exception in UserController changeAvatar_handling", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    def updateEmbedding_handing(db, id, ort_session_detect, input_name, vectorize, vectorize_inname, avatar):
        try:
            req = urlopen(avatar)
            npimg = np.asarray(bytearray(req.read()), dtype=np.uint8)
            # filestr = image.read()
            # print("filestr", filestr)
            # npimg = np.fromstring(filestr, np.uint8)
            # npimg = np.fromfile(image, np.uint8)
            # print("npimg", npimg)
            img_raw = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
            image = Detect.process_img_detect(img_raw)
            confidences, boxes = ort_session_detect.run(None, {input_name: image})
            scores = confidences[0][:,1]
            boxes = boxes[0]
            dets = Detect.nms(img_raw.shape[1], img_raw.shape[0], scores, boxes)
            # print('dets', dets)
            # dets = Detect.get_bbox(retinaface, retina_inname, img_raw)
            # print("Boxs: ",dets)
            # face not found
            if len(dets) <1:
                result = {'code': '9994', 'message': AppConfig.RESPONSE_CODE[9994],
                      'data': {}
                      }
                return result
            # too many faces
            elif len(dets) > 1:
                result = {'code': '9993', 'message': AppConfig.RESPONSE_CODE[9993],
                      'data': {}
                      }
                return result
            # one face
            else:
                b = dets[0][1]
                b = list(map(int, b))
                # print(b)
                b[0] = int(b[0])
                b[1] = int(b[1])
                b[2] = int(b[2])
                b[3] = int(b[3])
                crop_img = img_raw[(int(b[1])):(int(b[3])), (int(b[0])):(int(b[2]))]
                crop_img = Vectorize.precess_img_vectorize(crop_img)
                embedding = Vectorize.get_vectorize(vectorize, vectorize_inname, crop_img)
                str_embedding = [float(i) for i in list(embedding)]
                # UserService.update_embedding(db, id, (list(embedding)))
                UserService.update_embedding(db, id, str_embedding)
                # print("Embedding: ",list(embedding))
                result = {'code': '1000', 'message': AppConfig.RESPONSE_CODE[1000],
                        'data': {}
                        }
                return result
        except Exception as ex:
            print("Exception in UserController updateEmbedding_handing", ex)
            result = {
                'code': '1001',
                'message': AppConfig.RESPONSE_CODE[1001]
            }
            return result

    
