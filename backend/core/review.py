from solar import Table, ColumnDetails
from datetime import datetime
import uuid
from typing import Optional

class Review(Table):
    __tablename__ = "reviews"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    post_id: uuid.UUID  # Post being reviewed
    user_id: uuid.UUID  # User who wrote the review
    
    # Review content
    rating: int  # 1-5 stars
    comment: Optional[str] = None
    
    # Engagement
    helpful_count: int = ColumnDetails(default=0)
    
    # Timestamps
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    updated_at: datetime = ColumnDetails(default_factory=datetime.now)
    
    # Status
    is_active: bool = ColumnDetails(default=True)
