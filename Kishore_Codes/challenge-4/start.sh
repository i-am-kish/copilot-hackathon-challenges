#!/bin/bash

# Pre-compute CRC32 table
declare -a crc32_table
for i in {0..255}; do
    crc=$i
    for _ in {0..7}; do
        if (( crc & 1 )); then
            crc=$(( (crc >> 1) ^ 0xEDB88320 ))
        else
            crc=$(( crc >> 1 ))
        fi
    done
    crc32_table[$i]=$crc
done

function get_crc32_checksum {
    local file_path="$1"
    if [[ ! -f "$file_path" ]]; then
        echo "File not found: $file_path"
        return 1
    fi

    local crc32=0xFFFFFFFF
    # Create Perl array string for the CRC32 table
    local perl_table="["
    for i in {0..255}; do
        perl_table+="${crc32_table[$i]},"
    done
    perl_table="${perl_table%,}]"

    crc32=$(perl -e '
        my $crc = '$crc32';
        my @table = @{'$perl_table'};
        while (read(STDIN, $buffer, 4096)) {
            foreach my $byte (split //, $buffer) {
                $crc = (($crc >> 8) & 0xFFFFFFFF) ^ $table[($crc ^ ord($byte)) & 0xFF];
            }
        }
        print $crc;
    ' < "$file_path")

    crc32=$(( crc32 ^ 0xFFFFFFFF ))
    printf "%08X\n" $crc32
}

# Example Usage
file_path="./azure-overview.png"

echo "Calculating CRC32 checksum for file: $file_path"

if [[ -f "$file_path" ]]; then
    checksum=$(get_crc32_checksum "$file_path")
    echo "CRC32 checksum: $checksum"
    sleep 5
else
    echo "File Not Found: $file_path"
fi