#!/bin/bash

##  Install
# sudo apt install netcat

jqcmd="docker run --rm -i imega/jq:1.6"

help () {
  echo -e "Script para automatizar la descarga del fichero swagger.json"
  echo -e "\e[38;5;82m Parámetros:"
  echo -e "\e[91m      -> sfile:   \e[0m fichero JSON destino"
  echo -e "\e[91m      -> surl:    \e[0m url de descarga del manifiesto"
  echo -e "\e[38;5;82m Ejemplo:"
  echo -e "\e[91m ./swagger-update.sh sfile="frontend/swagger.json" surl="http://localhost:8080/swagger.json" \e[0m"
}


for ARGUMENT in "$@"
do
    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)

    case "$KEY" in
            sfile)   sfile=${VALUE} ;;
            surl)    surl=${VALUE} ;;
            -h)      help ; exit 0;;
            *)       help ; exit 0;;
    esac
done


function write_swagger_json_file() {
    swagger_filename=$1
    swagger_download_uri=$2

    if [[ ! -f "${swagger_filename}" ]]; then
      echo -e "\e[93mAviso: \e[0m No existe fichero o directorio: $swagger_filename "
      touch $swagger_filename
    fi

    current_version=$(cat $swagger_filename | $jqcmd -r .info.version)
    if [ -z "$current_version" ]
      then
        current_version="0.0.0"
    fi

    echo -e "\e[93mInfo:\e[0m   La version vieja de API es: \e[93m '$current_version' \e[0m"

    if [[ ! ${current_version} =~ ^[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,3}$ ]]; then
      echo -e "\e[91m Error: la versión actual de la API no tiene el formato x.y.z  👻 \e[0m"
      exit 1
    fi

    new_version=$(echo ${current_version} | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')
    output=$(curl -s $swagger_download_uri | $jqcmd ".info.version=\"$new_version\"" )
    
    if [ -z "$output" ]
      then
        echo -e "\e[91mError: \e[0m No se ha generado un fichero JSON correcto, verifique que su servidor esta corriendo.💩 \e[0m"
        echo -e "\e[91mVerifique:\e[0m $swagger_download_uri"
      else
        echo -e "\e[92mExito: \e[0m La versión nueva de API es: \e[92m '$new_version'\e[0m"
        echo -e "\e[92mExito: \e[0m Descargando nueva versión desde $swagger_download_uri ..."
        echo ${output} | $jqcmd '.' > $swagger_filename
        echo -e "\e[92m 🚀 Finalizado con éxito 🥳 \e[0m"
    fi

}


# MAIN
write_swagger_json_file $sfile $surl