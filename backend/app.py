from flask import Flask, jsonify, request, session, redirect, url_for, send_file
from flask_cors import CORS, cross_origin
import pymongo
import os
import json
import cloudinary
import cloudinary.uploader
from bson import json_util, ObjectId
from tools.Connection import Connection
from tools.GetParameter import GetParameter
from controllers.AuthController import AuthController
from controllers.TeacherController import TeacherController
from controllers.StudentController import StudentController
from controllers.UserController import UserController
from dotenv import load_dotenv
import onnxruntime as nxrun

load_dotenv()
cloudinary.config(cloud_name = os.getenv('CLOUD_NAME'), api_key=os.getenv('API_KEY'), 
    api_secret=os.getenv('API_SECRET'))

retinaface = nxrun.InferenceSession("models/face-detect-retinaface.onnx")
retina_inname = [input.name for input in retinaface.get_inputs()]

vectorize = nxrun.InferenceSession("models/mobilefacenet_vgg2.onnx")
vectorize_inname = [input.name for input in vectorize.get_inputs()]

app = Flask(__name__)
app.secret_key = 'vuongnp'
db = Connection.get_database()
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

###################################################################################################################################


@app.route("/", methods=['GET'])
def index():
    return "<h1>Welcome!!</h1>"

########################################################## Auth ####################################################################
@app.route("/signup_teacher", methods=['GET','POST'])
def signup_teacher():
    if request.method == 'POST':
        query_params = request.json
        username = GetParameter.check_and_get(query_params, 'username')
        password = GetParameter.check_and_get(query_params, 'password')
        name = GetParameter.check_and_get(query_params, 'name')
        phone = GetParameter.check_and_get(query_params, 'phone')
        email = GetParameter.check_and_get(query_params, 'email')
        gender = GetParameter.check_and_get(query_params, 'gender')
        age = GetParameter.check_and_get(query_params, 'age')
        subject = GetParameter.check_and_get(query_params, 'subject')
        level = GetParameter.check_and_get(query_params, 'level')
        role = 0
        result = AuthController.signup_handling(
            db, username, password, name, phone, email, gender, age, subject, level, role)
        if result['code']=='1000':
        # return jsonify(result)
            return redirect(url_for('index'))
            # return result
        else:
            return result


@app.route("/signup_student", methods=['GET','POST'])
def signup_student():
    if request.method == 'POST':
        query_params = request.json
        username = GetParameter.check_and_get(query_params, 'username')
        password = GetParameter.check_and_get(query_params, 'password')
        name = GetParameter.check_and_get(query_params, 'name')
        phone = GetParameter.check_and_get(query_params, 'phone')
        email = GetParameter.check_and_get(query_params, 'email')
        gender = GetParameter.check_and_get(query_params, 'gender')
        age = GetParameter.check_and_get(query_params, 'age')
        subject = ''
        level = ''
        role = 1
        result = AuthController.signup_handling(
            db, username, password, name, phone, email, gender, age, subject, level, role)
        if result['code']=='1000':
        # return jsonify(result)
            return redirect(url_for('index'))
            # return result
        else:
            return result


@app.route("/login", methods=['GET','POST'])
def login():
    if request.method == 'POST':
        query_params = request.json
        username = GetParameter.check_and_get(query_params, 'username')
        password = GetParameter.check_and_get(query_params, 'password')
        result = AuthController.login_handling(db, username, password)
        if result['code'] == '1000':
            session.clear()
            session['user_id'] = result['data']['id']
            if result['data']['role'] == 0:
                session['teacher'] = True
                session['teacher_username'] = result['data']['username']
                session['teacher_id'] = result['data']['id']
                # return redirect(url_for('teacher_home'))
            elif result['data']['role'] == 1:
                session['student'] = True
                session['student_username'] = result['data']['username']
                session['student_id'] = result['data']['id']
                # return redirect(url_for('student_home'))
        # else:
        return result

@app.route("/auth/changepassword", methods=['POST'])
def changepassword():
    if 'user_id' not in session:
        return redirect(url_for('index')) 
    user_id = session['user_id']
    query_params = request.json
    oldpassword = GetParameter.check_and_get(query_params, 'oldpassword')
    newpassword = GetParameter.check_and_get(query_params, 'newpassword')
    result = AuthController.change_password_handling(db, user_id, oldpassword, newpassword)
    return result

#################################################### Teacher ##############################################################

@app.route("/teacher_home_data/<username>")
def teacher_home_data(username):
    # if 'teacher' not in session:
    #     # session['error_login'] = "Please login first!"
    #     return redirect(url_for('index'))
    # if request.method == 'POST':
    # query_params = request.json
    # username = GetParameter.check_and_get(query_params, 'username')
    # session.pop('matched_accounts', None)
    # username = session['teacher_username']
    result = TeacherController.getTeacher_home_handling(db, username)
    # result = json.loads(json_util.dumps(result))
    return result


@app.route("/teacher/newclass", methods=['POST'])
def newclass():
    # if 'teacher' not in session:
    #     # session['error_login'] = "Please login first!"
    #     return redirect(url_for('index'))
    # username = session['teacher_username']
    query_params = request.json
    username = GetParameter.check_and_get(query_params, 'username')
    name = GetParameter.check_and_get(query_params, 'name')
    description = GetParameter.check_and_get(query_params, 'description')
    schedule = GetParameter.check_and_get(query_params, 'schedule')
    type = GetParameter.check_and_get(query_params, 'type')
    duration = GetParameter.check_and_get(query_params, 'duration')
    result = TeacherController.addClassroom_handling(
        db, name, description, schedule, type, duration, username)
    # if result['code'] == '1000':
    #     return redirect(url_for('teacher_home'))
    # else:
    return result


@app.route("/teacher/updateclass", methods=['POST', 'GET'])
def updateclass():
    if request.method == 'POST':
        query_params = request.form
        id = GetParameter.check_and_get(query_params, 'id')
        code = GetParameter.check_and_get(query_params, 'code')
        name = GetParameter.check_and_get(query_params, 'name')
        description = GetParameter.check_and_get(query_params, 'description')
        schedule = GetParameter.check_and_get(query_params, 'schedule')
        type = GetParameter.check_and_get(query_params, 'type')
        duration = GetParameter.check_and_get(query_params, 'duration')
        result = TeacherController.updateClassroom_handling(
            db, id, code, name, description, schedule, type, duration)
        if result['code'] == '1000':
            return redirect(url_for('teacher_home'))
        else:
            return result


@app.route("/teacher/deleteclass", methods=['POST'])
def deleteclass():
    # if 'teacher' not in session:
    #     # session['error_login'] = "Please login first!"
    #     return redirect(url_for('index'))
    # username = session['teacher_username']
    query_params = request.json
    id = GetParameter.check_and_get(query_params, 'id')
    username = GetParameter.check_and_get(query_params, 'username')
    result = TeacherController.deleteClassroom_handling(db, id, username)
    return result

@app.route("/teacher/getclass/<class_id>")
def getclass(class_id):
    # if 'teacher' not in session:
    #     # session['error_login'] = "Please login first!"
    #     return redirect(url_for('index'))
    result = TeacherController.getClassroom_handling(db, class_id)
    return result

@app.route("/teacher/getstudent/<student_id>")
def getstudent(student_id):
    if 'teacher' not in session:
        # session['error_login'] = "Please login first!"
        return redirect(url_for('login'))
    result = TeacherController.getStudent_handling(db, student_id)
    return result

@app.route("/teacher/deletestudent", methods=['POST'])
def deletestudent():
    if 'teacher' not in session:
        # session['error_login'] = "Please login first!"
        return redirect(url_for('index'))
    query_params = request.form
    id_student = GetParameter.check_and_get(query_params, 'id_student')
    id_class = GetParameter.check_and_get(query_params, 'id_class')
    result = TeacherController.deleteStudent_handling(db, id_student, id_class)
    return result

@app.route("/teacher/selectmode", methods=['POST'])
def selectmode():
    if 'teacher' not in session:
        # session['error_login'] = "Please login first!"
        return redirect(url_for('index'))
    query_params = request.form
    id_class = GetParameter.check_and_get(query_params, 'id_class')
    mode = GetParameter.check_and_get(query_params, 'mode')
    result = TeacherController.selectClassMode_handling(db, id_class, mode)
    return result

@app.route("/teacher/startlearning", methods=['POST'])
def startlearning():
    # if 'teacher' not in session:
    #     # session['error_login'] = "Please login first!"
    #     return redirect(url_for('index'))
    query_params = request.json
    id_class = GetParameter.check_and_get(query_params, 'id')
    result = TeacherController.toggleStartFinish_handling(db, id_class)
    return result

@app.route("/teacher/finishlearning", methods=['POST'])
def finishlearning():
    if 'teacher' not in session:
        # session['error_login'] = "Please login first!"
        return redirect(url_for('index'))
    query_params = request.form
    id_class = GetParameter.check_and_get(query_params, 'id_class')
    result = TeacherController.toggleStartFinish_handling(db, id_class)
    return result

####################################################### Student ############################################################

@app.route("/student_home", methods=['GET'])
def student_home():
    if 'student' not in session:
        # session['error_login'] = "Please login first!"
        return redirect(url_for('index'))
    # session.pop('matched_accounts', None)
    username = session['student_username']
    result = StudentController.getStudent_home_handling(db, username)
    # result = json.loads(json_util.dumps(result))
    return result

@app.route("/student/getinfoclass/<class_id>")
def getinfoclass(class_id):
    if 'student' not in session:
        # session['error_login'] = "Please login first!"
        return redirect(url_for('index'))
    result = StudentController.getClassJoined_handling(db, class_id)
    return result

@app.route("/student/joinclass", methods=['POST'])
def joinclass():
    if 'student' not in session:
        # session['error_login'] = "Please login first!"
        return redirect(url_for('index'))
    student_id = session['student_id']
    query_params = request.form
    code = GetParameter.check_and_get(query_params, 'code')
    result = StudentController.joinClass_handling(db, student_id, code)
    if result['code'] == '1000':
        return redirect(url_for('student_home'))
    else:
        return result

@app.route("/student/outclass", methods=['POST'])
def outclass():
    if 'student' not in session:
        # session['error_login'] = "Please login first!"
        return redirect(url_for('index'))
    student_id = session['student_id']
    query_params = request.form
    class_id = GetParameter.check_and_get(query_params, 'class_id')
    result = StudentController.outClass_handling(db, student_id, class_id)
    if result['code'] == '1000':
        return redirect(url_for('student_home'))
    else:
        return result

####################################################### User ##############################################################

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route("/user/userinfo/<user_id>")
def userinfo(user_id):
    if 'user_id' not in session:
        return redirect(url_for('index'))
    result = UserController.getUserInfo_handling(db, user_id)
    return result

@app.route("/user/updateuserinfo", methods=['POST'])
def updateuserinfo():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    query_params = request.form
    name = GetParameter.check_and_get(query_params, 'name')
    phone = GetParameter.check_and_get(query_params, 'phone')
    email = GetParameter.check_and_get(query_params, 'email')
    gender = GetParameter.check_and_get(query_params, 'gender')
    age = GetParameter.check_and_get(query_params, 'age')
    if 'student_id' in session:
        student_id = session['student_id']      
        result = UserController.updateStudentInfo_handling(db, student_id, name, phone, email, gender, age)
        return result
    else:
        level = GetParameter.check_and_get(query_params, 'level')
        subject = GetParameter.check_and_get(query_params, 'subject')
        teacher_id = session['teacher_id']      
        result = UserController.updateTeacherInfo_handling(db, teacher_id, name, phone, email, gender, age, level, subject)
        return result
    
@app.route("/user/changeavt", methods=['POST'])
@cross_origin()
def changeavt():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    user_id = session['user_id']
    upload_result = None
    if request.method == 'POST':
        img_to_upload = request.files['file']
        # app.logger.info('%s file_to_upload', file_to_upload)
        if img_to_upload:
            upload_result = cloudinary.uploader.upload(img_to_upload)
            avatar = upload_result['url']
            result = UserController.changeAvatar_handling(db, user_id, avatar)
            if 'student_id' in session:
                result = UserController.updateEmbedding_handing(db, user_id, retinaface, retina_inname, vectorize, vectorize_inname, avatar)
                return result
            return result

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
