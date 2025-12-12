from solar import Table, ColumnDetails
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class TravelPost(Table):
    __tablename__ = "travel_posts"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID  # Reference to TravelUser
    
    # Content
    caption: str
    images: List[str]  # URLs to images
    location_name: str
    location_coordinates: Optional[Dict] = None  # {"lat": float, "lng": float}
    country: str
    city: Optional[str] = None
    
    # Post metadata
    post_type: str  # 'experience', 'food', 'hotel', 'activity', 'tip'
    category: str  # 'adventure', 'luxury', 'budget', 'family', etc.
    tags: List[str]  # ['hiking', 'sunset', 'romantic', etc.]
    
    # Engagement
    likes_count: int = ColumnDetails(default=0)
    saves_count: int = ColumnDetails(default=0)
    comments_count: int = ColumnDetails(default=0)
    shares_count: int = ColumnDetails(default=0)
    
    # Booking information
    booking_info: Optional[Dict] = None  # {"price": str, "booking_url": str, "affiliate_code": str}
    experience_rating: Optional[float] = None  # 1-5 stars
    price_range: Optional[str] = None  # '$', '$$', '$$$', '$$$$'
    
    # Timestamps
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    updated_at: datetime = ColumnDetails(default_factory=datetime.now)
    
    # Status
    is_published: bool = ColumnDetails(default=True)
    is_featured: bool = ColumnDetails(default=False)
    is_sponsored: bool = ColumnDetails(default=False)