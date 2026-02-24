<?php

declare(strict_types=1);

namespace App\Services\Audio;

interface AudioGeneratorInterface
{
    public function generate(string $text, string $outputFilePath): string;
}
