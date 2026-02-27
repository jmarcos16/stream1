<?php

declare(strict_types=1);

namespace App\Services\Audio;

interface AudioGeneratorInterface
{
    /**
     * Generates an audio file from the given text and saves it to the specified output file path.
     * 
     * @param string $text The text to convert to audio.
     * @param string $outputFilePath The file path where the generated audio should be saved.
     * @return string The path to the saved audio file.
     */
    public function generate(string $text, string $outputFilePath): string;
}
