import numpy as np
import cv2

n, c, h, w = [1, 3, 128, 128]

class Vectorize:
    def precess_img_vectorize(img):
        img = np.float32(img)
        img = cv2.resize(img, (w, h))
        img = img.transpose((2, 0, 1))  # Change data layout from HWC to CHW
        img = np.expand_dims(img, axis=0)
        img = img/255.0
        return img
    def get_vectorize(model, vectorize_inname, crop_img):
        res = model.run(None, {vectorize_inname[0]: crop_img})
        res = res[0].transpose()[0][0]
        res = res.reshape(1,256)[0]
        return res