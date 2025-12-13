"""
Webhooks API for handling external service events (Clerk, etc.)
"""
from fastapi import APIRouter, Request, HTTPException, Header
from typing import Optional
import json
import os
from core.travel_user import TravelUser

router = APIRouter()

CLERK_WEBHOOK_SECRET = os.environ.get("CLERK_WEBHOOK_SECRET", "")

@router.post("/api/webhooks/clerk")
async def clerk_webhook(
    request: Request,
    svix_id: Optional[str] = Header(None, alias="svix-id"),
    svix_timestamp: Optional[str] = Header(None, alias="svix-timestamp"),
    svix_signature: Optional[str] = Header(None, alias="svix-signature")
):
    """
    Handle Clerk webhook events for user management.
    
    Events handled:
    - user.created: Create new user in database
    - user.updated: Update existing user
    - user.deleted: Soft delete user
    """
    try:
        # Get the request body
        payload = await request.body()
        event_data = json.loads(payload)
        
        # Extract event type and data
        event_type = event_data.get("type")
        data = event_data.get("data", {})
        
        print(f"📥 Received Clerk webhook: {event_type}")
        
        if event_type == "user.created":
            # Extract user data
            user_id = data.get("id")
            email_addresses = data.get("email_addresses", [])
            email = email_addresses[0].get("email_address") if email_addresses else None
            username = data.get("username")
            first_name = data.get("first_name", "")
            last_name = data.get("last_name", "")
            display_name = f"{first_name} {last_name}".strip() or username
            profile_image_url = data.get("image_url")
            
            # Create user in database with generated UUID
            import uuid
            new_user_id = str(uuid.uuid4())
            
            TravelUser.sql(
                """INSERT INTO travel_users 
                   (id, clerk_user_id, email, username, display_name, profile_image_url, created_at)
                   VALUES (%(id)s, %(clerk_user_id)s, %(email)s, %(username)s, %(display_name)s, %(profile_image_url)s, NOW())
                   ON CONFLICT (clerk_user_id) DO NOTHING""",
                {
                    "id": new_user_id,
                    "clerk_user_id": user_id,
                    "email": email,
                    "username": username,
                    "display_name": display_name,
                    "profile_image_url": profile_image_url
                }
            )
            print(f"✅ Created user: {user_id} ({username})")
        
        elif event_type == "user.updated":
            # Extract user data
            user_id = data.get("id")
            email_addresses = data.get("email_addresses", [])
            email = email_addresses[0].get("email_address") if email_addresses else None
            username = data.get("username")
            first_name = data.get("first_name", "")
            last_name = data.get("last_name", "")
            display_name = f"{first_name} {last_name}".strip() or username
            profile_image_url = data.get("image_url")
            
            # Update user in database
            TravelUser.sql(
                """UPDATE travel_users 
                   SET email = %(email)s, 
                       username = %(username)s,
                       display_name = %(display_name)s,
                       profile_image_url = %(profile_image_url)s,
                       last_active = NOW()
                   WHERE clerk_user_id = %(clerk_user_id)s""",
                {
                    "clerk_user_id": user_id,
                    "email": email,
                    "username": username,
                    "display_name": display_name,
                    "profile_image_url": profile_image_url
                }
            )
            print(f"✅ Updated user: {user_id} ({username})")
        
        elif event_type == "user.deleted":
            # Soft delete user
            user_id = data.get("id")
            TravelUser.sql(
                "UPDATE travel_users SET is_private = true, last_active = NOW() WHERE clerk_user_id = %(clerk_user_id)s",
                {"clerk_user_id": user_id}
            )
            print(f"✅ Deleted user: {user_id}")
        
        return {"success": True, "event": event_type}
    
    except Exception as e:
        print(f"❌ Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
