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
from controllers.ManagerController import ManagerController
from dotenv import load_dotenv
import onnxruntime as nxrun
from flask_socketio import SocketIO, emit, join_room
import base64

load_dotenv()
cloudinary.config(cloud_name = os.getenv('CLOUD_NAME'), api_key=os.getenv('API_KEY'), 
    api_secret=os.getenv('API_SECRET'))

# retinaface = nxrun.InferenceSession("models/face-detect-retinaface.onnx")
# retina_inname = [input.name for input in retinaface.get_inputs()]
ort_session_detect = nxrun.InferenceSession("models/face-detect-RFB.onnx")
detect_inname = ort_session_detect.get_inputs()[0].name
vectorize = nxrun.InferenceSession("models/mobilefacenet_vgg2.onnx")
vectorize_inname = [input.name for input in vectorize.get_inputs()]

app = Flask(__name__)
app.secret_key = 'vuongnp'
db = Connection.get_database()
# CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# socketio = SocketIO(app)
socketio = SocketIO(app,cors_allowed_origins="*")
# Set CORS options on app configuration
CORS(app, resources={ r'/*': {'origins': [
    'http://localhost:3000', '*'  # React
      # React
  ]}}, supports_credentials=True)
###################################################################################################################################


@app.route("/", methods=['GET'])
def index():
    return "<h1>Welcome!!</h1>"

@socketio.on('connect')
def connected():
    print('Connected')

@socketio.on('disconnect')
def disconnected():
    print('Disconnected')

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
        # if result['code'] == '1000':
        #     session.clear()
        #     session['user_id'] = result['data']['id']
        #     if result['data']['role'] == 0:
        #         session['teacher'] = True
        #         session['teacher_username'] = result['data']['username']
        #         session['teacher_id'] = result['data']['id']
        #         # return redirect(url_for('teacher_home'))
        #     elif result['data']['role'] == 1:
        #         session['student'] = True
        #         session['student_username'] = result['data']['username']
        #         session['student_id'] = result['data']['id']
                # return redirect(url_for('student_home'))
        # else:
        return result

@app.route("/auth/changepassword", methods=['POST'])
def changepassword():
    # if 'user_id' not in session:
    #     return redirect(url_for('index')) 
    # user_id = session['user_id']
    query_params = request.json
    user_id = GetParameter.check_and_get(query_params, 'user_id')
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
        query_params = request.json
        id = GetParameter.check_and_get(query_params, 'id')
        name = GetParameter.check_and_get(query_params, 'name')
        description = GetParameter.check_and_get(query_params, 'description')
        schedule = GetParameter.check_and_get(query_params, 'schedule')
        type = GetParameter.check_and_get(query_params, 'type')
        duration = GetParameter.check_and_get(query_params, 'duration')
        result = TeacherController.updateClassroom_handling(
            db, id, name, description, schedule, type, duration)
        return result


@app.route("/teacher/deleteclass", methods=['POST'])
def deleteclass():
    query_params = request.json
    id = GetParameter.check_and_get(query_params, 'id')
    username = GetParameter.check_and_get(query_params, 'username')
    result = TeacherController.deleteClassroom_handling(db, id, username)
    return result

@app.route("/teacher/getclass/<class_id>")
def getclass(class_id):
    result = TeacherController.getClassroom_handling(db, class_id)
    return result

@app.route("/teacher/getstudent/<student_id>")
def getstudent(student_id):
    # if 'teacher' not in session:
    #     # session['error_login'] = "Please login first!"
    #     return redirect(url_for('login'))
    result = TeacherController.getStudent_handling(db, student_id)
    return result

@app.route("/teacher/deletestudent", methods=['POST'])
def deletestudent():
    # if 'teacher' not in session:
    #     # session['error_login'] = "Please login first!"
    #     return redirect(url_for('index'))
    query_params = request.json
    id_student = GetParameter.check_and_get(query_params, 'id_student')
    id_class = GetParameter.check_and_get(query_params, 'id_class')
    result = TeacherController.deleteStudent_handling(db, id_student, id_class)
    return result

@app.route("/teacher/selectmode", methods=['POST'])
def selectmode():
    query_params = request.json
    id_class = GetParameter.check_and_get(query_params, 'id_class')
    mode = GetParameter.check_and_get(query_params, 'mode')
    result = TeacherController.selectClassMode_handling(db, id_class, mode)
    return result

@app.route("/teacher/startlearning", methods=['POST'])
def startlearning():
    query_params = request.json
    class_id = query_params['class_id']
    start_time = query_params['start_time']
    time_to_late = query_params['time_to_late']
    time_to_fault_monitor = query_params['time_to_fault_monitor']
    # result = TeacherController.toggleStartFinish_handling(db, id_class)
    result = TeacherController.startLearning_handling(db, class_id, start_time, time_to_late, time_to_fault_monitor)
    return result

@app.route("/teacher/finishlearning", methods=['POST'])
def finishlearning():
    query_params = request.json
    class_id = query_params['class_id']
    result = TeacherController.stopLearning_handling(db, class_id)
    # result = TeacherController.toggleStartFinish_handling(db, id_class)
    return result

@app.route("/teacher/getStudentNotLearned", methods=['POST'])
def getStudentNotLearned():
    query_params = request.json
    class_id = query_params['class_id']
    result = TeacherController.getStudentNotLearned_handling(db, class_id)
    return result

@app.route("/teacher/getNotification/<class_id>")
def getNotification(class_id):
    result = TeacherController.getNotification_handling(db, class_id)
    # result = TeacherController.toggleStartFinish_handling(db, id_class)
    return result

@app.route("/teacher/refuseNotification", methods=['POST'])
def refuseJoinClass():
    data = request.json
    notification_id = data["notification_id"]
    result = TeacherController.refuseNotification_handling(db, notification_id)
    return result

@app.route("/teacher/acceptJoinClass", methods=['POST'])
def acceptJoinClass():
    data = request.json
    class_id = data["class_id"]
    student_id = data["student_id"]
    notification_id = data["notification_id"]
    result = TeacherController.acceptJoinClass_handling(db, class_id, student_id, notification_id)
    return result

@app.route("/teacher/acceptFaultMonitor", methods=['POST'])
def acceptFaultMonitor():
    data = request.json
    class_id = data["class_id"]
    student_id = data["student_id"]
    notification_id = data["notification_id"]
    result = TeacherController.acceptFaultMonitor_handling(db, class_id, student_id, notification_id)
    return result

@app.route("/teacher/saveFaultsNotLearn", methods=['POST'])
def saveFaultsNotLearn():
    data = request.json
    class_id = data["class_id"]
    result = TeacherController.saveFaultsNotLearn_handling(db, class_id)
    return result

@app.route("/teacher_statistic/<teacher_id>")
def teacher_statistic(teacher_id):
    result = TeacherController.getTeacherStatistic(db, teacher_id)
    return result

@app.route("/teacher/saveFaultsStayin", methods=['POST'])
def saveFaultsStayin():
    data = request.json
    class_id = data["class_id"]
    result = TeacherController.saveFaultsStayIn_handling(db, class_id)
    return result

# @app.route("/teacher/refuseReportAttendance", methods=['POST'])
@socketio.on('refuse_attendance')
def refuse_attendance(message):
    data = message['data']
    student_id = data["student_id"]
    notification_id = data["notification_id"]
    TeacherController.refuseReportAttendance_handling(db, notification_id)
    emit("attendance_refused", to=student_id)

# @app.route("/teacher/acceptReportAttendance", methods=['POST'])
@socketio.on('accept_attendance')
def accept_attendance(message):
    data = message['data']
    class_id = data["class_id"]
    student_id = data["student_id"]
    time_late = data["time_late"]
    time_to_late = data["time_to_late"]
    notification_id = data["notification_id"]
    TeacherController.acceptReportAttendance_handling(db, class_id, student_id, time_late, time_to_late, notification_id)
    emit("attendance_accepted", to=student_id)

@socketio.on('joinClassroom')
def joinClassroom(classId):
    print('teacher joinClassroom '+classId)
    join_room(classId)

# @socketio.on("report_attendance")
# def reportAttendance(message):
#     data = message['data']
#     class_id = data['class_id']
#     emit("report_attendance_from_student", {'data':data}, to=class_id)

@socketio.on("class_stopped_learn")
def class_stopped_learn(message):
    data = message['data']
    for item in data:
        emit("lession_closed", to=item['id'])

@socketio.on("check_student_stay_in")
def check_student_stay_in(message):
    data = message['data']
    class_id = data['class_id']
    students = data['students']
    TeacherController.checkStudentStayIn_handling(db, class_id)
    for student in students:
        emit("are_you_stay_in", to=student['id'])


####################################################### Student ############################################################

@socketio.on('student_join')
def student_join(student_id):
    print("socket session student", student_id)
    join_room(student_id)


@app.route("/student_home_data/<username>")
def student_home_data(username):
    result = StudentController.getStudent_home_handling(db, username)
    return result

@app.route("/student/getinfoclass/<class_id>")
def getinfoclass(class_id):
    result = StudentController.getClassJoined_handling(db, class_id)
    return result

@app.route("/student/joinclass", methods=['POST'])
def joinclass():
    query_params = request.json
    code = GetParameter.check_and_get(query_params, 'code')
    student_id = GetParameter.check_and_get(query_params, 'student_id')
    result = StudentController.joinClass_handling(db, student_id, code)
    return result

@app.route("/student/updategpu", methods=['POST'])
def updategpu():
    data = request.json
    student_id = data['student_id']
    gpu = data['gpu']
    result = StudentController.updateGPU_handling(db, student_id, gpu)
    return result

@app.route("/student/outclass", methods=['POST'])
def outclass():
    query_params = request.json
    student_id = GetParameter.check_and_get(query_params, 'student_id')
    class_id = GetParameter.check_and_get(query_params, 'class_id')
    result = StudentController.outClass_handling(db, student_id, class_id)
    return result

# @app.route("/student/reportAttendance", methods=['POST'])
# def reportAttendance():
@socketio.on("report_attendance")
def reportAttendance(message):
    data = message['data']
    class_id = data['class_id']
    student_id = data['student_id']
    student_name = data['student_name']
    student_username = data['student_username']
    student_avt = data['student_avt']
    timestamp = data['timestamp']
    time_late = data['time_late']
    time_to_late = data['time_to_late']
    imgs = data['imgs']
    list_imgs = []
    for one_item in imgs:
        imgstring = one_item['imgstring']
        tstamp = one_item['timestamp']
        imgdata = base64.b64decode(imgstring)
        filename = './upload_imgs/'+str(class_id)+"_"+str(student_id)+"_"+str(tstamp)+".jpg"
        with open(filename, 'wb') as f:
            f.write(imgdata)
            f.close()
        upload_result = cloudinary.uploader.upload(filename)
        url_uploaded = upload_result['url']
        list_imgs.append(url_uploaded)
    StudentController.reportAttendance_handling(db, class_id, student_id, student_name, student_username, student_avt, time_late, time_to_late, timestamp, list_imgs)
    emit("report_attendance_from_student", to=class_id)

@app.route("/student/iStayIn", methods=['POST'])
def iStayIn():
    data = request.json
    class_id = data['class_id']
    student_id = data['student_id']
    result = StudentController.iStayIn_handling(db, class_id, student_id)
    return result

@socketio.on('check_code')
def check_code(data):
    print(data)
    code = data["code"]
    student_id = data["student_id"]
    result = StudentController.check_code_handling(db, code)
    if result['code'] == '1000':
        class_id = result["data"]
        emit('code_found',{'class_id':class_id}, to=student_id)
    else:
        emit('code_not_found', to=student_id)

@socketio.on('require_join')
def require_join(message):
    print(message)
    data = message['data']
    class_id = data['class_id']
    student_id = data['student_id']
    timestamp = data['timestamp']
    result = StudentController.require_join_handling(db, class_id, student_id, timestamp)
    if result:
        emit('student_need_join', to=class_id)

@socketio.on('attendanced_late')
def attendanced_late(message):
    data = message['data']
    time_late = data['time_late']
    student_id = data['student_id']
    class_id = data['class_id']
    timestamp = data['timestamp']
    StudentController.attendance_fault_handling(db, student_id, class_id, time_late, timestamp)

@socketio.on('attendanced_ontime')
def attendanced_ontime(message):
    data = message['data']
    student_id = data['student_id']
    class_id = data['class_id']
    StudentController.attendance_ontime_handling(db, student_id, class_id)

# @socketio.on('refuse_attendance')
# def refuse_attendance(message):
#     student_id = message['data']
#     emit("attendance_refused", to=student_id)

# @socketio.on('accept_attenance')
# def accept_attendance(message):
#     student_id = message['data']
#     emit("attendance_accepted", to=student_id)

@socketio.on("posible_fault_monitor")
def posible_fault_monitor(message):
    data = message['data']
    class_id = data['class_id']
    student_id = data['student_id']
    student_name = data['student_name']
    student_username = data['student_username']
    student_avt = data['student_avt']
    timestamp = data['timestamp']
    imgs = data['imgs']
    list_imgs = []
    for one_item in imgs:
        imgstring = one_item['imgstring']
        tstamp = one_item['timestamp']
        imgdata = base64.b64decode(imgstring)
        filename = './upload_imgs/'+str(class_id)+"_"+str(student_id)+"_"+str(tstamp)+".jpg"
        with open(filename, 'wb') as f:
            f.write(imgdata)
            f.close()
        upload_result = cloudinary.uploader.upload(filename)
        url_uploaded = upload_result['url']
        list_imgs.append({'url': url_uploaded, 'timestamp': tstamp})
    StudentController.notification_monitor_handling(db, class_id, student_id, student_name, student_username, student_avt, timestamp, list_imgs)
    emit("posible_fault_monitor", to=class_id)
        
####################################################### User ##############################################################

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route("/user/userinfo/<user_id>")
def userinfo(user_id):
    # if 'user_id' not in session:
    #     return redirect(url_for('index'))
    result = UserController.getUserInfo_handling(db, user_id)
    return result

@app.route("/user/updateuserinfo", methods=['POST'])
def updateuserinfo():
    query_params = request.json
    student_id = GetParameter.check_and_get(query_params, 'student_id')
    teacher_id = GetParameter.check_and_get(query_params, 'teacher_id')
    name = GetParameter.check_and_get(query_params, 'name')
    phone = GetParameter.check_and_get(query_params, 'phone')
    email = GetParameter.check_and_get(query_params, 'email')
    gender = GetParameter.check_and_get(query_params, 'gender')
    age = GetParameter.check_and_get(query_params, 'age')
    if student_id:     
        result = UserController.updateStudentInfo_handling(db, student_id, name, phone, email, gender, age)
        return result
    else:
        level = GetParameter.check_and_get(query_params, 'level')
        subject = GetParameter.check_and_get(query_params, 'subject')    
        result = UserController.updateTeacherInfo_handling(db, teacher_id, name, phone, email, gender, age, level, subject)
        return result
    
@app.route("/user/changeteacheravt", methods=['POST'])
@cross_origin()
def changeteacheravt():
    upload_result = None
    # if request.method == 'POST':
    img_to_upload = request.files['file']
    print(img_to_upload)
    # app.logger.info('%s file_to_upload', file_to_upload)
    # img_to_upload = request.form["file"]
    user_id = request.form["teacher_id"]
    if img_to_upload:
        upload_result = cloudinary.uploader.upload(img_to_upload)
        avatar = upload_result['url']
        result = UserController.changeAvatar_handling(db, user_id, avatar)
        return result

@app.route("/user/changestudentavt", methods=['POST'])
@cross_origin()
def changestudentavt():
    upload_result = None
    # if request.method == 'POST':
    img_to_upload = request.files['file']
    user_id = request.form["student_id"]
    if img_to_upload:
        upload_result = cloudinary.uploader.upload(img_to_upload)
        avatar = upload_result['url']
        result = UserController.changeAvatar_handling(db, user_id, avatar)
        if result["code"]=="1000":
            result = UserController.updateEmbedding_handing(db, user_id, ort_session_detect, detect_inname, vectorize, vectorize_inname, avatar)
            # result = UserController.updateEmbedding_handing(db, user_id, retinaface, retina_inname, vectorize, vectorize_inname, avatar)
            return result
        return result

################################################ ADMIN #########################################################

@app.route("/admin_home_data")
def admin_home_data():
    result = ManagerController.getAdminHome_handling(db)
    return result

@app.route("/admin_get_users")
def admin_get_users():
    result = ManagerController.getUsers_handling(db)
    return result

@app.route("/admin/deleteuser", methods=['POST'])
def deleteuser():
    data = request.json
    id = data['id']
    result = ManagerController.deleteUser_handling(db, id)
    return result

@app.route("/admin/deleteclass", methods=['POST'])
def deleteclassadmin():
    data = request.json
    id = data['id']
    result = ManagerController.deleteClass_handling(db, id)
    return result

@app.route("/admin_statistic")
def admin_statistic():
    result = ManagerController.getAdminStatistic_handling(db)
    return result

@app.route("/admin/get_setting_mode")
def get_setting_mode():
    result = ManagerController.getSettingMode_handling(db)
    return result

@app.route("/admin/update_setting_mode", methods=['POST'])
def update_setting_mode():
    data = request.json
    type1 = data['type1']
    type2 = data['type2']
    type3 = data['type3']

    result = ManagerController.updateSettingMode_handling(db, type1, type2, type3)
    return result

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    # app.run(threaded=True, port=5000)
    socketio.run(app=app,debug=True,port=5000)
    # socketio.run(app)
