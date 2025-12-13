"""
User services for managing user data and authentication mapping
"""
from typing import Optional, Dict
from uuid import UUID
from core.travel_user import TravelUser
from solar.access import public


@public
def get_user_uuid_by_clerk_id(clerk_user_id: str) -> Optional[str]:
    """
    Get the internal UUID for a user based on their Clerk user ID.
    Returns None if user doesn't exist.
    """
    results = TravelUser.sql(
        "SELECT id FROM travel_users WHERE clerk_user_id = %(clerk_user_id)s",
        {"clerk_user_id": clerk_user_id}
    )
    
    if results:
        return str(results[0]["id"])
    return None


@public
def get_or_create_user_uuid(clerk_user_id: str, username: str, email: str, display_name: str, profile_image_url: Optional[str] = None) -> str:
    """
    Get existing user UUID or create a new user if they don't exist.
    This is useful for ensuring users exist before creating posts.
    """
    # Try to get existing user
    user_uuid = get_user_uuid_by_clerk_id(clerk_user_id)
    
    if user_uuid:
        return user_uuid
    
    # User doesn't exist, create them
    import uuid
    new_user_id = str(uuid.uuid4())
    
    TravelUser.sql(
        """INSERT INTO travel_users 
           (id, clerk_user_id, email, username, display_name, profile_image_url, created_at)
           VALUES (%(id)s, %(clerk_user_id)s, %(email)s, %(username)s, %(display_name)s, %(profile_image_url)s, NOW())
           ON CONFLICT (clerk_user_id) DO NOTHING""",
        {
            "id": new_user_id,
            "clerk_user_id": clerk_user_id,
            "email": email,
            "username": username,
            "display_name": display_name,
            "profile_image_url": profile_image_url
        }
    )
    
    return new_user_id
