import torch
import numpy as np
import cv2
from .layers.prior_box import PriorBox
from .utils.nms.py_cpu_nms import py_cpu_nms
from .config.config import cfg_mnet as cfg
from .utils.box_utils import decode, decode_landm

device = torch.device("cpu")

class Detect:
    def get_bbox(retinaface, inname, img_raw, top_k=5000, keep_top_k=750, confidence_threshold=0.3, nms_threshold=0.4):
        
        img = np.float32(img_raw)
        # testing scale
        target_size = 640
        # max_size = 2150
        im_shape = img.shape
        resize = target_size/torch.Tensor([im_shape[1],im_shape[0],im_shape[1],im_shape[0]])
        img = cv2.resize(img, (target_size, target_size))

        im_height, im_width, _ = img.shape
        scale = torch.Tensor([img.shape[1], img.shape[0], img.shape[1], img.shape[0]])
        img -= (104, 117, 123)
        img = img.transpose(2, 0, 1)
        img = np.expand_dims(img, axis=0)

        loc, conf, landms = retinaface.run(None, {inname[0]: img})

        loc=torch.Tensor(loc)
        conf=torch.Tensor(conf)
        priorbox = PriorBox(cfg, image_size=(im_height, im_width))
        priors = priorbox.forward()
        priors = priors.to(device)
        prior_data = priors.data
        boxes = decode(loc.data.squeeze(0), prior_data, cfg['variance'])
        boxes = boxes * scale / resize
        boxes = boxes.cpu().numpy()
        scores = conf.squeeze(0).data.cpu().numpy()[:, 1]
        scale1 = torch.Tensor([img.shape[3], img.shape[2], img.shape[3], img.shape[2],img.shape[3], img.shape[2], img.shape[3], img.shape[2],img.shape[3], img.shape[2]])
        scale1 = scale1.to(device)

        # ignore low scores
        inds = np.where(scores > confidence_threshold)[0]
        boxes = boxes[inds]
        scores = scores[inds]

        # keep top-K before NMS
        order = scores.argsort()[::-1][:top_k]
        boxes = boxes[order]
        scores = scores[order]

        # do NMS
        dets = np.hstack((boxes, scores[:, np.newaxis])).astype(np.float32, copy=False)
        keep = py_cpu_nms(dets, nms_threshold)
        dets = dets[keep, :]

        # keep top-K faster NMS
        dets = dets[:keep_top_k, :]
        return dets