from solar import Table, ColumnDetails
from typing import Optional
from datetime import datetime
import uuid

class SavedPost(Table):
    __tablename__ = "saved_posts"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID  # User who saved the post
    post_id: uuid.UUID  # Post that was saved
    
    # Organization
    collection_name: Optional[str] = None  # 'Paris Trip', 'Food Goals', etc.
    
    # Timestamps
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    updated_at: datetime = ColumnDetails(default_factory=datetime.now)
    
    # Status
    is_active: bool = ColumnDetails(default=True)
