#!/bin/bash

set -o errexit
set -o nounset

function declare_variables_in_file(){
  while IFS= read -r line; do
    # Skip comments
    [[ "$line" =~ ^[[:space:]]*# ]] && continue

    # get key and value
    key="${line%%=*}"
    value="${line#*=}"

    # Replace invalid characters in the key with _
    sanitized_key=$(echo "$key" | sed 's/[^a-zA-Z0-9_]/_/g')

    # if sanitized key is valid, declare it as global variable
    if [ -n "$sanitized_key" ]; then
      echo "Declaring '$sanitized_key'"
      declare -g "$sanitized_key"="$value"
    fi
  done < "$1"
}

# Set environment variables from properties files, if they exist
psqnonsecretfile=/k8s/nonsecretconfigmaps/datasource/postgresDs.properties
psqsecretfile=/k8s/secretconfigmaps/datasource/postgresDs.properties
propertiesfile=/etc/sandbox/environment.properties

if [ -f $propertiesfile ]; then
  echo "$propertiesfile found. Executing it and exporting all declarations."
  set -a # export all definitions
  declare_variables_in_file $propertiesfile
  set +a
else
  echo "$propertiesfile not found. Not altering environment variables."
fi


if [ -f $psqnonsecretfile ]; then
  echo "$psqnonsecretfile found. Executing it and exporting all declarations."
  declare_variables_in_file $psqnonsecretfile
  export POSTGRES_USER="${username}"
  export POSTGRES_DB="${sid}"
  export POSTGRES_HOST="${server}"
  export POSTGRES_PORT="${port}"
else
  echo "$psqnonsecretfile not found. Not altering environment variables."
fi

if [ -f $psqsecretfile ]; then
  echo "$psqsecretfile found. Executing it and exporting all declarations."
  declare_variables_in_file $psqsecretfile
  export POSTGRES_PASSWORD="${password}"
else
  echo "$psqsecretfile not found. Not altering environment variables."
fi

export DATABASE_URL="postgis://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

apimanagerurl=/etc/sandbox/apiManagerUrl.properties

if [ -f $apimanagerurl ]; then
  echo "$apimanagerurl found. Executing it and exporting all declarations."
  set -a # export all definitions
  declare_variables_in_file $apimanagerurl
  set +a
else
  echo "$apimanagerurl not found. Not altering environment variables."
fi

# Set mailing environment variables from plain files, if they exist
mailsenderfile=/k8s/secretfilesets/smtpcred/sender
mailusernamefile=/k8s/secretfilesets/smtpcred/username
mailpasswordfile=/k8s/secretfilesets/smtpcred/password

# email sender
if [ -f $mailsenderfile ]; then
  echo "$mailsenderfile found. Exporting sender for mailing."
  DJANGO_DEFAULT_FROM_EMAIL="$(cat $mailsenderfile)"
  export DJANGO_DEFAULT_FROM_EMAIL
  DJANGO_SERVER_EMAIL="$(cat $mailsenderfile)"
  export DJANGO_SERVER_EMAIL
  echo "DJANGO_DEFAULT_FROM_EMAIL='$DJANGO_DEFAULT_FROM_EMAIL'"
else
  echo "$mailsenderfile not found. Not altering DJANGO_DEFAULT_FROM_EMAIL / DJANGO_SERVER_EMAIL environment variables."
fi

# email username
if [ -f $mailusernamefile ]; then
  echo "$mailusernamefile found. Exporting username for mailing."
  DJANGO_EMAIL_HOST_USER=$(cat $mailusernamefile)
  export DJANGO_EMAIL_HOST_USER
else
  echo "$mailusernamefile not found. Not altering DJANGO_EMAIL_HOST_USER environment variable."
fi

# email password
if [ -f $mailpasswordfile ]; then
  echo "$mailpasswordfile found. Exporting password for mailing."
  DJANGO_EMAIL_HOST_PASSWORD=$(cat $mailpasswordfile)
  export DJANGO_EMAIL_HOST_PASSWORD
else
  echo "$mailpasswordfile not found. Not altering DJANGO_EMAIL_HOST_PASSWORD environment variable."
fi

postgres_ready() {
  python <<END
import sys
import psycopg2

try:
    conn = psycopg2.connect(
        dbname="${POSTGRES_DB}",
        user="${POSTGRES_USER}",
        password="${POSTGRES_PASSWORD}",
        host="${POSTGRES_HOST}",
        port="${POSTGRES_PORT}",
        connect_timeout=5,
    )
    conn.close()
except psycopg2.OperationalError:
    sys.exit(-1)
sys.exit(0)

END
}

loop_postgres_ready() {
  until postgres_ready; do
    echo >&2 'Waiting for PostgreSQL to become available...'
    sleep 1
  done
  echo >&2 'PostgreSQL is available'
}

loop_redis_ready() {
  echo >&2 'Waiting for Redis to become available...'
  local host
  local port
  host=$(echo "$REDIS_URL" | sed -e 's,^redis://,,g' -e 's,:.*,,g')
  port=$(echo "$REDIS_URL" | sed -e 's,^.*:,:,g' -e 's,.*:\([0-9]*\).*,\1,g' -e 's,[^0-9],,g')
  echo "Redis host: $host  port: $port"
  while ! nc -z $host $port; do
    sleep 1
  done
  echo >&2 'Redis is available'
}

# Run django migrate script and set dummy table
django_migrate() {
  echo "*** Running migrate"
  python manage.py migrate --noinput || exit 1
}

django_makemessages() {
  echo "Run makemessages"
  python manage.py makemessages -a || exit 1
}

django_compilemessages() {
  echo "Run compilemessages Catalan"
  python manage.py compilemessages -l ca || exit 1
  echo "Run compilemessages French"
  python manage.py compilemessages -l fr || exit 1
  echo "Run compilemessages Spanish"
  python manage.py compilemessages -l es || exit 1
}

django_collectstatic() {
  if ! [ -d /app/static ]; then
    echo "*** Creating /app/static directory"
    mkdir /app/static
  fi
  echo "*** Running collectstatic"
  python manage.py collectstatic --verbosity 3 --noinput
}

redis_flushall() {
  # Flush Redis databases if requested
  if [ "${REDIS_FLUSHALL-no}" = "yes" ]; then
    echo "*** Flush all redis databases"
    local host
    local port
    host=$(echo "$REDIS_URL" | sed -e 's,^redis://,,g' -e 's,:.*,,g')
    port=$(echo "$REDIS_URL" | sed -e 's,^.*:,:,g' -e 's,.*:\([0-9]*\).*,\1,g' -e 's,[^0-9],,g')
    echo "Redis host: $host  port: $port"
    redis-cli -h "$host" -p "$port" FLUSHALL
  fi
}

case "$1" in
uwsgi-api)
  loop_redis_ready
  redis_flushall
  loop_postgres_ready
  django_collectstatic
  set +u
  if [ "$2" != "--skip-django-migrations" ]; then
    if [ "$CELERY_PURGE_QUEUE_ON_POD_START" = "yes" ]; then
      echo "NOTICE: Purging Celery queue"
      celery -A main.celery purge -f
    fi
    django_migrate
  else
    echo "NOTICE: Skipping django migrations (--skip-django-migrations flag is set)"
  fi
  set -u
  django_makemessages
  django_compilemessages
  echo "*** Launching uWSGI application server"
  uwsgi --ini /etc/uwsgi/uwsgi.ini
  ;;

dev-webserver-api)
  loop_redis_ready
  redis_flushall
  loop_postgres_ready
  django_migrate
  django_makemessages
  django_compilemessages
  echo "Run development webserver"
  python manage.py runserver 0.0.0.0:8000
  ;;

django-migrate)
  loop_redis_ready
  loop_postgres_ready
  django_migrate
  ;;

django-check-migrations)
  loop_redis_ready
  loop_postgres_ready
  ;;

celery-worker)
  loop_redis_ready
  django_makemessages
  django_compilemessages
  # common celery argyments
  celeryargs="-A main.celery worker -l INFO -Ofair -n worker@%h"
  set +u
  if [ -n "$CELERY_CONCURRENCY" ]; then
    echo "*** Starting Celery Worker. Using CELERY_CONCURRENCY=${CELERY_CONCURRENCY}"
    celeryargs="$celeryargs --concurrency=${CELERY_CONCURRENCY}"
  else
    echo "*** Starting Celery Worker for default queue. No CELERY_CONCURRENCY set, using default value (equal to number of CPUs)"
  fi
  set -u
  echo "*** invoking 'celery $celeryargs' and sending task to background"
  celery $celeryargs
  ;;

celery-beat)
  loop_redis_ready
  if [ -f celerybeat.pid ]; then
    echo "*** file 'celerybeat.pid' found, deleting it!"
    rm -f './celerybeat.pid'
  fi
  if [ -f celerybeat-schedule ]; then
    echo "*** file 'celerybeat-schedule' found, deleting it!"
    rm celerybeat-schedule
  fi
  celery -A main.celery beat -l INFO
  ;;

*)
  exec "$@"
  ;;
esac
