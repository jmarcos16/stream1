<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->text('script');
            $table->string('status')->default('pending');
            $table->string('video_path')->nullable();
            $table->string('audio_path')->nullable();
            $table->float('audio_duration')->nullable();
            $table->string('raw_video_path')->nullable();
            $table->string('srt_path')->nullable();
            // $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
