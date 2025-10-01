#!/bin/bash

# Exit on any error
set -e
LANG=C

err_report() {
    echo "ERROR updating, please fix errors and rerun $0"
}

trap 'err_report $LINENO' ERR

pushd () {
    command pushd "$@" > /dev/null
}

popd () {
    command popd "$@" > /dev/null
}

# IMI repositories base URL
imisshroot="ssh://git@gitlab.ajuntament.bcn:2201/dti/aixonoesunjoc/"

# Change to $imihttpsroot if SSH is not working
imireporoot="$imisshroot"

# Check that the current directory is NOT this repo directory (see README.md)
if [[ -d .git ]] ; then
    echo "ERROR: Please, symlink this script from the parent folder and execute it. See README.md for more details"
    exit 1
fi

# Check if all IMI repos are cloned
for i in api spa ; do
    if [[ ! -d "$i" ]] ; then
        echo "WARNING: Repo '${i}' not found, cloning and checking out 'main' branch"
        git clone "${imireporoot}${i}.git"
        pushd ${i}
        git checkout main
        popd
    fi

    # Uncomment and adapt this to do a relocation of all locally cloned IMI repos
	relocationroot="$imisshroot"
	pushd "${i}"
	git remote set-url origin "${relocationroot}${i}.git"
	git config http.sslVerify false
	popd
done

# Pull latest version for every repo
for i in devtools api spa; do
    if [[ ! -d  "$i" ]] ; then
        echo "WARNING: directory ${i} not found! Did you clone the repo? Check previous script output"
    else
        pushd "${i}"
	      echo "Updating ${i}"
        git -c http.sslVerify=false pull
        popd
    fi
done

# Show working branches
for i in devtools api spa ; do
	pushd "${i}"
	printf "Repo:%-20s branch:%-8s (commit_id:%s, date:%s)\n"  "${i}" "$(git rev-parse --abbrev-ref HEAD)" "$(git rev-parse HEAD)" "$(git log -1 --format=%cd)"
	popd
done

# Link helper scripts / docker-compose files
toolsdir="devtools"
for i in docker-compose.yml docker-compose.coverage-test.yml docker-compose.production-test.yml swagger-update.sh Makefile; do
    if [[ ! -L "${i}" ]] ; then
        echo "Linking ${toolsdir}/${i}"
        ln -s "${toolsdir}/${i}" .
    fi
done

echo "Finished without errors."
