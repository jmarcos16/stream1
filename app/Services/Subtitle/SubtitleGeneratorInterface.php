<?php

declare(strict_types=1);

namespace App\Services\Subtitle;

interface SubtitleGeneratorInterface
{
    /**
     * @param  string  $audioFilePath  Absolute path to the audio file.
     * @param  string  $outputJsonPath  Absolute path where the word-level timestamps JSON should be saved.
     * @return list<array{word: string, start: float, end: float}>
     */
    public function generate(string $audioFilePath, string $outputJsonPath): array;
}
