<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class VideoProcessingUpdated implements ShouldBroadcastNow
{
    use Dispatchable;

    public function __construct(
        public int $videoId,
        public string $step,
        public string $status,
        public ?string $videoUrl = null,
    ) {}

    /**
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [new Channel("video.{$this->videoId}")];
    }
}
