import argparse
import datetime
import sys
import os
import time
import logging

import ffmpeg_streaming

from ffmpeg_streaming import Representation
from ffmpeg_streaming import FFProbe


logging.basicConfig(filename='streaming.log', level=logging.NOTSET, format='[%(asctime)s] %(levelname)s: %(message)s')
start_time = time.time()


def per_to_time_left(percentage):
    if percentage != 0:
        diff_time = time.time() - start_time
        seconds_left = 100 * diff_time / percentage - diff_time
        time_left = str(datetime.timedelta(seconds=int(seconds_left))) + ' left'
    else:
        time_left = 'calculating...'

    return time_left


def transcode_progress(per, ffmpeg):
    # You can update a field in your database or log it to a file
    # You can also create a socket connection and show a progress bar to users
    logging.info(ffmpeg)
    sys.stdout.write("\rTranscoding...(%s%%) %s [%s%s]" % (per, per_to_time_left(per), '#' * per, '-' * (100 - per)))
    sys.stdout.flush()


def main(file):
    # parser = argparse.ArgumentParser()

    # parser.add_argument('-i', '--input', required=True, help='The path to the video file (required).')
    # parser.add_argument('-o', '--output', default=None, help='The output to write files.')
    input_path = './media/'+file
    output_name = file.split('.')
    output_path = './statics/streamOutput/'+output_name[0]+'.m3u8'

    # args = parser.parse_args()

    r_144p  = Representation(width=256, height=144, kilo_bitrate=95)
    r_240p  = Representation(width=426, height=240, kilo_bitrate=150)
    r_360p  = Representation(width=640, height=360, kilo_bitrate=276)
    r_480p  = Representation(width=854, height=480, kilo_bitrate=750)
    r_720p  = Representation(width=1280, height=720, kilo_bitrate=2048)
    r_1080p = Representation(width=1920, height=1080, kilo_bitrate=4096)
    r_2k    = Representation(width=2560, height=1440, kilo_bitrate=6144)
    r_4k    = Representation(width=3840, height=2160, kilo_bitrate=17408)

    (
        ffmpeg_streaming
            .hls(input_path, hls_time=10, hls_allow_cache=1)
            .format('h264')
            .add_rep(r_144p, r_240p, r_360p, r_480p, r_720p, r_1080p, r_2k, r_4k)
            .package(output_path, progress=transcode_progress)
    )

# if __name__ == "__main__":
#      sys.exit(main('newvideo.mp4'))
