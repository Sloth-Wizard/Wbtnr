#!/bin/bash

echo "Reading webtoons folder ..."

dbName='ali.foff'

mkdir -p './dist/webtoons'

# Go into the webtoon folder and start scanning
cd webtoons

# Create database if it does not exist
touch $dbName

# Scan directories to get series name
for serie in *; do
    toInjectSerie=''
    # Check if directory
    if [[ -d "$serie" && ! -L "$serie" ]]; then
        toInjectSerie=$(echo "$serie::")

        # Scan directories in the serie directory to get episodes names
        episodes=''
        for episode in $serie/*; do
            # Check if directory
            if [[ -d "$episode" && ! -L "$episode" ]]; then
                # Concat the episodes after one another
                cleanEpisode=$(echo "$episode||" | sed s/"$serie\/"//)

                # Scan the webtoon fragments
                fragments=''
                for fragment in $episode/*; do
                    if [[ $(file -b $fragment) == "JPEG "* ]];
                    then
                        buf=$(echo "$fragment@@" | sed s/"$serie\/"//)
                        fragments+=$(echo "$buf" | sed s/"${cleanEpisode::-2}\/"//)
                    fi
                done

                episodes+="$cleanEpisode${fragments::-2}=="
            fi
        done

        # Remove the 2 last chars
        toInjectSerie+=${episodes::-2}
        
        # Find if the serie exists in the db.foff
        if grep -q "$serie" $dbName
        then
            # Found so check for diffs on that line with the toInjectSerie string we are going to append
            echo "Checking for diffs"

            # Get the line number
            #existingSerieLn=$(grep "$serie" $dbName | cut -f1 -d:)
            #echo $exstingSerieLn
            
            # Get the data line where the serie is found
            exstingSerie=$(grep "$serie" $dbName)

            # Check for diffs between the data to be injected between the existing serie
            diffs=$(diff <(echo "$exstingSerie") <(echo "$toInjectSerie"))
            if [ ! -z "$diffs" ]
            then
                # Found diffs
                sed -i "s/$exstingSerie/$toInjectSerie/" $dbName
                echo "Replacing diffs..."

                # Move the webtoons to their final destination
                mv ./$serie ../dist/webtoons/
            else
                # No diffs so skip the replacement of the data and do nothing
                echo "No diffs found, skipping..."
            fi
        else
            # Not found, create a new line
            echo "$toInjectSerie" >> $dbName
            echo "$serie has been created"

            # Move the webtoons to their final destination
            mv ./$serie ../dist/webtoons/
        fi
    fi
done

# Then we copy the database to the correct place
cp $dbName ../src/ts/data/
