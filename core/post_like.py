from solar import Table, ColumnDetails
from datetime import datetime
import uuid

class PostLike(Table):
    __tablename__ = "post_likes"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID  # User who liked
    post_id: uuid.UUID  # Post that was liked
    
    # Timestamps
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    
    # Status
    is_active: bool = ColumnDetails(default=True)