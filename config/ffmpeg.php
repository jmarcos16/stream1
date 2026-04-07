<?php

return [
    'vaapi_device' => env('FFMPEG_VAAPI_DEVICE', '/dev/dri/renderD128'),
    'gpu_qp' => (int) env('FFMPEG_GPU_QP', 19),
];
