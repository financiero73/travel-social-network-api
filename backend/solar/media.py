import requests
from pydantic import BaseModel
from typing import Optional
from .config import config
import datetime
import boto3
import uuid
from fastapi import UploadFile # Importar UploadFile para la simulación
import os # Importar os para la simulación de archivos locales

MEDIA_DIR = "/home/ubuntu/media" # Directorio local para medios


class S3Client:
    def __init__(self):
        self.s3_client_keys = config.s3_client_keys()
        self.api_url = self.s3_client_keys["api_url"]
        self.org_id = self.s3_client_keys["org_id"]
        self.project_id = self.s3_client_keys["project_id"]
        self.api_key = self.s3_client_keys["api_key"]
        self.aws_region = self.s3_client_keys["aws_region"]
        self.aws_bucket_name = self.s3_client_keys["aws_bucket_name"]
        self.expiration = None
        self.s3_client = None

    def get_base_path(self) -> str:
        return f"{self.org_id}/{self.project_id}"

    def refresh_client_if_expired(self):
        if (
            self.s3_client is not None
            and self.expiration is not None
            and self.expiration > datetime.datetime.now(datetime.timezone.utc)
        ):
            return
        response = requests.post(
            f"{self.api_url}/aws/get-s3-credentials",
            json={"orgId": self.org_id, "projectId": self.project_id},
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
        )
        if response.status_code != 200:
            raise Exception("Failed to refresh credentials")
        credentials = response.json()
        client = boto3.client(
            "s3",
            aws_access_key_id=credentials["accessKeyId"],
            aws_secret_access_key=credentials["secretAccessKey"],
            aws_session_token=credentials["sessionToken"],
            region_name=self.aws_region,
            config=boto3.session.Config(signature_version="s3v4"),
        )
        self.expiration = datetime.datetime.fromisoformat(
            credentials["expiration"].replace("Z", "+00:00")
        )
        self.s3_client = client


s3_client = None


class MediaFile(BaseModel):
    size: int
    mime_type: str
    bytes: bytes


def get_client():
    global s3_client
    if s3_client is None:
        s3_client = S3Client()
    return s3_client


def save_to_bucket(media_file: MediaFile, file_path: Optional[str] = None):
    """
    SIMULACIÓN: Sube un archivo al sistema de archivos local y devuelve la URL de acceso.
    """
    os.makedirs(MEDIA_DIR, exist_ok=True)
    
    # Generar un nombre de archivo único
    file_extension = f".{media_file.mime_type.split('/')[-1]}"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(MEDIA_DIR, unique_filename)
    
    # Guardar el archivo
    with open(file_path, "wb") as buffer:
        buffer.write(media_file.bytes)
    
    # Devolver la URL de acceso local simulada
    return f"/media/{unique_filename}"


def delete_from_bucket(path: str):
    """
    SIMULACIÓN: Elimina un archivo del sistema de archivos local.
    """
    if path.startswith("/media/"):
        file_path = os.path.join(MEDIA_DIR, path.split("/")[-1])
        if os.path.exists(file_path):
            os.remove(file_path)
    # Ignorar si no es un archivo local simulado o si no existe


def get_from_bucket(path: str) -> MediaFile:
    """
    SIMULACIÓN: Obtiene un archivo del sistema de archivos local.
    """
    if path.startswith("/media/"):
        file_path = os.path.join(MEDIA_DIR, path.split("/")[-1])
        if os.path.exists(file_path):
            with open(file_path, "rb") as f:
                return MediaFile(
                    size=os.path.getsize(file_path),
                    mime_type="image/jpeg", # Asumir un tipo MIME genérico para la simulación
                    bytes=f.read(),
                )
    raise FileNotFoundError(f"File not found in mock media storage: {path}")


def generate_presigned_url(path: str, expires_in: int = 3600) -> str:
    """
    SIMULACIÓN: Devuelve la URL de acceso local.
    """
    return path # La URL de acceso local ya es la ruta simulada
