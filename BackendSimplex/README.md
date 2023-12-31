# FastAPI - Guía de Inicio Rápido
**Fecha:** 13 de septiembre de 2023  
**Autores:** Isaac Meléndez Gatgens - Gerald Matarrrita Alvarado - Pablo Sandí Sánchez
## Phyton, Fast API


## Configuración del Entorno
Antes de comenzar con FastAPI, asegúrate de que tu entorno virtual esté activado. Puedes hacerlo ejecutando los siguientes comandos desde PowerShell o tu terminal preferida:

desde la ruta del proyecto 
```
proyectoio\Scripts\activate
```

## Ejecución de la Aplicación
Una vez que el entorno virtual esté activado, puedes ejecutar tu aplicación FastAPI con el siguiente comando:
```
uvicorn main:app --reload
```

## Adicional
En la ruta http://127.0.0.1:8000/docs se puede ver la documentacion


### Corre en la ruta http://127.0.0.1:8000


# Si no corre por error del entorno 
necesitas volver a crearlo, 
ve a la carpeta BackendSimplex y borra las carpetas proyectoio y _pycache_
haz el comandoque esta acontinuacion, eso creara la carpta proyectoio y _pycache_

```
python -m venv proyectoio
```

Además puedes usa comandos para instalar nuevamente lo que necesario para que funcione el backend

```
proyectoio\Scripts\activate
pip install fastapi
pip install uvicorn
pip install numpy
```
