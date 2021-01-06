from django.db import models

# Create your models here.
class Upload_Videos(models.Model):
    upload_file = models.FileField(upload_to='media/')
    m3u8_url = models.CharField(max_length=100)
    m3u8_json = models.TextField()
    is_saved = models.BooleanField()
    is_converted = models.BooleanField()
    created_on = models.BigIntegerField()