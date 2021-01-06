from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render
from .form import UploadFileForm
from django.core.files.storage import FileSystemStorage
from .models import *
from .hls import *
import datetime
import calendar;
import time;
import m3u8
import uuid 

# rest frame work
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes
from rest_framework import viewsets
# serilizer file
from .serializers import *

# rest api 
# Mobile end API to get converted video path and each video json format of converted files m3u8
class VideoStreamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Upload_Videos.objects.all()
    serializer_class = VideoSerializer
    

# Create your views here.
def index(request):
    return render(request, 'shaka-ui.html')

def live(request):
    return render(request, 'livestream.html')

def liveVideo(request):
    return render(request, 'video-js.html')

# View for web to get all converted video
def hlsApi(request):
    if request.method == 'GET':
        convertedFile = Upload_Videos.objects.filter(is_converted = True)
        if convertedFile:
            data = []
            for i in convertedFile:
                fileName = str(i.m3u8_url)
                data.append(fileName)
            dic = {"status":"SUCCESS", "Message":"Data Sent", "data" : data}
            return JsonResponse(dic)

# View for single video file m3u8
def streamApi(request):
    streamVideos = Upload_Videos.objects.all()
    for i in streamVideos:
        videoName = i.m3u8_url
        data = {
            'file': videoName
        }
    dic = {"status":"SUCCESS", "Message":"Data Sent", "data" : data}
    return JsonResponse(dic)


def uploadVideo(request):
    if request.method == 'POST':
        file = request.FILES['myfile']
        if file:
            newFileName = str(calendar.timegm(time.gmtime()))+file.name
            print('newFileName ::::::::', newFileName)
            fs = FileSystemStorage()
            filename = fs.save(newFileName, file)
            uploaded_file_url = fs.url(filename)
            print('uploaded_file_url ::::::::', uploaded_file_url)
            # converting video into hls m3u8 file
            main(newFileName)
            # converting into json
            videoFile = 'http://192.168.1.156:8000/statics/streamOutput/'+newFileName.split('.')[0]+'.m3u8'
            print('video file converted ::::::::', videoFile)
            m3u8_obj = m3u8.load(videoFile)
            jsonFile = m3u8_obj.data
            print('json ::::::::', jsonFile)
            # saving into data base
            upload = Upload_Videos()
            upload.upload_file = newFileName
            upload.m3u8_url = videoFile
            upload.m3u8_json = jsonFile
            upload.is_saved = True
            upload.is_converted = True
            upload.created_on = int(datetime.datetime.now().timestamp())
            upload.save()
            return HttpResponse('Video Uploaded Successfully.')
    else:
        form = UploadFileForm()
    return render(request, 'upload.html', {'form': form})

