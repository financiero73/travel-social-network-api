from solar import Table, ColumnDetails
from datetime import datetime
import uuid

class Follow(Table):
    __tablename__ = "follows"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    follower_id: uuid.UUID  # User who follows
    following_id: uuid.UUID  # User being followed
    
    # Timestamps
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    
    # Status
    is_active: bool = ColumnDetails(default=True)