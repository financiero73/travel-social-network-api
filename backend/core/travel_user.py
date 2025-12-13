from solar import Table, ColumnDetails
from typing import Optional, List
from datetime import datetime
import uuid

class TravelUser(Table):
    __tablename__ = "travel_users"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    clerk_user_id: Optional[str] = None  # Clerk user ID for authentication
    username: str
    email: str
    display_name: str
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    
    # Social stats
    followers_count: int = ColumnDetails(default=0)
    following_count: int = ColumnDetails(default=0)
    posts_count: int = ColumnDetails(default=0)
    
    # Verification and status
    is_verified: bool = ColumnDetails(default=False)
    is_creator: bool = ColumnDetails(default=False)
    creator_tier: Optional[str] = None  # 'bronze', 'silver', 'gold', 'platinum'
    
    # Location and preferences
    location: Optional[str] = None
    travel_style: Optional[List[str]] = None  # ['adventure', 'luxury', 'budget', etc.]
    favorite_destinations: Optional[List[str]] = None
    
    # Timestamps
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    last_active: datetime = ColumnDetails(default_factory=datetime.now)
    
    # Settings
    is_private: bool = ColumnDetails(default=False)
    allow_messages: bool = ColumnDetails(default=True)
    email_notifications: bool = ColumnDetails(default=True)