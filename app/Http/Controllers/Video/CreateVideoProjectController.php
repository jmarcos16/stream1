<?php
declare(strict_types=1);

namespace App\Http\Controllers\Video;

use App\Http\Controllers\Controller;
use Inertia\Response;

final class CreateVideoProjectController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('video-creator-v2-wizard');
    }
}
