from solar import Table, ColumnDetails
from datetime import datetime
import uuid

class ReviewVote(Table):
    __tablename__ = "review_votes"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    review_id: uuid.UUID  # Review being voted on
    user_id: uuid.UUID  # User who voted
    
    # Vote type: true = helpful, false = not helpful
    is_helpful: bool
    
    # Timestamps
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    
    # Status
    is_active: bool = ColumnDetails(default=True)
