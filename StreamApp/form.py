from django import forms
from .models import *

class UploadFileForm(forms.ModelForm):
    class Meta:
        model = Upload_Videos
        fields = ('upload_file',)