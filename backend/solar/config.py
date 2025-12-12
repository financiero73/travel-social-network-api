######################################################################################################################
# General Information
######################################################################################################################
# This file contains the Configuration class, which is used to centralize the env configuration for the Solar SDK.
# We should never be calling os.getenv directly in the SDK; instead, we should be calling the properties of this class.


######################################################################################################################
# Dependencies
######################################################################################################################


from pathlib import Path
import sys
import os
from dotenv import load_dotenv
from typing import Union, Dict, Optional

######################################################################################################################
# Configuration Class
######################################################################################################################


class ConfigurationError(Exception):
    pass


class Config:
    """Centralized configuration for Solar SDK environment variables."""

    def __init__(self):
        load_dotenv(dotenv_path=Path(sys.argv[0]).parent / ".env")

    def _throw_if_missing(
        self, throw_if_missing: bool, value: Union[str, None], name: str
    ):
        if value is None and throw_if_missing:
            raise ConfigurationError(f"{name} is not set")

    def s3_client_keys(self, throw_if_missing: bool = True) -> Optional[Dict[str, str]]:
        """Get the keys for the S3 client."""
        self.aws_region = os.getenv("AWS_REGION")
        self.aws_bucket_name = os.getenv("AWS_BUCKET_NAME")
        self.api_key = os.getenv("AWS_S3_KEY")
        self.api_url = os.getenv("ROUTER_BASE_URL")
        self.org_id = os.getenv("SOLAR_ORGANIZATION_ID")
        self.project_id = os.getenv("SOLAR_PROJECT_ID")
        s3_dict = {
            "aws_region": self.aws_region,
            "aws_bucket_name": self.aws_bucket_name,
            "api_key": self.api_key,
            "api_url": self.api_url,
            "org_id": self.org_id,
            "project_id": self.project_id,
        }
        if throw_if_missing:
            for key in s3_dict:
                self._throw_if_missing(True, s3_dict[key], key)
        return s3_dict

    def router_base_url(self, throw_if_missing: bool = True) -> Optional[str]:
        """Get the base URL for the Solar back-end service router."""
        router_base_url_val = os.getenv("ROUTER_BASE_URL")
        self._throw_if_missing(throw_if_missing, router_base_url_val, "ROUTER_BASE_URL")
        return router_base_url_val

    def hosted_postgres_connection_string(
        self, throw_if_missing: bool = True
    ) -> Optional[str]:
        """Get the connection string for the Solar back-end service router."""
        
        # Manus: Check if local DB is configured, if so, don't throw error for NEON_CONN_URL
        db_host = os.getenv("DB_HOST")
        if db_host:
            return None # Don't need NEON_CONN_URL if local DB is set

        hosted_postgres_connection_string_val = os.getenv("NEON_CONN_URL")
        self._throw_if_missing(
            throw_if_missing, hosted_postgres_connection_string_val, "NEON_CONN_URL"
        )
        return hosted_postgres_connection_string_val

    def get_all_pg_connection_strings(self) -> Dict[str, str]:
        # Manus: Check for local DB config first
        db_host = os.getenv("DB_HOST")
        db_port = os.getenv("DB_PORT", "5432")
        db_name = os.getenv("DB_NAME")
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")

        if db_host and db_name and db_user and db_password:
            return {"LOCAL_DB": f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"}

        # End Manus local DB config
        
        """Get all the connection strings for all the tables with PG_CONN prefix."""
        pg_conn_strings = {}
        for key, value in os.environ.items():
            if key.startswith("PG_RESOURCE_"):
                pg_conn_strings[key] = value
        


        neon_conn_url = self.hosted_postgres_connection_string(throw_if_missing=len(pg_conn_strings) == 0)
        if neon_conn_url is not None:
            pg_conn_strings["NEON_CONN_URL"] = neon_conn_url

        return pg_conn_strings

    def get_pg_key_for_table(self, table_class_name: str) -> str:
        """Get the connection string for a given table name."""
        table_name_env_key = table_class_name.upper().replace("-", "_")
        if table_name_env_key == "USER":
            return "NEON_CONN_URL"
        
        # Manus: Force local DB for all tables if local config is set
        db_host = os.getenv("DB_HOST")
        if db_host:
            return "LOCAL_DB"
        connection_string_val = os.getenv(table_name_env_key)
        if connection_string_val is None:
            return "NEON_CONN_URL"
        return connection_string_val

    def model_api_key(self, throw_if_missing: bool = True) -> str:
        """Get the OpenRouter API key for model access."""
        api_key = os.getenv("OPENROUTER_API_KEY")
        self._throw_if_missing(throw_if_missing, api_key, "OPENROUTER_API_KEY")
        return api_key


config = Config()
