from fastapi import Depends, FastAPI, HTTPException, Request, status, Body, UploadFile, File, Form
from fastapi.responses import JSONResponse, Response
from typing import List, Optional, Dict
from uuid import UUID
import uuid
from datetime import datetime

from api.models import TokenExchangeRequest, TokenResponse, TokenValidationRequest, LogoutResponse

app = FastAPI()

REFRESH_TOKEN_COOKIE_NAME = "refresh_token"

@app.post("/api/auth/token", response_model=TokenResponse, include_in_schema=False)
async def token_exchange(request: Request, body: TokenExchangeRequest = Body(...)):
    """
    Exchanges an authorization code for an access token. (MOCK)
    """
    # Simulación de un token de acceso para un usuario fijo
    MOCK_USER_ID = "00000000-0000-0000-0000-000000000001"
    MOCK_ACCESS_TOKEN = f"mock_access_token_{MOCK_USER_ID}"
    MOCK_REFRESH_TOKEN = f"mock_refresh_token_{MOCK_USER_ID}"
    
    token_response = TokenResponse(
        access_token=MOCK_ACCESS_TOKEN,
        token_type="bearer",
        expires_in=3600
    )
    
    content = token_response.model_dump()
    api_response = JSONResponse(content=content)
    
    # Simular la cookie de refresh token
    api_response.set_cookie(
        key=REFRESH_TOKEN_COOKIE_NAME,
        value=MOCK_REFRESH_TOKEN,
        httponly=True,
        secure=True,
        samesite="none",
        path="/api/auth"
    )
    
    return api_response

@app.post("/api/auth/introspect", include_in_schema=False)
async def token_introspect(request: Request, body: TokenValidationRequest = Body(...)):
    """
    Validates an access token. (MOCK)
    """
    # Simulación de la validación del token
    MOCK_USER_ID = "00000000-0000-0000-0000-000000000001"
    
    if body.token.startswith("mock_access_token_"):
        return JSONResponse(content={
            "active": True,
            "userUuid": MOCK_USER_ID,
            "email": "mock.user@example.com",
            "scope": "read write",
            "client_id": "mock_client",
            "exp": int(datetime.now().timestamp()) + 3600
        })
    
    raise HTTPException(status_code=401, detail="Unauthorized")

@app.post("/api/auth/logout", response_model=LogoutResponse, include_in_schema=False)
async def logout():
    response = JSONResponse(content={"success": True})
    response.delete_cookie(key=REFRESH_TOKEN_COOKIE_NAME, path="/api/auth")
    return response
