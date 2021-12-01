import numpy as np
import cv2

def box_iou(box1, box2):
        # (x1,y1,x2,y2) box1
        x11 = box1[0]
        y11 = box1[1]
        x12 = box1[2]
        y12 = box1[3]
        # (x1,y1,x2,y2) box2
        x21 = box2[0]
        y21 = box2[1]
        x22 = box2[2]
        y22 = box2[3]
        #area1
        area1 = (x12 - x11) * (y12 - y11)
        #area2
        area2 = (x22 - x21) * (y22 - y21)
        #intersection
        x1 = max(x11, x21)
        x2 = min(x12, x22)
        y1 = max(y11, y21)
        y2 = min(y12, y22)
        intersection = (x2 - x1) * (y2 - y1)
        iou = intersection / (area1 + area2 - intersection)
        return iou

class Detect:
    def process_img_detect(orig_image):
        image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (640, 640))
        image_mean = np.array([127, 127, 127])
        image = (image - image_mean) / 128
        image = np.transpose(image, [2, 0, 1])
        image = np.expand_dims(image, axis=0)
        image = image.astype(np.float32)
        return image

    def nms(width,height,scores,boxes,iou_threshold=0.5,conf_threshold=0.4):
        zipped=[]
        for i in range(len(scores)):
            if scores[i]>conf_threshold:
                zipped.append([scores[i],[boxes[i][0], boxes[i][1], boxes[i][2], boxes[i][3]]])
        zipped = sorted(zipped,key=lambda x: x[0], reverse=True)
        # print(zipped)
        selected=[]
        for box in zipped:
            toAdd = True
            for i in range(len(selected)):
                iou = box_iou(box[1],selected[i][1])
                if iou>iou_threshold:
                    toAdd=False
            if toAdd:
                selected.append(box)
        for item in selected:
            item[1][0] = int(item[1][0] * width)
            item[1][1] = int(item[1][1] * height)
            item[1][2] = int(item[1][2] * width)
            item[1][3] = int(item[1][3] * height)
        return selected
        
