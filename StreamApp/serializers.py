from rest_framework import serializers
from .models import *

class VideoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Upload_Videos
        fields = ['m3u8_url', 'm3u8_json', 'created_on']